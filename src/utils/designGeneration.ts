import { generateDesign, generateHDDesignForCheckout } from './imageGeneration';
import { Design, ProductConfig } from '../types';

export const handleDesignGeneration = async (
  prompt: string,
  styleOverride: string | undefined,
  selectedStyle: string | null,
  productConfig: ProductConfig,
  setIsGenerating: (value: boolean) => void,
  setGenerationError: (value: string | null) => void,
  setLastPrompt: (value: string) => void,
  setDesigns: React.Dispatch<React.SetStateAction<Design[]>>,
  designs: Design[]
): Promise<number> => {
  setIsGenerating(true);
  setGenerationError(null);
  setLastPrompt(prompt);
  
  try {
    const styleToUse = styleOverride || selectedStyle || 'realistic';
    const result = await generateDesign(prompt, styleToUse, productConfig.color, 'low');
    
    if (result.success) {
      const newDesign: Design = {
        id: `design-${Date.now()}`,
        name: createDesignName(prompt),
        imageUrl: result.imageUrl,
        prompt: result.prompt,
        revisedPrompt: result.revisedPrompt,
        quality: result.quality,
      };
      
      setDesigns(prev => [...prev, newDesign]);
      return designs.length; // Return new index
    } else {
      console.error('Failed to generate design:', result.error);
      setGenerationError(result.error || 'Failed to generate design. Please try again.');
      return -1;
    }
  } catch (error) {
    console.error('Error generating design:', error);
    setGenerationError('An unexpected error occurred. Please try again.');
    return -1;
  } finally {
    setIsGenerating(false);
  }
};

export const generateHDVersionInBackground = async (
  design: Design,
  selectedStyle: string | null,
  productConfig: ProductConfig,
  setDesigns: React.Dispatch<React.SetStateAction<Design[]>>
): Promise<void> => {
  if (design.id === 'default' || !design.prompt || design.hdImageUrl) {
    return;
  }

  try {
    const originalPrompt = extractOriginalPrompt(design.prompt);
    const hdResult = await generateHDDesignForCheckout(
      originalPrompt,
      selectedStyle || 'realistic',
      productConfig.color
    );
    
    if (hdResult.success) {
      setDesigns(prev => prev.map(d => 
        d.id === design.id 
          ? { ...d, hdImageUrl: hdResult.imageUrl }
          : d
      ));
      console.log('HD version generated successfully for checkout!');
    }
  } catch (error) {
    console.error('Failed to generate HD version:', error);
  }
};

// Helper functions
const createDesignName = (prompt: string): string => {
  const maxLength = 30;
  return prompt.length > maxLength 
    ? `${prompt.slice(0, maxLength)}...` 
    : prompt;
};

const extractOriginalPrompt = (fullPrompt: string): string => {
  return fullPrompt.split('. Style:')[0];
};