import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-shop-token",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("===========================================");
    console.log("🔔 NEW WEBHOOK REQUEST RECEIVED!");
    console.log("===========================================");
    console.log("📅 Timestamp:", new Date().toISOString());
    console.log("🔗 Method:", req.method);
    console.log("🔗 URL:", req.url);

    console.log("\n📋 ALL HEADERS:");
    console.log("-------------------------------------------");
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
      console.log(`  ${key}: ${value}`);
    });

    let body: any = null;
    let bodyText = "";

    try {
      bodyText = await req.text();
      console.log("\n📦 RAW BODY:");
      console.log("-------------------------------------------");
      console.log(bodyText);

      if (bodyText) {
        body = JSON.parse(bodyText);
        console.log("\n📦 PARSED JSON BODY:");
        console.log("-------------------------------------------");
        console.log(JSON.stringify(body, null, 2));
      }
    } catch (e) {
      console.log("⚠️  Could not parse body as JSON:", e.message);
    }

    console.log("\n===========================================");
    console.log("✅ REQUEST LOGGED SUCCESSFULLY");
    console.log("===========================================\n");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook received! Check Supabase logs to see what was sent.",
        received: {
          timestamp: new Date().toISOString(),
          method: req.method,
          headers: headers,
          body: body,
          rawBody: bodyText,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("❌ ERROR:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
