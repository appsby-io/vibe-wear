import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Share2, Eye, Maximize2, ExternalLink } from 'lucide-react';
import { DesignAnalysis } from './DesignAnalysis';
import { ImageModal } from './ImageModal';
import { LottieLoadingAnimation } from './LottieLoadingAnimation';
import PremiumCottonTee from '../assets/premium_cotton_tee.jpg';
import PremiumCottonSweatshirt from '../assets/premium_cotton_sweatshirt.jpg';
import PremiumLightHoodie from '../assets/premium_light_hoodie.jpg';
import PremiumCottonTeeBlack from '../assets/premium_cotton_tee_black.jpg';
import PremiumCottonSweatshirtBlack from '../assets/premium_cotton_sweatshirt_black.jpg';
import PremiumLightHoodieBlack from '../assets/premium_hoodie_black.jpg';
import BoltBadge from '../assets/bolt_badge.png';

interface Design {
  id: string;
  name: string;
  imageUrl: string;
  prompt?: string;
  revisedPrompt?: string;
}

interface ProductConfig {
  product: string;
  color: string;
  size: string;
  amount: number;
}

interface ProductDisplayProps {
  designs: Design[];
  currentDesignIndex: number;
  onDesignChange: (index: number) => void;
  isGenerating: boolean;
  productConfig: ProductConfig;
  originalPrompt?: string;
  selectedStyle?: string;
}

