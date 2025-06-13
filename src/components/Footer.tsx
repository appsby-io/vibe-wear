import React from 'react';
import Logo from '../assets/logo.svg';

interface FooterProps {
  onImprintClick?: () => void;
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onImprintClick, onAdminClick }) => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <img src={Logo} alt="VIBEWEAR" className="h-8 mx-auto filter invert" />
          </div>
          <p className="text-gray-400 mb-8 font-source-sans">
            AI-powered custom clothing that matches your unique style.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold mb-3 font-source-sans">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors font-source-sans">T-Shirts</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-source-sans">Hoodies</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-source-sans">Sweatshirts</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 font-source-sans">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors font-source-sans">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-source-sans">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-source-sans">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 font-source-sans">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors font-source-sans">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-source-sans">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-source-sans">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 font-source-sans">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors font-source-sans">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-source-sans">Terms of Service</a></li>
                <li>
                  <button 
                    onClick={onImprintClick}
                    className="hover:text-white transition-colors font-source-sans text-left"
                  >
                    Impressum
                  </button>
                </li>
                {onAdminClick && (
                  <li>
                    <button 
                      onClick={onAdminClick}
                      className="hover:text-white transition-colors font-source-sans text-left"
                    >
                      Admin
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm font-source-sans">
              © 2025 VIBEWEAR. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};