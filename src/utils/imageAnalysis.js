// src/utils/imageAnalysis.js

// -----------------------------------------------------------------------------
// Helper – POST a payload to the Edge Function that actually holds the secret
// -----------------------------------------------------------------------------
const EDGE_ENDPOINT = '/.netlify/edge-functions/analyzeImage';

async function postToEdge(type, payload) {
  try {
    const res = await fetch(EDGE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload })
    });

    if (!res.ok) {
      throw new Error(`Edge function returned ${res.status}`);
    }

    const { data } = await res.json(); // { data: { analysis|comparison|suggestions, usage } }
    return { success: true, ...data };
  } catch (err) {
    console.error('Edge-function error:', err);
    return {
      success: false,
      error:
        'AI analysis is currently unavailable. Please join our waitlist to be notified when this feature is ready!',
      originalError: err.message
    };
  }
}

// -----------------------------------------------------------------------------
// 1. Single design analysis
// -----------------------------------------------------------------------------
export async function analyzeDesignWithGPT4o(
  imageUrl,
  originalPrompt,
  selectedStyle,
  productColor
) {
  const systemMessage = `You are an expert product design analyst and art director. Analyze the provided image and give constructive feedback on:

1. **Style Consistency**: How well does it match the requested style?
2. **Product Suitability**: How well would this work as a product design?
3. **Color & Contrast**: How well do the colors work for the specified product color (${productColor})?
4. **Composition**: Is the design well-centered and appropriately sized?
5. **Print Quality**: Would this translate well to fabric printing?
6. **Improvement Suggestions**: Specific ways to improve the prompt for better results.`;

  const userMessage = `Please analyze this product design image:

**Original Prompt**: "${originalPrompt}"
**Requested Style**: ${selectedStyle}
**Product Color**: ${productColor}

Provide detailed feedback on the design quality and specific suggestions for improvement.`;

  const payload = {
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemMessage },
      {
        role: 'user',
        content: [
          { type: 'text', text: userMessage },
          { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } }
        ]
      }
    ],
    max_tokens: 1000,
    temperature: 0.3
  };

  return postToEdge('single', payload);
}

// -----------------------------------------------------------------------------
// 2. Compare multiple design variations
// -----------------------------------------------------------------------------
export async function compareDesigns(
  designs,
  originalPrompt,
  selectedStyle,
  productColor
) {
  const systemMessage = `You are an expert product design analyst. Compare multiple design variations and provide:

1. **Best Design**: Which design works best and why?
2. **Consistency Analysis**: How consistent are the designs with each other?
3. **Style Adherence**: Which design best matches the requested style?
4. **Ranking**: Rank the designs from best to worst with reasons.
5. **Pattern Recognition**: What patterns do you notice in the variations?`;

  const userMessage = `Compare these ${designs.length} design variations:

**Original Prompt**: "${originalPrompt}"
**Requested Style**: ${selectedStyle}
**Product Color**: ${productColor}

Please analyze and compare all designs, providing specific feedback on which works best and why.`;

  const imageMessages = designs.map((d) => ({
    type: 'image_url',
    image_url: { url: d.imageUrl, detail: 'high' }
  }));

  const payload = {
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: [{ type: 'text', text: userMessage }, ...imageMessages] }
    ],
    max_tokens: 1500,
    temperature: 0.3
  };

  return postToEdge('compare', payload);
}

// -----------------------------------------------------------------------------
// 3. Generate improved prompt suggestions
// -----------------------------------------------------------------------------
export async function generatePromptSuggestions(
  imageUrl,
  originalPrompt,
  selectedStyle,
  analysis
) {
  const systemMessage = `You are an expert prompt engineer for AI image generation. Based on the image analysis, create 3 improved prompt variations that would generate better, more consistent results.

Focus on:
1. **Specific Style Instructions**
2. **Technical Improvements**
3. **Consistency Keywords**
4. **Color Optimization**

Provide 3 distinct improved prompts, each with a brief explanation of the improvements made.`;

  const userMessage = `Based on this analysis of the generated image:

**Original Prompt**: "${originalPrompt}"
**Style**: ${selectedStyle}
**Analysis**: ${analysis}

Please provide 3 improved prompt variations that would generate better, more consistent results.`;

  const payload = {
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userMessage }
    ],
    max_tokens: 800,
    temperature: 0.4
  };

  return postToEdge('suggest', payload);
}
