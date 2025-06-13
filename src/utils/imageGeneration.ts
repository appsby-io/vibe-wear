// src/utils/imageGeneration.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for client-side demos
});

// Validation function for prompts
export function validatePrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return {
      valid: false,
      error: 'Please enter a description for your design'
    };
  }

  if (prompt.length > 1000) {
    return {
      valid: false,
      error: 'Prompt is too long. Please keep it under 1000 characters.'
    };
  }

  const inappropriateTerms = ['nsfw', 'explicit', 'nude', 'sexual', 'violence', 'gore', 'hate'];
  const lowerPrompt = prompt.toLowerCase();

  for (const term of inappropriateTerms) {
    if (lowerPrompt.includes(term)) {
      return {
        valid: false,
        error: 'Please use appropriate content for your design'
      };
    }
  }

  return { valid: true };
}

const contentGuidelines = "no offensive or inappropriate material";

const STYLE_PROMPTS: Record<string, string> = {
  cartoonblocks: "3D cartoon illustration of a blocky game character. Simplified low-poly character design with cube-shaped head, cylindrical limbs, flat textures, and bright vibrant colors. Minimal facial features with expressive face. Stylized low-poly look with clean outlines and no complex shading. Simple background or flat white background. Designed in a generic blocky game art style. No photorealism, no realistic materials, no complex environments, no brand references.",
  cyberpunk: "Focus on the subject. Cyberpunk futuristic illustration with cinematic lighting and immersive depth. Dark neon-lit city environment with glowing signs, reflections on wet surfaces, mist and rain. Bright cyan, magenta, electric blue, and hot pink neon lights. Dynamic side lighting with strong shadows and color glow. Urban background with holographic billboards, flying particles, and futuristic architecture. Designed for bold poster or T-shirt print. No flat circuit patterns, no pure digital UI overlays, no abstract backgrounds. Focus on realistic lighting, depth, and cinematic composition.",
  comic: "catchy vintage manga comic style Single-panel comic illustration that would look good on a poster: Draw it in a 1960s Saturday-morning adventure-comic style, similar to Pokemon or Digimon, dynamic composition, expressive character poses – thick uniform black ink outlines, flat sun-faded primary colours (sky-blue, warm ochre, golden yellow, cream highlights), subtle halftone texture, and dynamic motion lines. Shot at a slightly low, mid-distance angle so the characters break the frame edges. No modern 3-D shading, gradients, or photographic detail – keep it strictly flat-colour",
  watercolor: "Design in soft watercolor painting style with organic flowing aesthetics. Gentle color bleeds, transparent layered washes, soft brush stroke textures, natural color transitions, dreamy atmospheric effects. Use flowing organic shapes with artistic spontaneity and natural color palettes like soft blues, gentle greens, and warm earth tones. Controlled bleeding effects.",
  realistic: "Design in photorealistic style with detailed lifelike rendering. High-quality photographic aesthetics, detailed textures, natural lighting and shadows, accurate proportions, realistic materials and surfaces. Use professional photography composition with crisp details and lifelike color accuracy.",
  "black-and-white": "Black and white realistic vintage photograph, highly detailed, sharp focus, dramatic lighting with strong shadows, high contrast, retro aesthetic, centered composition, no background noise, plain background.",
  botanical: "Hand-drawn botanical illustration with delicate line work and subtle shading. Detailed flowers, leaves, and stems in natural composition. Minimalist approach with clean lines, scientific illustration style, elegant and refined aesthetic.",
  "cartoon-avatar": "2D cartoon character style with exaggerated features, clean white #ffffff background, large expressive eyes, clean bold outlines, bright saturated colors, glossy highlights. Modern emoji/avatar style similar to Apple Memoji, friendly and approachable design",
  "childrens-book": "Children's book illustration style with soft colors, whimsical characters, hand-painted texture, playful composition. Friendly and approachable aesthetic suitable for young audiences, storybook quality.",
  grunge: "Grunge rock poster style with distressed textures, rough edges, high contrast black, white with selective red accents. Raw, edgy aesthetic with worn textures and bold typography elements.",
  "vintage-comic": "Black and white vintage comic panel illustration, highly detailed, realistic rendering, heavy ink shading, bold lines, high contrast, comic speech bubbles in cartoon style where needed, square format, no color, no background noise, clean composition"
};

const technicalSpecs = "Professional quality, high resolution, centered composition, clear details, as a stand-alone printable graphic (screen-print friendly, high-contrast, 300 dpi look). Isolated on plain background, no fabric, no mock-up, no product photo";

function getBackgroundInstruction(productColor: string): string {
  const colorLower = productColor.toLowerCase();
  return "Subject centered in frame, large and dominant, taking up most of the frame";
}

function enhancePrompt(userPrompt: string, style: string, productColor: string): string {
  const cleanPrompt = userPrompt.trim()
    .replace(/[^\w\s.,!?'-]/g, '')
    .replace(/\s+/g, ' ');

  const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.realistic;
  const backgroundInstruction = getBackgroundInstruction(productColor);

  return `${cleanPrompt}. Style: ${stylePrompt}. Background: ${backgroundInstruction}. Technical: ${technicalSpecs}. Content: ${contentGuidelines}`;
}

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
  try {
    if (!prompt?.trim()) {
      return {
        success: false,
        error: 'Please provide a design prompt'
      };
    }

    const enhancedPrompt = enhancePrompt(prompt, style, productColor);
    console.log('Enhanced prompt (DALL-E 3):', enhancedPrompt);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      quality: quality === 'hd' ? 'hd' : 'standard',
      size: "1024x1024",
      n: 1
    });

    console.log('DALL-E 3 API Response:', response);

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      return {
        success: false,
        error: 'No image was generated'
      };
    }

    return {
      success: true,
      imageUrl,
      prompt: enhancedPrompt,
      revisedPrompt: response.data[0]?.revised_prompt,
      quality
    };

  } catch (error: any) {
    console.error('DALL-E 3 API Error:', error);

    if (error?.error?.code === 'content_policy_violation') {
      return {
        success: false,
        error: 'Content policy violation. Please try a different prompt.'
      };
    }

    if (error?.error?.code === 'rate_limit_exceeded') {
      return {
        success: false,
        error: 'Rate limit exceeded. Please wait a moment and try again.'
      };
    }

    if (error?.error?.code === 'insufficient_quota') {
      return {
        success: false,
        error: 'API quota exceeded. Please check your OpenAI account.'
      };
    }

    return {
      success: false,
      error: error?.message || 'Failed to generate image. Please try again.'
    };
  }
}

export async function generateHDDesignForCheckout(
  prompt: string,
  style: string,
  productColor: string
): Promise<GenerationResult> {
  return generateDesign(prompt, style, productColor, 'hd');
}