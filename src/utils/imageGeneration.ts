// src/utils/imageGeneration.ts
import OpenAI from 'openai';
import { logPromptToDatabase } from './promptLogger';

// Check if API key is available
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

let openai: OpenAI | null = null;

// Only initialize OpenAI if API key is available
if (apiKey) {
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Only for client-side demos
  });
}

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

const contentGuidelines = "no offensive content, no copyrighted images";

const STYLE_PROMPTS: Record<string, string> = {
  cartoonblocks: "3D cartoon illustration of a blocky game character. Simplified low-poly character design with cube-shaped head, cylindrical limbs, flat textures, and bright vibrant colors. Minimal facial features with expressive face. Stylized low-poly look with clean outlines and no complex shading. Simple background or flat white background. Designed in a generic blocky game art style. No photorealism, no realistic materials, no complex environments, no brand references.",
  cyberpunk: "Focus on the subject. Cyberpunk futuristic illustration with cinematic lighting and immersive depth. Dark neon-lit city environment with glowing signs, reflections on wet surfaces, mist and rain. Bright cyan, magenta, electric blue, and hot pink neon lights. Dynamic side lighting with strong shadows and color glow. Urban background with holographic billboards, flying particles, and futuristic architecture. Designed for bold poster or T-shirt print. No flat circuit patterns, no pure digital UI overlays, no abstract backgrounds. Focus on realistic lighting, depth, and cinematic composition.",
  comic: "catchy vintage manga comic style illustration that would look good on a poster, draw it in a 1960s Saturday-morning adventure style, Single-panel, similar to Pokemon or Digimon, dynamic composition, expressive character poses – thick uniform black ink outlines, flat sun-faded primary colours (sky-blue, warm ochre, golden yellow, cream highlights), subtle halftone texture, and dynamic motion lines. Shot at a slightly low angle so the characters break the frame edges. No modern 3-D shading, gradients, or photographic detail – keep it strictly flat-colour",
  watercolor: "illustration in soft watercolor painting style with organic flowing aestheticsthat would look good on a poster. Gentle color bleeds, transparent layered washes, soft brush stroke textures, natural color transitions, dreamy atmospheric effects. Use flowing organic shapes with artistic spontaneity and natural color palettes like soft blues, gentle greens, and warm earth tones. Controlled bleeding effects.",
  realistic: "Design in photorealistic style with detailed lifelike rendering. Looks good at a poster. High-quality photographic aesthetics, detailed textures, natural lighting and shadows, accurate proportions, realistic materials and surfaces. Use professional photography composition with crisp details and lifelike color accuracy.",
  "black-and-white": "Black and white realistic vintage photograph, highly detailed, sharp focus, dramatic lighting with strong shadows, high contrast, retro aesthetic, centered composition, no background noise, plain background.",
  botanical: "Hand-drawn botanical illustration with delicate line work and subtle shading. Detailed flowers, leaves, and stems in natural composition. Minimalist approach with clean lines, scientific illustration style, elegant and refined aesthetic.",
  "cartoon-avatar": "2D minimalistic cartoon character avatar with exaggerated features, clean white #ffffff background, large expressive eyes, clean bold outlines, bright saturated colors. Modern emoji/avatar style similar to Apple Memoji, friendly and approachable design",
  "childrens-book": "2D flat Children's book illustration style with soft pastel colors like warm beige, soft blue, pastel green, whimsical characters, hand-painted texture, playful composition. Friendly and approachable aesthetic suitable for young audiences, storybook quality, would look good on a tshirt, white background.",
  grunge: "Grunge rock poster style with distressed textures, rough edges, high contrast black, white with selective red accents. Raw, edgy aesthetic with worn textures and bold typography elements.",
  "vintage-comic": "Black and white vintage comic panel illustration, highly detailed, realistic rendering, heavy ink shading, bold lines, high contrast, comic speech bubbles in cartoon style where needed, square format, no color, no background noise, clean composition"
};

const technicalSpecs = "High resolution, professional quality, optimized for printing, centered composition, clean edges, no background noise or artifacts.";

function getBackgroundInstruction(productColor: string): string {
  const colorLower = productColor.toLowerCase();
  
  if (colorLower.includes('black')) {
    return "Subject centered in frame, large and dominant, taking up most of the frame. Use bright, light colors and white elements that will stand out against a black background. Avoid dark colors, black elements, or low contrast designs. Ensure high contrast with light, vibrant colors.";
  } else if (colorLower.includes('white')) {
    return "Subject centered in frame, large and dominant, taking up most of the frame. Use dark, bold colors and black elements that will stand out against a white background. Avoid light colors, white elements, or low contrast designs. Ensure high contrast with dark, vibrant colors.";
  } else {
    return "Subject centered in frame, large and dominant, taking up most of the frame. Use contrasting colors that will stand out against the product background. Ensure good visibility and contrast.";
  }
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
  const enhancedPrompt = enhancePrompt(prompt, style, productColor);
  
  try {
    // Check if OpenAI is available
    if (!openai) {
      // Log failed attempt
      await logPromptToDatabase({
        originalPrompt: prompt,
        enhancedPrompt,
        style,
        productColor,
        quality,
        success: false,
        errorMessage: 'AI image generation is currently unavailable'
      });

      return {
        success: false,
        error: 'AI image generation is currently unavailable. Please join our waitlist to be notified when this feature is ready!'
      };
    }

    if (!prompt?.trim()) {
      await logPromptToDatabase({
        originalPrompt: prompt,
        enhancedPrompt,
        style,
        productColor,
        quality,
        success: false,
        errorMessage: 'Empty prompt provided'
      });

      return {
        success: false,
        error: 'Please provide a design prompt'
      };
    }

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
      await logPromptToDatabase({
        originalPrompt: prompt,
        enhancedPrompt,
        style,
        productColor,
        quality,
        success: false,
        errorMessage: 'No image was generated'
      });

      return {
        success: false,
        error: 'No image was generated'
      };
    }

    // Log successful generation
    await logPromptToDatabase({
      originalPrompt: prompt,
      enhancedPrompt,
      revisedPrompt: response.data[0]?.revised_prompt,
      style,
      productColor,
      quality,
      success: true,
      imageUrl
    });

    return {
      success: true,
      imageUrl,
      prompt: enhancedPrompt,
      revisedPrompt: response.data[0]?.revised_prompt,
      quality
    };

  } catch (error: any) {
    console.error('DALL-E 3 API Error:', error);

    let errorMessage = 'AI image generation is currently unavailable';
    
    if (error?.error?.code === 'content_policy_violation') {
      errorMessage = 'Content policy violation. Please try a different prompt.';
    } else if (error?.error?.code === 'rate_limit_exceeded') {
      errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
    } else if (error?.error?.code === 'insufficient_quota') {
      errorMessage = 'API quota exceeded. Please check your OpenAI account.';
    }

    // Log failed generation
    await logPromptToDatabase({
      originalPrompt: prompt,
      enhancedPrompt,
      style,
      productColor,
      quality,
      success: false,
      errorMessage: error?.message || errorMessage
    });

    return {
      success: false,
      error: errorMessage
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