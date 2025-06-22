// netlify/edge-functions/analyzeImage.ts
/// <reference types="@netlify/edge-functions" />

import { Context } from "@netlify/edge-functions";

declare global {
  const Netlify: {
    env: {
      get(key: string): string | undefined;
    };
  };
}

export default async (req: Request, _ctx: Context) => {
  try {
    const { type, payload } = await req.json();

    const apiKey = Netlify.env.get("VITE_OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }), 
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Call OpenAI Chat Completions API directly
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${response.status}` }), 
        { 
          status: response.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const data = await response.json();
    
    // Return the analysis result based on type
    let result = {};
    const content = data.choices[0]?.message?.content;
    
    switch (type) {
      case 'single':
        result = { analysis: content };
        break;
      case 'compare':
        result = { comparison: content };
        break;
      case 'suggest':
        result = { suggestions: content };
        break;
      default:
        result = { content };
    }

    return new Response(
      JSON.stringify({
        data: {
          ...result,
          usage: data.usage
        }
      }), 
      {
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (err: any) {
    console.error("Edge Function error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};