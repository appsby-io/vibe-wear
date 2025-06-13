import { useState } from 'react';
import { ProductConfig, Design, AppView, DEFAULT_PRODUCT_CONFIG, CheckoutForm, OrderSummary } from '../types';
import motiveDefault from '../assets/motive_default.png';

export const useAppState = () => {
  const [currentView, setCurrentView] = useState<AppView>('design');
  const [productConfig, setProductConfig] = useState<ProductConfig>(DEFAULT_PRODUCT_CONFIG);
  
  // Initialize with default design using the imported image
  const defaultDesign: Design = {
    id: 'default',
    name: 'Default VIBEWEAR design',
    imageUrl: motiveDefault,
    prompt: 'Default VIBEWEAR design',
    quality: 'standard',
  };
  
  const [designs, setDesigns] = useState<Design[]>([defaultDesign]);
  const [currentDesignIndex, setCurrentDesignIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  
  // Order state
  const [orderData, setOrderData] = useState<{
    orderNumber: string;
    form: CheckoutForm;
    orderSummary: OrderSummary;
  } | null>(null);

  return {
    currentView,
    setCurrentView,
    productConfig,
    setProductConfig,
    designs,
    setDesigns,
    currentDesignIndex,
    setCurrentDesignIndex,
    isGenerating,
    setIsGenerating,
    selectedStyle,
    setSelectedStyle,
    generationError,
    setGenerationError,
    showSnackbar,
    setShowSnackbar,
    lastPrompt,
    setLastPrompt,
    orderData,
    setOrderData,
  };
};