export const ProductDisplay: React.FC<ProductDisplayProps> = ({
  designs,
  currentDesignIndex,
  onDesignChange,
  isGenerating,
  productConfig,
  originalPrompt = '',
  selectedStyle = 'realistic',
}) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const handlePrevious = () => {
    const newIndex = currentDesignIndex === 0 ? designs.length - 1 : currentDesignIndex - 1;
    onDesignChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentDesignIndex === designs.length - 1 ? 0 : currentDesignIndex + 1;
    onDesignChange(newIndex);
  };

  const handleTooltipClick = (buttonType: string) => {
    setShowTooltip(buttonType);
    setTimeout(() => setShowTooltip(null), 2000);
  };

  const handleDownload = () => {
    handleTooltipClick('download');
  };

  const handleShare = () => {
    handleTooltipClick('share');
  };

  const handleAnalyze = () => {
    setShowAnalysis(true);
  };

  const handleViewLarger = () => {
    setShowImageModal(true);
  };

  const handleBoltBadgeClick = () => {
    window.open('https://bolt.new', '_blank', 'noopener,noreferrer');
  };

  // Handle clicking on the design image to open modal
  const handleDesignImageClick = () => {
    if (currentDesign && isInteractiveDesign) {
      setShowImageModal(true);
    }
  };

  const getProductImage = () => {
    const isBlack = productConfig.color === 'Black';
    
    switch (productConfig.product) {
      case 'Premium Cotton Sweatshirt':
        return isBlack ? PremiumCottonSweatshirtBlack : PremiumCottonSweatshirt;
      case 'Premium Lightweight Hoodie':
        return isBlack ? PremiumLightHoodieBlack : PremiumLightHoodie;
      default:
        return isBlack ? PremiumCottonTeeBlack : PremiumCottonTee;
    }
  };

  const currentDesign = designs[currentDesignIndex];
  const showSlider = designs.length >= 2;
  
  // Always show design if available and not generating
  const shouldShowDesign = currentDesign && !isGenerating && currentDesign.imageUrl;
  
  // Only allow interaction for non-default designs
  const isInteractiveDesign = currentDesign && currentDesign.id !== 'default';

  return (
    <div className="relative bg-white pt-2 lg:pt-12 pb-2 lg:pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Bolt Badge - Positioned at top left corner of content area */}
        <div className="absolute top-1 lg:top-8 left-4 lg:left-8">
          <button
            onClick={handleBoltBadgeClick}
            className="group flex items-center space-x-2 hover:opacity-80 transition-opacity"
            title="Powered by Bolt - Click to visit bolt.new"
          >
            <img
              src={BoltBadge}
              alt="Powered by Bolt"
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-full shadow-sm group-hover:shadow-md transition-shadow"
            />
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-gray-600 font-source-sans">Visit bolt.new</span>
              <ExternalLink className="w-3 h-3 text-gray-600" />
            </div>
          </button>
        </div>

        <div className="flex items-center justify-center gap-8">
          
          {/* Navigation Controls - Only show when 2+ designs */}
          {showSlider && (
            <button
              onClick={handlePrevious}
              className="hidden lg:flex items-center justify-center w-14 h-14 bg-white rounded-full hover:shadow-xl transition-all hover:scale-105 group border border-gray-200 relative overflow-hidden"
            >
              <ChevronLeft className="h-6 w-6" />
              <div className="absolute inset-0 rounded-full bg-vibrant-pink opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          )}

          {/* Product Display */}
          <div className="relative">
            <div 
              className="relative bg-white rounded-2xl overflow-hidden"
              style={{ 
                width: window.innerWidth < 1024 ? '360px' : '480px', 
                height: window.innerWidth < 1024 ? '432px' : '576px' 
              }}
            >
              {/* Product Base */}
              <div className="w-full h-full bg-white flex items-center justify-center">
                <img
                  src={getProductImage()}
                  alt={`${productConfig.product} - ${productConfig.color}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Design Overlay - Fixed position, no dragging, no blend mode, no rounded corners */}
              {shouldShowDesign && (
                <div
                  className="absolute cursor-pointer"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={handleDesignImageClick}
                  title={isInteractiveDesign ? "Click to view larger" : undefined}
                >
                  <img
                    src={currentDesign.imageUrl}
                    alt={currentDesign.name}
                    className="object-contain hover:scale-105 transition-transform"
                    style={{ 
                      width: window.innerWidth < 1024 ? '120px' : '160px', 
                      height: window.innerWidth < 1024 ? '120px' : '160px' 
                    }}
                    draggable={false}
                  />
                </div>
              )}

              {/* Enhanced Loading Overlay with Lottie Crab Animation */}
              {isGenerating && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    {/* Lottie Crab Animation - Properly centered and sized */}
                    <div className="mb-4 flex items-center justify-center">
                      <div className="w-36 h-36 flex items-center justify-center">
                        <LottieLoadingAnimation size={140} />
                      </div>
                    </div>
                    
                    <p className="text-gray-700 font-semibold font-source-sans text-lg">Creating Design...</p>
                    <p className="text-gray-500 font-source-sans text-sm mt-2">Using advanced AI • This may take 15-45 seconds</p>
                    
                    {/* Animated dots */}
                    <div className="mt-4 flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-vibrant-pink rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-vibrant-pink rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-vibrant-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Design Actions - Only show for interactive designs */}
              {shouldShowDesign && isInteractiveDesign && (
                <div className="absolute top-4 right-4 flex space-x-2">
                  <div className="relative">
                    <button
                      onClick={handleViewLarger}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all border border-gray-200 group hover:scale-110 active:scale-95"
                      title="View larger"
                    >
                      <Maximize2 className="h-5 w-5 text-gray-700 group-hover:text-vibrant-pink transition-colors" />
                    </button>
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={handleAnalyze}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all border border-gray-200 group hover:scale-110 active:scale-95"
                      title="Analyze design with AI"
                    >
                      <Eye className="h-5 w-5 text-gray-700 group-hover:text-vibrant-pink transition-colors" />
                    </button>
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={handleDownload}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all border border-gray-200 group hover:scale-110 active:scale-95"
                      title="Download design"
                    >
                      <Download className="h-5 w-5 text-gray-700 group-hover:text-vibrant-pink transition-colors" />
                    </button>
                    {showTooltip === 'download' && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap z-50">
                        Coming soon 🦘
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={handleShare}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all border border-gray-200 group hover:scale-110 active:scale-95"
                      title="Share design"
                    >
                      <Share2 className="h-5 w-5 text-gray-700 group-hover:text-vibrant-pink transition-colors" />
                    </button>
                    {showTooltip === 'share' && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap z-50">
                        Coming soon 🦘
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Navigation - Only show when 2+ designs */}
            {showSlider && (
              <div className="flex lg:hidden justify-center mt-4 space-x-4">
                <button
                  onClick={handlePrevious}
                  className="flex items-center justify-center w-12 h-12 bg-white rounded-full hover:shadow-xl transition-all border border-gray-200 hover:scale-105 group relative overflow-hidden"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <div className="absolute inset-0 rounded-full bg-vibrant-pink opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center justify-center w-12 h-12 bg-white rounded-full hover:shadow-xl transition-all border border-gray-200 hover:scale-105 group relative overflow-hidden"
                >
                  <ChevronRight className="h-5 w-5" />
                  <div className="absolute inset-0 rounded-full bg-vibrant-pink opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
              </div>
            )}

            {/* Pagination Dots - Closer to the t-shirt */}
            {showSlider && (
              <div className="flex justify-center mt-2 lg:mt-3 space-x-2">
                {designs.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onDesignChange(index)}
                    className={`h-3.5 rounded-full transition-all hover:scale-110 active:scale-95 ${
                      index === currentDesignIndex 
                        ? 'bg-vibrant-pink w-6' 
                        : 'bg-inactive-dot hover:bg-gray-400 w-3.5'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Next Button - Only show when 2+ designs */}
          {showSlider && (
            <button
              onClick={handleNext}
              className="hidden lg:flex items-center justify-center w-14 h-14 bg-white rounded-full hover:shadow-xl transition-all hover:scale-105 group border border-gray-200 relative overflow-hidden"
            >
              <ChevronRight className="h-6 w-6" />
              <div className="absolute inset-0 rounded-full bg-vibrant-pink opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          )}
        </div>
      </div>

      {/* Image Modal for Larger View */}
      {showImageModal && currentDesign && isInteractiveDesign && (
        <ImageModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          imageUrl={currentDesign.imageUrl}
          designName={currentDesign.name}
          onDownload={() => handleTooltipClick('download')}
          onShare={() => handleTooltipClick('share')}
        />
      )}

      {/* Design Analysis Modal */}
      {showAnalysis && currentDesign && isInteractiveDesign && (
        <DesignAnalysis
          design={currentDesign}
          originalPrompt={originalPrompt}
          selectedStyle={selectedStyle}
          productColor={productConfig.color}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </div>
  );
};