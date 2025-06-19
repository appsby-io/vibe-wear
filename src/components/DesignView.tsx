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
  onShowWaitlistModal?: () => void;
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
  onShowWaitlistModal,
}) => {
  return (
    <div className="lg:pt-16 pb-32 lg:pb-0">
      {/* Product Configuration - Below header on both desktop and mobile */}
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
        onImageViewLarge={onImageViewLarge}
      />
      
      {/* Desktop: AI Generator non-sticky */}
      {/* Mobile: AI Generator sticky at bottom */}
      <AIGenerator
        onGenerate={onGenerate}
        isGenerating={isGenerating}
        selectedStyle={selectedStyle}
        canGenerate={canGenerate}
        onShowWaitlistModal={onShowWaitlistModal}
      />
      
      <StyleSelection
        selectedStyle={selectedStyle}
        onStyleSelect={onStyleSelect}
      />
    </div>
  );
});

DesignView.displayName = 'DesignView';