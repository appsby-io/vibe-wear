import React, { useState, useEffect } from 'react';
import { ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react';
import { useFeature, useFeatureToggle } from '../../store/useFeature';

interface AdminPageProps {
  onBack: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const betaGateEnabled = useFeature('betaGate');
  const toggleFeature = useFeatureToggle();

  // Simple password protection (in production, use proper auth)
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'vibewear2025') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleToggleBetaGate = () => {
    toggleFeature('betaGate', !betaGateEnabled);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center font-source-sans">
            Admin Access
          </h1>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-source-sans">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-pink focus:border-vibrant-pink transition-colors font-source-sans"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm font-source-sans">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-vibrant-pink text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors font-source-sans font-semibold"
            >
              Access Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-source-sans"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to App
            </button>
            <h1 className="text-2xl font-bold text-gray-900 ml-6 font-source-sans">Admin Panel</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Experiments Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-source-sans">
            Feature Experiments
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 font-source-sans">Beta Gate Modal</h3>
                <p className="text-sm text-gray-600 font-source-sans">
                  Show beta gate modal after 3 designs or when adding to cart
                </p>
              </div>
              <button
                onClick={handleToggleBetaGate}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  betaGateEnabled
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {betaGateEnabled ? (
                  <>
                    <ToggleRight className="w-5 h-5" />
                    <span className="font-source-sans">ON</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-5 h-5" />
                    <span className="font-source-sans">OFF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-source-sans">
            Environment Configuration
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 font-source-sans">Google Analytics</h3>
                <p className="text-sm text-gray-600 font-source-sans">
                  GA_MEASUREMENT_ID: {import.meta.env.VITE_GA_MEASUREMENT_ID ? '✅ Set' : '❌ Not Set'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 font-source-sans">Beta Gate</h3>
                <p className="text-sm text-gray-600 font-source-sans">
                  FEATURE_BETA_GATE: {import.meta.env.VITE_FEATURE_BETA_GATE || 'off'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 font-source-sans">Google Form</h3>
                <p className="text-sm text-gray-600 font-source-sans">
                  GOOGLE_FORM_URL: {import.meta.env.VITE_GOOGLE_FORM_URL ? '✅ Set' : '❌ Not Set'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-source-sans">
              <strong>Note:</strong> Environment variable changes require a rebuild and redeploy to take effect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};