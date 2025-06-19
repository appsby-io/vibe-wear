import React, { useState } from 'react';
import { ChevronDown, ShoppingCart, X } from 'lucide-react';

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

  // Truncate product name for mobile
  const truncateProductName = (productName: string) => {
    if (productName.length > 12) {
      return productName.substring(0, 12) + '...';
    }
    return productName;
  };

  const Dropdown = ({ 
    label, 
    value, 
    options, 
    onSelect, 
    dropdownKey,
    isMobileHidden = false,
    useTruncation = false,
    hideLabel = false
  }: {
    label: string;
    value: string | number;
    options: (string | number)[];
    onSelect: (value: string | number) => void;
    dropdownKey: string;
    isMobileHidden?: boolean;
    useTruncation?: boolean;
    hideLabel?: boolean;
  }) => (
    <div className={`relative ${isMobileHidden ? 'hidden sm:block' : ''}`}>
      <button
        onClick={() => handleDropdownToggle(dropdownKey)}
        className="flex items-center justify-between w-full h-10 px-4 bg-white rounded-full border-0 shadow-lg hover:shadow-xl transition-all font-source-sans"
      >
        <span className="text-sm font-normal text-black">
          {/* Show label on desktop, hide on mobile if hideLabel is true */}
          <span className={hideLabel ? 'hidden sm:inline' : ''}>
            {hideLabel ? '' : `${label}: `}
          </span>
          {useTruncation ? (
            <>
              <span className="sm:hidden">{truncateProductName(value.toString())}</span>
              <span className="hidden sm:inline">{value}</span>
            </>
          ) : (
            value
          )}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${
          openDropdown === dropdownKey ? 'rotate-180' : ''
        }`} />
      </button>
      
      {/* Desktop Dropdown */}
      {openDropdown === dropdownKey && (
        <div className="hidden lg:block absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg z-20 animate-slide-up">
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

      {/* Mobile Bottom Sheet */}
      {openDropdown === dropdownKey && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setOpenDropdown(null)}
          />
          
          {/* Bottom Sheet */}
          <div className="relative w-full bg-white rounded-t-2xl shadow-xl animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 font-source-sans">
                Select {label}
              </h3>
              <button
                onClick={() => setOpenDropdown(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Options */}
            <div className="max-h-80 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => onSelect(option)}
                  className={`w-full px-6 py-4 text-left text-base hover:bg-gray-50 transition-colors font-source-sans border-b border-gray-100 last:border-b-0 ${
                    option === value ? 'bg-vibrant-pink/10 text-vibrant-pink font-semibold' : 'text-gray-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            
            {/* Safe area padding for mobile */}
            <div className="h-6"></div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Layout - Sticky */}
      <div className="hidden lg:block bg-white border-b border-gray-100 lg:sticky lg:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Desktop: all dropdowns in a row */}
            <div className="flex flex-wrap gap-4 items-center">
              <Dropdown
                label="Product"
                value={config.product}
                options={products}
                onSelect={(value) => handleOptionSelect('product', value)}
                dropdownKey="product"
                useTruncation={true}
                hideLabel={true}
              />
              
              <Dropdown
                label="Color"
                value={config.color}
                options={colors}
                onSelect={(value) => handleOptionSelect('color', value)}
                dropdownKey="color"
                hideLabel={true}
              />
              
              <Dropdown
                label="Size"
                value={config.size}
                options={sizes}
                onSelect={(value) => handleOptionSelect('size', value)}
                dropdownKey="size"
                hideLabel={true}
              />
              
              <Dropdown
                label="Amount"
                value={config.amount}
                options={amounts}
                onSelect={(value) => handleOptionSelect('amount', value)}
                dropdownKey="amount"
              />
            </div>
            
            {/* Price and Add to Cart - Right aligned */}
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

      {/* Mobile Layout - Non-sticky, positioned below product display */}
      <div className="lg:hidden bg-white border-b border-gray-100 py-4">
        <div className="px-4">
          {/* Top row: 3 dropdowns */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <Dropdown
              label="Product"
              value={config.product}
              options={products}
              onSelect={(value) => handleOptionSelect('product', value)}
              dropdownKey="product"
              useTruncation={true}
              hideLabel={true}
            />
            
            <Dropdown
              label="Color"
              value={config.color}
              options={colors}
              onSelect={(value) => handleOptionSelect('color', value)}
              dropdownKey="color"
              hideLabel={true}
            />
            
            <Dropdown
              label="Size"
              value={config.size}
              options={sizes}
              onSelect={(value) => handleOptionSelect('size', value)}
              dropdownKey="size"
              hideLabel={true}
            />
          </div>
          
          {/* Bottom row: Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-black font-source-sans">
              ${totalPrice}
            </span>
            <button 
              onClick={onAddToCart}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-source-sans font-semibold"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};