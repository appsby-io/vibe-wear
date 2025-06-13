import { Design, ProductConfig, BASE_PRICE } from '../types';
import { generateHDVersionInBackground } from './designGeneration';

interface AddToCartFunction {
  (item: {
    designId: string;
    designName: string;
    designImageUrl: string;
    hdImageUrl?: string;
    product: string;
    color: string;
    size: string;
    quantity: number;
    unitPrice: number;
    prompt?: string;
    revisedPrompt?: string;
  }): string;
}

export const handleAddToCartLogic = async (
  designs: Design[],
  currentDesignIndex: number,
  productConfig: ProductConfig,
  selectedStyle: string | null,
  addToCart: AddToCartFunction,
  setShowSnackbar: (value: boolean) => void,
  setDesigns: React.Dispatch<React.SetStateAction<Design[]>>
): Promise<void> => {
  const currentDesign = designs[currentDesignIndex];
  
  if (!currentDesign || designs.length === 0) {
    showSnackbarWithTimeout(setShowSnackbar);
    return;
  }

  const cartItemId = addToCart(createCartItem(currentDesign, productConfig));

  // Generate HD version in background
  await generateHDVersionInBackground(currentDesign, selectedStyle, productConfig, setDesigns);

  console.log(`Added to cart: ${cartItemId}`);
};

// Helper functions
const showSnackbarWithTimeout = (setShowSnackbar: (value: boolean) => void): void => {
  setShowSnackbar(true);
  setTimeout(() => setShowSnackbar(false), 5000);
};

const createCartItem = (design: Design, productConfig: ProductConfig) => ({
  designId: design.id,
  designName: design.name,
  designImageUrl: design.imageUrl,
  hdImageUrl: design.hdImageUrl,
  product: productConfig.product,
  color: productConfig.color,
  size: productConfig.size,
  quantity: productConfig.amount,
  unitPrice: BASE_PRICE,
  prompt: design.prompt,
  revisedPrompt: design.revisedPrompt,
});