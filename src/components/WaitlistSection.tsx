import React, { useState } from 'react';
import { CheckCircleIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

export const WaitlistSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Use the correct Supabase function URL
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiUrl = `${supabaseUrl}/functions/v1/waitlist`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email: email.trim(),
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        // Try to parse error response as JSON, but handle cases where it's not valid JSON
        let errorMessage = 'Failed to join waitlist';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, use a generic error message
          console.warn('Failed to parse error response as JSON:', jsonError);
          errorMessage = `Server error (${response.status}). Please try again.`;
        }
        throw new Error(errorMessage);
      }

      // Only try to parse JSON if response is ok
      await response.json();
      
      setIsSuccess(true);
      setEmail('');

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

    } catch (err: any) {
      setError(err.message || 'Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="bg-vibrant-pink py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-source-sans">
              You're on the list! 🎉
            </h2>
            <p className="text-lg text-gray-600 mb-6 font-source-sans">
              Thanks for joining our beta waitlist. We'll notify you as soon as VIBEWEAR launches!
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-source-sans">
                Keep an eye on your inbox for exclusive early access and special perks.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-vibrant-pink/10 to-purple-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <RocketLaunchIcon className="w-12 h-12 text-vibrant-pink mr-3" />
            <span className="text-4xl">🚀</span>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-source-sans">
            Join Our Waiting List
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 font-source-sans max-w-2xl mx-auto">
            We're still working on the future of AI-powered custom clothing. Join our exclusive waitlist 
            to get early access, special pricing, and be the first to experience the full VIBEWEAR platform.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 font-source-sans">
              What you'll get as an early member:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-vibrant-pink rounded-full"></span>
                <span className="text-gray-700 font-source-sans">Early access to new features</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-vibrant-pink rounded-full"></span>
                <span className="text-gray-700 font-source-sans">Exclusive beta pricing</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-vibrant-pink rounded-full"></span>
                <span className="text-gray-700 font-source-sans">Priority customer support</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-pink focus:border-vibrant-pink transition-colors font-source-sans"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="px-6 py-3 bg-vibrant-pink text-white rounded-lg hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-source-sans font-semibold whitespace-nowrap"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Joining...</span>
                  </div>
                ) : (
                  'Join Waitlist'
                )}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-source-sans">{error}</p>
              </div>
            )}
          </form>

          <p className="text-xs text-gray-500 mt-4 font-source-sans">
            We respect your privacy. No spam, just updates on our launch.
          </p>
        </div>
      </div>
    </section>
  );
};