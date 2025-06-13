import React from 'react';
import { ProductConfiguration } from './ProductConfiguration';
import { ProductDisplay } from './ProductDisplay';
import { AIGenerator } from './AIGenerator';
import { StyleSelection } from './StyleSelection';
import { Design, ProductConfig } from '../types';

interface DesignViewProps {
  productConfig: ProductConfig;
  onConfigChange: (config: ProductConfig) => void;
  onAddToCart: () => void;
  designs: Design[];
  currentDesignIndex: number;
  onDesignChange: (index: number) => void;
  isGenerating: boolean;
  lastPrompt: string;
  selectedStyle: string | null;
  onGenerate: (prompt: string, styleOverride?: string) => void;
  onStyleSelect: (styleId: string) => void;
}

export const DesignView: React.FC<DesignViewProps> = React.memo(({
  productConfig,
  onConfigChange,
  onAddToCart,
  designs,
  currentDesignIndex,
  onDesignChange,
  isGenerating,
  lastPrompt,
  selectedStyle,
  onGenerate,
  onStyleSelect,
}) => {
  return (
    <>
      <ProductConfiguration
        config={productConfig}
        onConfigChange={onConfigChange}
        onAddToCart={onAddToCart}
      />
      
      <ProductDisplay
        designs={designs}
        currentDesignIndex={currentDesignIndex}
        onDesignChange={onDesignChange}
        isGenerating={isGenerating}
        productConfig={productConfig}
        originalPrompt={lastPrompt}
        selectedStyle={selectedStyle || 'realistic'}
      />
      
      <AIGenerator
        onGenerate={onGenerate}
        isGenerating={isGenerating}
        selectedStyle={selectedStyle}
      />
      
      <StyleSelection
        selectedStyle={selectedStyle}
        onStyleSelect={onStyleSelect}
      />
    </>
  );
});

DesignView.displayName = 'DesignView';