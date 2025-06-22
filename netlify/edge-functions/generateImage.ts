/// <reference types="@netlify/edge-functions" />

import type { Context } from "@netlify/edge-functions";

declare global {
  const Netlify: {
    env: {
      get(key: string): string | undefined;
    };
  };
}

export default async (req: Request, _ctx: Context) => {
  // Read the prompt JSON { prompt: "..." }
  const { prompt } = await req.json();

  // Call OpenAI Images API (GPT-Image-1)
  const apiRes = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Netlify.env.get("OPENAI_API_KEY_SERVER")}`, // 🔐 secret stays on the edge
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-image-1",   // same model ID shown in the official docs :contentReference[oaicite:0]{index=0}
      prompt,
      n: 1,
      size: "1024x1024"       // 512×512 and 2048×2048 are also allowed :contentReference[oaicite:1]{index=1}
    })
  });

  if (!apiRes.ok) {
    return new Response(
      `OpenAI error ${apiRes.status}: ${await apiRes.text()}`,
      { status: apiRes.status }
    );
  }

  // Forward the JSON payload ({ created, data:[{url|b64_json}] })
  const data = await apiRes.json();
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" }
  });
};
