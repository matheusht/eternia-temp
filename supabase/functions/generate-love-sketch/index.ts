import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      promptDescription, 
      physicalTraits, 
      personalityTraits, 
      artisticStyle,
      userSign,
      userElement 
    } = await req.json();

    console.log('Love sketch generation request received');

    // Get authorization header and create Supabase client
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized. Please log in again.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user from auth header
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized. Please log in again.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('User authenticated:', user.id);

    // Check daily limit (2 sketches per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: todaySketches, error: countError } = await supabaseClient
      .from('love_sketches')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    if (countError) {
      console.error('Error checking daily limit:', countError);
    }

    const dailyCount = todaySketches?.length || 0;
    console.log('Daily sketch count:', dailyCount);
    
    if (dailyCount >= 2) {
      console.log('Daily limit reached for user:', user.id);
      return new Response(JSON.stringify({ 
        error: 'Daily limit reached. You can create up to 2 love sketches per day. Try again tomorrow!' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not configured');
      return new Response(JSON.stringify({ 
        error: 'Server configuration incomplete. Please contact support.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create ultra-realistic photographic portrait prompt
    const ultraRealisticPrompt = `Ultra-realistic professional portrait photography of a person with these characteristics:

PHYSICAL FEATURES: ${physicalTraits}
PERSONALITY EXPRESSION: ${personalityTraits}

PHOTOGRAPHY SPECIFICATIONS:
- Shot with Canon EOS R5, 85mm lens, f/1.4 aperture
- Studio lighting: Key light with softbox, subtle rim lighting
- Professional headshot composition, waist-up portrait
- 8K resolution, RAW format quality
- Natural skin texture with pores, subtle imperfections
- Photojournalistic realism, no digital painting style

LIGHTING & MOOD:
- Golden hour natural lighting through large window
- Soft shadows, perfect exposure balance
- Eye light catchlights, natural iris detail
- ${artisticStyle} aesthetic with professional photographer quality

TECHNICAL DETAILS:
- Hyperrealistic human features, not illustration
- Natural facial expressions and micro-expressions
- Realistic hair texture and movement
- Professional makeup, natural skin tones
- Sharp focus on eyes, shallow depth of field
- Commercial photography standard

${promptDescription}

CRITICAL: This must look like an actual photograph taken by a professional photographer, not an artistic rendering. Focus on photographic realism, natural human features, and technical photography excellence.`;

    console.log('Generating ultra-realistic image with prompt:', ultraRealisticPrompt);

    console.log('Making request to OpenAI with model: dall-e-3');

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: ultraRealisticPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'natural',
        response_format: 'b64_json'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', response.status, errorData);
      
      // Check for specific error types
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Too many requests to image API. Please try again in a few seconds.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 401) {
        return new Response(JSON.stringify({ 
          error: 'API credentials issue. Please contact support.' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Check for insufficient credits
      if (errorData.error?.code === 'insufficient_quota' || errorData.error?.message?.includes('quota')) {
        return new Response(JSON.stringify({ 
          error: 'API credits exhausted. Please contact support.' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ 
        error: `Error generating image: ${errorData.error?.message || 'Unknown error'}` 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    // gpt-image-1 returns base64 directly in the response format
    const imageUrl = data.data[0]?.b64_json || data.data[0]?.url;
    if (!imageUrl) {
      console.error('No image in response:', data);
      return new Response(JSON.stringify({ 
        error: 'No image was generated. Please try again.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log('Image generated successfully');

    // Generate mystical interpretation
    const interpretationPrompt = `Based on this love sketch description and the user's astrological profile (${userSign} - ${userElement}), provide a mystical interpretation of what this connection represents spiritually and emotionally. Keep it positive, romantic, and spiritually insightful in English.

Description: ${promptDescription}
Physical traits: ${physicalTraits}
Personality: ${personalityTraits}`;

    const interpretationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a mystical expert in astrology and love. Provide positive romantic and spiritual interpretations.' 
          },
          { role: 'user', content: interpretationPrompt }
        ],
        max_tokens: 300,
        temperature: 0.7
      }),
    });

    const interpretationData = await interpretationResponse.json();
    const interpretation = interpretationData.choices[0]?.message?.content || 'A special connection awaits to be discovered through the stars.';

    return new Response(JSON.stringify({ 
      imageUrl: `data:image/png;base64,${imageUrl}`,
      interpretation 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-love-sketch function:', error);
    return new Response(JSON.stringify({ 
      error: `Error processing request: ${error.message || 'Unknown error'}` 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});