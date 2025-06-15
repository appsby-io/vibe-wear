import React from 'react';
import Logo from '../assets/logo.svg';

interface FooterProps {
  onImprintClick?: () => void;
  onAdminClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onFeatureClick?: (feature: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onImprintClick, 
  onAdminClick, 
  onPrivacyClick, 
  onTermsClick,
  onFeatureClick 
}) => {
  const handleFeatureClick = (feature: string) => {
    if (onFeatureClick) {
      onFeatureClick(feature);
    }
  };

  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <img src={Logo} alt="VIBE-WEAR" className="h-8 mx-auto filter invert" />
          </div>
          <p className="text-gray-400 mb-8 font-source-sans">
            AI-powered custom clothing that matches your unique style.
          </p>
          
          {/* Simplified footer with only legal links */}
          <div className="flex justify-center space-x-8 text-sm mb-8">
            <button 
              onClick={onPrivacyClick}
              className="text-gray-400 hover:text-white transition-colors font-source-sans"
            >
              Privacy Policy
            </button>
            <button 
              onClick={onTermsClick}
              className="text-gray-400 hover:text-white transition-colors font-source-sans"
            >
              Terms of Service
            </button>
            <button 
              onClick={onImprintClick}
              className="text-gray-400 hover:text-white transition-colors font-source-sans"
            >
              Impressum
            </button>
            {onAdminClick && (
              <button 
                onClick={onAdminClick}
                className="text-gray-400 hover:text-white transition-colors font-source-sans"
              >
                Admin
              </button>
            )}
          </div>
          
          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm font-source-sans">
              © 2025 VIBE-WEAR. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};