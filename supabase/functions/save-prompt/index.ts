import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface SavePromptRequest {
  originalPrompt: string;
  enhancedPrompt?: string;
  revisedPrompt?: string;
  style: string;
  productColor: string;
  quality?: string;
  success: boolean;
  errorMessage?: string;
  imageUrl?: string;
  userSession: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method === 'POST') {
      const {
        originalPrompt,
        enhancedPrompt,
        revisedPrompt,
        style,
        productColor,
        quality = 'standard',
        success,
        errorMessage,
        imageUrl,
        userSession
      }: SavePromptRequest = await req.json()

      // Validate required fields
      if (!originalPrompt || !style || !productColor || !userSession) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Insert prompt data
      const { data, error } = await supabaseClient
        .from('user_prompts')
        .insert([
          {
            original_prompt: originalPrompt,
            enhanced_prompt: enhancedPrompt,
            revised_prompt: revisedPrompt,
            style,
            product_color: productColor,
            quality,
            success,
            error_message: errorMessage,
            image_url: imageUrl,
            user_session: userSession,
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) {
        console.error('Database error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to save prompt data' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})