// src/utils/imageGeneration.ts
// ———————————————————————————————————————————————
// This client file no longer imports the OpenAI SDK or accesses
// `import.meta.env.VITE_OPENAI_API_KEY` (which leaks secrets into Vite’s bundle).
// Instead, it POSTS prompts to an Edge Function that holds the key server-side.
// ———————————————————————————————————————————————

import { logPromptToDatabase } from './promptLogger';

// -----------------------------------------------------------------------------
// Utility: enhance the user prompt (same as before)
// -----------------------------------------------------------------------------
const contentGuidelines =
  'no offensive content, no copyrighted images';

const STYLE_PROMPTS: Record<string, string> = { /* … unchanged … */ };
const technicalSpecs =
  'High resolution, professional quality, optimized for printing, centered composition, clean edges, no background noise or artifacts.';

function getBackgroundInstruction(productColor: string): string { /* … unchanged … */ }

function enhancePrompt(
  userPrompt: string,
  style: string,
  productColor: string
): string { /* … unchanged … */ }

// -----------------------------------------------------------------------------
// POST helper — all generation happens in the Edge Function
// -----------------------------------------------------------------------------
const EDGE_ENDPOINT = '/.netlify/edge-functions/generateDesign';

async function callEdgeForImage(
  prompt: string,
  quality: 'low' | 'hd'
): Promise<{ url?: string; revised_prompt?: string; error?: string }> {
  const res = await fetch(EDGE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, quality })
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({}));
    throw new Error(error || `Edge returned ${res.status}`);
  }

  return res.json();
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------
interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  prompt?: string;
  revisedPrompt?: string;
  quality?: string;
  error?: string;
}

export async function generateDesign(
  prompt: string,
  style: string,
  productColor: string,
  quality: 'low' | 'hd' = 'low'
): Promise<GenerationResult> {
  const enhancedPrompt = enhancePrompt(prompt, style, productColor);

  if (!prompt.trim()) {
    return { success: false, error: 'Please provide a design prompt' };
  }

  try {
    const { url, revised_prompt: revisedPrompt } = await callEdgeForImage(
      enhancedPrompt,
      quality
    );

    if (!url) {
      throw new Error('No image returned');
    }

    await logPromptToDatabase({
      originalPrompt: prompt,
      enhancedPrompt,
      revisedPrompt,
      style,
      productColor,
      quality,
      success: true,
      imageUrl: url
    });

    return {
      success: true,
      imageUrl: url,
      prompt: enhancedPrompt,
      revisedPrompt,
      quality
    };
  } catch (err: any) {
    const msg =
      err.message || 'AI image generation is currently unavailable';

    await logPromptToDatabase({
      originalPrompt: prompt,
      enhancedPrompt,
      style,
      productColor,
      quality,
      success: false,
      errorMessage: msg
    });

    return { success: false, error: msg };
  }
}

export async function generateHDDesignForCheckout(
  prompt: string,
  style: string,
  productColor: string
) {
  return generateDesign(prompt, style, productColor, 'hd');
}
