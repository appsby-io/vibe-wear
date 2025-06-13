import React from 'react';
import { CheckCircle, Download, Share2, ArrowLeft } from 'lucide-react';
import { CheckoutForm, OrderSummary } from '../types/cart';

interface PaymentSuccessPageProps {
  orderNumber: string;
  form: CheckoutForm;
  orderSummary: OrderSummary;
  onBackToHome: () => void;
}

export const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({
  orderNumber,
  form,
  orderSummary,
  onBackToHome,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-source-sans">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-2 font-source-sans">
            Thank you for your order, {form.firstName}!
          </p>
          <p className="text-sm text-gray-500 mb-8 font-source-sans">
            Order #{orderNumber}
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 font-source-sans">Order Summary</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-source-sans">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-source-sans">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {orderSummary.shipping === 0 ? 'Free' : `$${orderSummary.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-source-sans">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${orderSummary.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold font-source-sans">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${orderSummary.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2 font-source-sans">Shipping Address</h3>
              <div className="text-sm text-gray-600 font-source-sans">
                <p>{form.shippingAddress.firstName} {form.shippingAddress.lastName}</p>
                <p>{form.shippingAddress.address1}</p>
                {form.shippingAddress.address2 && <p>{form.shippingAddress.address2}</p>}
                <p>{form.shippingAddress.city}, {form.shippingAddress.state} {form.shippingAddress.zipCode}</p>
                <p>{form.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-3 font-source-sans">What happens next?</h3>
            <ul className="space-y-2 text-sm text-blue-800 font-source-sans">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                You'll receive an order confirmation email shortly
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Your custom design will be printed on premium quality materials
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Your order will ship within 3-5 business days
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                You'll receive tracking information once shipped
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBackToHome}
              className="flex items-center justify-center px-6 py-3 bg-vibrant-pink text-white rounded-lg hover:bg-pink-600 transition-colors font-source-sans font-semibold"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Create Another Design
            </button>
            
            <button className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-source-sans font-semibold">
              <Download className="w-5 h-5 mr-2" />
              Download Receipt
            </button>
            
            <button className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-source-sans font-semibold">
              <Share2 className="w-5 h-5 mr-2" />
              Share Order
            </button>
          </div>

          {/* Support */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-source-sans">
              Questions about your order? Contact us at{' '}
              <a href="mailto:support@vibewear.com" className="text-vibrant-pink hover:underline">
                support@vibewear.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};