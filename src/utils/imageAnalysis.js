// src/utils/imageAnalysis.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// GPT-4o Image Analysis for Product Design Quality Assessment
export async function analyzeDesignWithGPT4o(imageUrl, originalPrompt, selectedStyle, productColor) {
  try {
    const systemMessage = `You are an expert product design analyst and art director. Analyze the provided image and give constructive feedback on:

1. **Style Consistency**: How well does it match the requested style?
2. **Product Suitability**: How well would this work as a product design?
3. **Color & Contrast**: How well do the colors work for the specified product color (${productColor})?
4. **Composition**: Is the design well-centered and appropriately sized?
5. **Print Quality**: Would this translate well to fabric printing?
6. **Improvement Suggestions**: Specific ways to improve the prompt for better results.

Be specific, constructive, and actionable in your feedback. Focus on practical improvements.`;

    const userMessage = `Please analyze this product design image:

**Original Prompt**: "${originalPrompt}"
**Requested Style**: ${selectedStyle}
**Product Color**: ${productColor}

Provide detailed feedback on the design quality and specific suggestions for improvement.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        {
          role: "user",
          content: [
            { type: "text", text: userMessage },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    return {
      success: true,
      analysis: response.choices[0].message.content,
      usage: response.usage
    };

  } catch (error) {
    console.error('Error analyzing image with GPT-4o:', error);
    
    let errorMessage = 'Failed to analyze image. Please try again.';
    
    if (error.code === 'rate_limit_exceeded') {
      errorMessage = 'Too many analysis requests. Please wait a moment and try again.';
    } else if (error.code === 'insufficient_quota') {
      errorMessage = 'API quota exceeded. Please check your OpenAI account.';
    }
    
    return {
      success: false,
      error: errorMessage,
      originalError: error.message
    };
  }
}

// Analyze multiple designs and compare them
export async function compareDesigns(designs, originalPrompt, selectedStyle, productColor) {
  try {
    const systemMessage = `You are an expert product design analyst. Compare multiple design variations and provide:

1. **Best Design**: Which design works best and why?
2. **Consistency Analysis**: How consistent are the designs with each other?
3. **Style Adherence**: Which design best matches the requested style?
4. **Ranking**: Rank the designs from best to worst with reasons.
5. **Pattern Recognition**: What patterns do you notice in the variations?

Be specific and actionable in your feedback.`;

    const imageMessages = designs.map((design, index) => ({
      type: "image_url",
      image_url: {
        url: design.imageUrl,
        detail: "high"
      }
    }));

    const userMessage = `Compare these ${designs.length} design variations:

**Original Prompt**: "${originalPrompt}"
**Requested Style**: ${selectedStyle}
**Product Color**: ${productColor}

Please analyze and compare all designs, providing specific feedback on which works best and why.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        {
          role: "user",
          content: [
            { type: "text", text: userMessage },
            ...imageMessages
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.3
    });

    return {
      success: true,
      comparison: response.choices[0].message.content,
      usage: response.usage
    };

  } catch (error) {
    console.error('Error comparing designs with GPT-4o:', error);
    return {
      success: false,
      error: 'Failed to compare designs. Please try again.',
      originalError: error.message
    };
  }
}

// Generate improved prompt suggestions based on analysis
export async function generatePromptSuggestions(imageUrl, originalPrompt, selectedStyle, analysis) {
  try {
    const systemMessage = `You are an expert prompt engineer for AI image generation. Based on the image analysis, create 3 improved prompt variations that would generate better, more consistent results.

Focus on:
1. **Specific Style Instructions**: More detailed style guidance
2. **Technical Improvements**: Better technical specifications
3. **Consistency Keywords**: Words that improve consistency
4. **Color Optimization**: Better color instructions

Provide 3 distinct improved prompts, each with a brief explanation of the improvements made.`;

    const userMessage = `Based on this analysis of the generated image:

**Original Prompt**: "${originalPrompt}"
**Style**: ${selectedStyle}
**Analysis**: ${analysis}

Please provide 3 improved prompt variations that would generate better, more consistent results.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      max_tokens: 800,
      temperature: 0.4
    });

    return {
      success: true,
      suggestions: response.choices[0].message.content,
      usage: response.usage
    };

  } catch (error) {
    console.error('Error generating prompt suggestions:', error);
    return {
      success: false,
      error: 'Failed to generate suggestions. Please try again.',
      originalError: error.message
    };
  }
}