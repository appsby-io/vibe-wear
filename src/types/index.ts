export * from './cart';

// Re-export commonly used types for easier imports
export interface ProductConfig {
  product: string;
  color: string;
  size: string;
  amount: number;
}

export interface Design {
  id: string;
  name: string;
  imageUrl: string;
  hdImageUrl?: string;
  prompt?: string;
  revisedPrompt?: string;
  quality?: string;
}

export type AppView = 'design' | 'checkout' | 'success' | 'imprint' | 'admin';

// Constants for better maintainability
export const PRODUCT_TYPES = [
  'Premium Cotton Tee',
  'Premium Cotton Sweatshirt', 
  'Premium Lightweight Hoodie'
] as const;

export const PRODUCT_COLORS = ['White', 'Black'] as const;

export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

export const BASE_PRICE = 19.95;

export const DEFAULT_PRODUCT_CONFIG: ProductConfig = {
  product: 'Premium Cotton Tee',
  color: 'White',
  size: 'M',
  amount: 1,
};