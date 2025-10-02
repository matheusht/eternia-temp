import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-shop-token",
};

interface CartPandaWebhookPayload {
  event: string;
  order: {
    email?: string;
    customer?: {
      email?: string;
    };
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== Incoming webhook request ===");
    console.log("Method:", req.method);
    console.log("Headers:", Object.fromEntries(req.headers.entries()));

    const payload: CartPandaWebhookPayload = await req.json();

    console.log("Received CartPanda webhook event:", payload.event);
    console.log("Full payload:", JSON.stringify(payload, null, 2));

    let customerEmail: string | undefined;

    if (payload.order?.email) {
      customerEmail = payload.order.email;
      console.log("Email found at: order.email");
    } else if (payload.order?.customer?.email) {
      customerEmail = payload.order.customer.email;
      console.log("Email found at: order.customer.email");
    }

    if (!customerEmail) {
      console.error("No email found in webhook payload");
      return new Response(
        JSON.stringify({ error: "No customer email found in payload" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log("Creating user for email:", customerEmail);

    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users.some(
      (user) => user.email === customerEmail
    );

    if (userExists) {
      console.log("User already exists:", customerEmail);
      return new Response(
        JSON.stringify({
          success: true,
          message: "User already exists",
          email: customerEmail,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email: customerEmail,
        password: "123456",
        email_confirm: true,
      });

    if (userError) {
      console.error("Error creating user:", userError);
      return new Response(JSON.stringify({ error: userError.message }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("User created successfully:", userData.user?.id);

    return new Response(
      JSON.stringify({
        success: true,
        user_id: userData.user?.id,
        email: userData.user?.email,
        message: "User created successfully from CartPanda purchase",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in cartpanda-webhook function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
