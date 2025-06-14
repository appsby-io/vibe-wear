import React, { useState } from 'react';
import { ChevronDown, ShoppingCart } from 'lucide-react';

interface ProductConfig {
  product: string;
  color: string;
  size: string;
  amount: number;
}

interface ProductConfigurationProps {
  config: ProductConfig;
  onConfigChange: (config: ProductConfig) => void;
  onAddToCart: () => void;
}

export const ProductConfiguration: React.FC<ProductConfigurationProps> = ({
  config,
  onConfigChange,
  onAddToCart,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const products = ['Premium Cotton Tee', 'Premium Cotton Sweatshirt', 'Premium Lightweight Hoodie'];
  const colors = ['White', 'Black'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const amounts = Array.from({ length: 20 }, (_, i) => i + 1);

  // Calculate total price
  const basePrice = 19.95;
  const totalPrice = (basePrice * config.amount).toFixed(2);

  const handleDropdownToggle = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleOptionSelect = (key: keyof ProductConfig, value: string | number) => {
    onConfigChange({ ...config, [key]: value });
    setOpenDropdown(null);
  };

  const Dropdown = ({ 
    label, 
    value, 
    options, 
    onSelect, 
    dropdownKey 
  }: {
    label: string;
    value: string | number;
    options: (string | number)[];
    onSelect: (value: string | number) => void;
    dropdownKey: string;
  }) => (
    <div className="relative">
      <button
        onClick={() => handleDropdownToggle(dropdownKey)}
        className="flex items-center justify-between w-full h-10 px-4 bg-white rounded-full border-0 shadow-lg hover:shadow-xl transition-all font-source-sans"
      >
        <span className="text-sm font-normal text-black">{label}: {value}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${
          openDropdown === dropdownKey ? 'rotate-180' : ''
        }`} />
      </button>
      
      {openDropdown === dropdownKey && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg z-20 animate-slide-up">
          <div className="py-2 max-h-48 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => onSelect(option)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors font-source-sans"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white border-b border-gray-100 lg:sticky lg:top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Dropdowns container with reduced gap on mobile */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 items-center">
            <Dropdown
              label="Product"
              value={config.product}
              options={products}
              onSelect={(value) => handleOptionSelect('product', value)}
              dropdownKey="product"
            />
            
            <Dropdown
              label="Color"
              value={config.color}
              options={colors}
              onSelect={(value) => handleOptionSelect('color', value)}
              dropdownKey="color"
            />
            
            <Dropdown
              label="Size"
              value={config.size}
              options={sizes}
              onSelect={(value) => handleOptionSelect('size', value)}
              dropdownKey="size"
            />
            
            <Dropdown
              label="Amount"
              value={config.amount}
              options={amounts}
              onSelect={(value) => handleOptionSelect('amount', value)}
              dropdownKey="amount"
            />
          </div>
          
          {/* Price and Add to Cart - Right aligned on mobile */}
          <div className="flex items-center justify-end gap-4">
            <span className="text-3xl font-bold text-black font-source-sans">
              ${totalPrice}
            </span>
            <button 
              onClick={onAddToCart}
              className="flex items-center gap-2 h-10 px-6 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-source-sans font-semibold"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};