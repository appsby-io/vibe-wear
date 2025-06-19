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
  onImageViewLarge?: () => void;
  canGenerate: boolean;
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
  onImageViewLarge,
  canGenerate,
}) => {
  return (
    <div className="lg:pt-16 pb-32 lg:pb-0">
      {/* Desktop: Product config at top, sticky */}
      {/* Mobile: Product config after product display, non-sticky */}
      <div className="hidden lg:block">
        <ProductConfiguration
          config={productConfig}
          onConfigChange={onConfigChange}
          onAddToCart={onAddToCart}
        />
      </div>
      
      <ProductDisplay
        designs={designs}
        currentDesignIndex={currentDesignIndex}
        onDesignChange={onDesignChange}
        isGenerating={isGenerating}
        productConfig={productConfig}
        originalPrompt={lastPrompt}
        selectedStyle={selectedStyle || 'realistic'}
        onImageViewLarge={onImageViewLarge}
      />
      
      {/* Mobile: Product config after product display */}
      <div className="lg:hidden">
        <ProductConfiguration
          config={productConfig}
          onConfigChange={onConfigChange}
          onAddToCart={onAddToCart}
        />
      </div>
      
      {/* Desktop: AI Generator non-sticky */}
      {/* Mobile: AI Generator sticky at bottom */}
      <AIGenerator
        onGenerate={onGenerate}
        isGenerating={isGenerating}
        selectedStyle={selectedStyle}
        canGenerate={canGenerate}
      />
      
      <StyleSelection
        selectedStyle={selectedStyle}
        onStyleSelect={onStyleSelect}
      />
    </div>
  );
});

DesignView.displayName = 'DesignView';