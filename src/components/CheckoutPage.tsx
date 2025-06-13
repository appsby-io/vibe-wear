import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, Trash2, CreditCard, Shield, Truck } from 'lucide-react';
import { CartItem, CheckoutForm, OrderSummary } from '../types/cart';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onBack: () => void;
  onProceedToPayment: (form: CheckoutForm, orderSummary: OrderSummary) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onBack,
  onProceedToPayment,
}) => {
  const [form, setForm] = useState<CheckoutForm>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    shippingAddress: {
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
    sameAsBilling: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate order summary
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = subtotal > 50 ? 0 : 4.99; // Free shipping over $50
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  const orderSummary: OrderSummary = {
    subtotal,
    shipping,
    tax,
    total,
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('shippingAddress.')) {
      const addressField = field.replace('shippingAddress.', '');
      setForm(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [addressField]: value,
        },
      }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.email) newErrors.email = 'Email is required';
    if (!form.firstName) newErrors.firstName = 'First name is required';
    if (!form.lastName) newErrors.lastName = 'Last name is required';
    if (!form.shippingAddress.address1) newErrors['shippingAddress.address1'] = 'Address is required';
    if (!form.shippingAddress.city) newErrors['shippingAddress.city'] = 'City is required';
    if (!form.shippingAddress.state) newErrors['shippingAddress.state'] = 'State is required';
    if (!form.shippingAddress.zipCode) newErrors['shippingAddress.zipCode'] = 'ZIP code is required';

    // Email validation
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      onProceedToPayment(form, orderSummary);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ 
    label, 
    field, 
    type = 'text', 
    placeholder, 
    required = false 
  }: {
    label: string;
    field: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
  }) => {
    const value = field.startsWith('shippingAddress.') 
      ? form.shippingAddress[field.replace('shippingAddress.', '') as keyof typeof form.shippingAddress]
      : form[field as keyof typeof form];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 font-source-sans">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          value={value as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-vibrant-pink focus:border-vibrant-pink transition-colors font-source-sans ${
            errors[field] ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors[field] && (
          <p className="text-red-500 text-sm mt-1 font-source-sans">{errors[field]}</p>
        )}
      </div>
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-source-sans">Your cart is empty</h2>
          <p className="text-gray-600 mb-6 font-source-sans">Add some designs to get started!</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-vibrant-pink text-white rounded-lg hover:bg-pink-600 transition-colors font-source-sans font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-source-sans"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Design
            </button>
            <h1 className="text-2xl font-bold text-gray-900 ml-6 font-source-sans">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Order Summary */}
          <div className="lg:order-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 font-source-sans">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.designImageUrl}
                        alt={item.designName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate font-source-sans">
                        {item.designName}
                      </h3>
                      <p className="text-sm text-gray-500 font-source-sans">
                        {item.product} • {item.color} • {item.size}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium font-source-sans">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold font-source-sans">
                            ${item.totalPrice.toFixed(2)}
                          </span>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm font-source-sans">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-source-sans">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-source-sans">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold font-source-sans">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {shipping > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 font-source-sans">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:order-1">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 font-source-sans">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <InputField
                      label="Email"
                      field="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <InputField
                    label="First Name"
                    field="firstName"
                    placeholder="John"
                    required
                  />
                  <InputField
                    label="Last Name"
                    field="lastName"
                    placeholder="Doe"
                    required
                  />
                  <div className="md:col-span-2">
                    <InputField
                      label="Phone (Optional)"
                      field="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 font-source-sans">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    field="shippingAddress.firstName"
                    placeholder="John"
                    required
                  />
                  <InputField
                    label="Last Name"
                    field="shippingAddress.lastName"
                    placeholder="Doe"
                    required
                  />
                  <div className="md:col-span-2">
                    <InputField
                      label="Address"
                      field="shippingAddress.address1"
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <InputField
                      label="Apartment, suite, etc. (Optional)"
                      field="shippingAddress.address2"
                      placeholder="Apt 4B"
                    />
                  </div>
                  <InputField
                    label="City"
                    field="shippingAddress.city"
                    placeholder="New York"
                    required
                  />
                  <InputField
                    label="State"
                    field="shippingAddress.state"
                    placeholder="NY"
                    required
                  />
                  <InputField
                    label="ZIP Code"
                    field="shippingAddress.zipCode"
                    placeholder="10001"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-source-sans">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.shippingAddress.country}
                      onChange={(e) => handleInputChange('shippingAddress.country', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-pink focus:border-vibrant-pink transition-colors font-source-sans"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="font-source-sans">Secure Checkout</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <span className="font-source-sans">Multiple Payment Options</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-purple-500" />
                    <span className="font-source-sans">Fast Shipping</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all font-source-sans ${
                  isSubmitting || cartItems.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-vibrant-pink text-white hover:bg-pink-600 hover:shadow-lg transform hover:scale-[1.02]'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Proceed to Payment • $${total.toFixed(2)}`
                )}
              </button>

              {/* Payment Info */}
              <div className="text-center text-sm text-gray-500 font-source-sans">
                <p>You will be redirected to our secure payment processor.</p>
                <p className="mt-1">Your order will be processed and shipped within 3-5 business days.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};