// netlify/edge-functions/generateDesign.ts
/// <reference types="@netlify/edge-functions" />

import { Context } from "@netlify/edge-functions";
import OpenAI from "openai";

// Read the secret *only* at the edge (never sent to the browser)
const openai = new OpenAI({
  apiKey: Netlify.env.get("VITE_OPENAI_API_KEY_SERVER")   // <-- set this in Netlify UI
});

export default async (req: Request, _ctx: Context) => {
  try {
    const { prompt, quality = "low" } = await req.json();

    // Basic validation
    if (!prompt || typeof prompt !== "string") {
      return new Response("Missing prompt", { status: 400 });
    }

    // Call the Images endpoint (GPT-Image-1 or DALL·E 3)
    const res = await openai.images.generate({
      model: "gpt-image-1",                  // or "dall-e-3"
      prompt,
      quality: quality === "hd" ? "hd" : "standard",
      size: "1024x1024",
      n: 1
    });

    return Response.json(res);              // { created, data:[{url|b64_json}] }
  } catch (err: any) {
    console.error("Edge Function error:", err);
    return new Response(
      `OpenAI error: ${err.message || "unknown"}`,
      { status: 500 }
    );
  }
};
