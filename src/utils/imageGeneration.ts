// src/utils/imageGeneration.ts
import { logPromptToDatabase } from './promptLogger';

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

    console.log('Enhanced prompt (gpt-image-1):', enhancedPrompt);

    // Use Netlify edge function for secure image generation
    const response = await fetch('/.netlify/edge-functions/generateImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        quality: quality === 'hd' ? 'hd' : 'standard',
        size: "1024x1024"
      })
    });

    if (!response.ok) {
      let errorMessage = 'AI image generation is currently unavailable. Please try again later.';
      let errorDetails = '';
      
      try {
        const errorData = await response.json();
        errorDetails = errorData.details || '';
        
        // Provide more specific error messages
        if (errorData.error?.includes('API key not configured')) {
          errorMessage = 'Image generation service is not configured. Please contact support.';
        } else if (errorData.error?.includes('model_not_found') || errorData.error?.includes('gpt-image-1')) {
          errorMessage = 'The requested image model (gpt-image-1) is not available. You may need to apply for access or use dall-e-3 instead.';
        } else if (response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (response.status === 401 || response.status === 403) {
          errorMessage = 'Authentication failed. Please check your API access.';
        } else if (errorData.error) {
          // Show the actual error from the API
          errorMessage = errorData.error;
        }
        
        console.error('Netlify function error:', errorData);
      } catch (e) {
        // If response isn't JSON, try to parse as text
        const errorText = await response.text();
        console.error('Netlify function error (text):', errorText);
      }
      
      await logPromptToDatabase({
        originalPrompt: prompt,
        enhancedPrompt,
        style,
        productColor,
        quality,
        success: false,
        errorMessage: `API Error: ${response.status} - ${errorDetails}`
      });

      return {
        success: false,
        error: errorMessage
      };
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

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
      revisedPrompt: data.data?.[0]?.revised_prompt,
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
      revisedPrompt: data.data?.[0]?.revised_prompt,
      quality
    };

  } catch (error: unknown) {
    console.error('Image generation error:', error);

    const errorMessage = error instanceof Error ? error.message : 'AI image generation is currently unavailable';

    // Log failed generation
    await logPromptToDatabase({
      originalPrompt: prompt,
      enhancedPrompt,
      style,
      productColor,
      quality,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: 'AI image generation is currently unavailable. Please try again later.'
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