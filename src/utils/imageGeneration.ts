// src/utils/imageGeneration.ts
// ----------------------------------------------------------------------------
//  CLIENT-SIDE helper utilities for generating designs via the Edge Function.
//  No OpenAI SDK, no import.meta.env.*, so no secrets leak into the bundle.
// ----------------------------------------------------------------------------

import { logPromptToDatabase } from './promptLogger';

/* ------------------------------------------------------------------------- */
/*  Prompt validation                                                        */
/* ------------------------------------------------------------------------- */

export function validatePrompt(
  prompt: string
): { valid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, error: 'Please enter a description for your design' };
  }

  if (prompt.length > 1000) {
    return {
      valid: false,
      error: 'Prompt is too long. Please keep it under 1000 characters.'
    };
  }

  const blocked = [
    'nsfw',
    'explicit',
    'nude',
    'sexual',
    'violence',
    'gore',
    'hate'
  ];
  const lower = prompt.toLowerCase();
  if (blocked.some(term => lower.includes(term))) {
    return {
      valid: false,
      error: 'Please use appropriate content for your design'
    };
  }

  return { valid: true };
}

/* ------------------------------------------------------------------------- */
/*  Prompt-enhancement helpers (unchanged from the original file)            */
/* ------------------------------------------------------------------------- */

const contentGuidelines =
  'no offensive content, no copyrighted images';

const STYLE_PROMPTS: Record<string, string> = {
  /* … existing long style-prompt map, unchanged … */
  cartoonblocks:
    '3D cartoon illustration of a blocky game character. Simplified low-poly character design with cube-shaped head, cylindrical limbs, flat textures, and bright vibrant colors. Minimal facial features with expressive face. Stylized low-poly look with clean outlines and no complex shading. Simple background or flat white background. Designed in a generic blocky game art style. No photorealism, no realistic materials, no complex environments, no brand references.',
  cyberpunk:
    'Focus on the subject. Cyberpunk futuristic illustration with cinematic lighting and immersive depth. Dark neon-lit city environment with glowing signs, reflections on wet surfaces, mist and rain. Bright cyan, magenta, electric blue, and hot pink neon lights. Dynamic side lighting with strong shadows and color glow. Urban background with holographic billboards, flying particles, and futuristic architecture. Designed for bold poster or T-shirt print. No flat circuit patterns, no pure digital UI overlays, no abstract backgrounds. Focus on realistic lighting, depth, and cinematic composition.',
  /* … keep the rest of your STYLE_PROMPTS exactly as before … */
  'vintage-comic':
    'Black and white vintage comic panel illustration, highly detailed, realistic rendering, heavy ink shading, bold lines, high contrast, comic speech bubbles in cartoon style where needed, square format, no color, no background noise, clean composition'
};

const technicalSpecs =
  'High resolution, professional quality, optimized for printing, centered composition, clean edges, no background noise or artifacts.';

function getBackgroundInstruction(productColor: string): string {
  const lower = productColor.toLowerCase();

  if (lower.includes('black')) {
    return 'Subject centered in frame, large and dominant, taking up most of the frame. Use bright, light colors and white elements that will stand out against a black background. Avoid dark colors, black elements, or low contrast designs. Ensure high contrast with light, vibrant colors.';
  }
  if (lower.includes('white')) {
    return 'Subject centered in frame, large and dominant, taking up most of the frame. Use dark, bold colors and black elements that will stand out against a white background. Avoid light colors, white elements, or low contrast designs. Ensure high contrast with dark, vibrant colors.';
  }
  return 'Subject centered in frame, large and dominant, taking up most of the frame. Use contrasting colors that will stand out against the product background. Ensure good visibility and contrast.';
}

function enhancePrompt(
  userPrompt: string,
  style: string,
  productColor: string
): string {
  const clean = userPrompt
    .trim()
    .replace(/[^\w\s.,!?'-]/g, '')
    .replace(/\s+/g, ' ');

  const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.realistic;
  const bg = getBackgroundInstruction(productColor);

  return `${clean}. Style: ${stylePrompt}. Background: ${bg}. Technical: ${technicalSpecs}. Content: ${contentGuidelines}`;
}

/* ------------------------------------------------------------------------- */
/*  Helper to call the Edge Function                                         */
/* ------------------------------------------------------------------------- */

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

/* ------------------------------------------------------------------------- */
/*  Public API                                                               */
/* ------------------------------------------------------------------------- */

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
  const validation = validatePrompt(prompt);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const enhancedPrompt = enhancePrompt(prompt, style, productColor);

  try {
    const { url, revised_prompt: revisedPrompt } = await callEdgeForImage(
      enhancedPrompt,
      quality
    );

    if (!url) throw new Error('No image returned');

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
    const message =
      err.message || 'AI image generation is currently unavailable';

    await logPromptToDatabase({
      originalPrompt: prompt,
      enhancedPrompt,
      style,
      productColor,
      quality,
      success: false,
      errorMessage: message
    });

    return { success: false, error: message };
  }
}

export async function generateHDDesignForCheckout(
  prompt: string,
  style: string,
  productColor: string
) {
  return generateDesign(prompt, style, productColor, 'hd');
}
