import React, { useState } from 'react';
import { User, ShoppingCart } from 'lucide-react';
import Logo from '../assets/logo.svg';

interface HeaderProps {
  cartCount: number;
  onCartClick?: () => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onLogoClick }) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleTooltipClick = (buttonType: string) => {
    setShowTooltip(buttonType);
    setTimeout(() => setShowTooltip(null), 2000);
  };

  const handleCartClick = () => {
    if (cartCount > 0 && onCartClick) {
      onCartClick();
    } else {
      handleTooltipClick('cart');
    }
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <header className="lg:fixed lg:top-0 lg:left-0 lg:right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Clickable */}
          <div className="flex-shrink-0">
            <button 
              onClick={handleLogoClick}
              className="hover:opacity-80 transition-opacity"
            >
              <img src={Logo} alt="VIBEWEAR" className="h-8" />
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => handleTooltipClick('profile')}
              >
                <User className="h-6 w-6" />
              </button>
              {showTooltip === 'profile' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap z-50">
                  Coming soon 🦘
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button 
                className={`p-2 hover:bg-gray-100 rounded-lg transition-colors relative ${
                  cartCount > 0 ? 'cursor-pointer' : ''
                }`}
                onClick={handleCartClick}
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-vibrant-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse" data-testid="cart-badge">
                    {cartCount}
                  </span>
                )}
              </button>
              {showTooltip === 'cart' && cartCount === 0 && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap z-50">
                  Add items to cart first 🛒
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};