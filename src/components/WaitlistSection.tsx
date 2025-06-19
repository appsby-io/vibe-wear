import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { LottieAnimation } from './LottieAnimation';
import KangarooImage from '../assets/cangaroo-hammock.jpg';
import successAnimationData from '../assets/success.json';
import { ga } from '../lib/ga';

export const WaitlistSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous error
    setError(null);
    
    // Validate email input
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);

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
      ga.trackSignUp('waitlist_section');

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

  const handleSurveyClick = () => {
    const googleFormUrl = import.meta.env.VITE_GOOGLE_FORM_URL;
    if (googleFormUrl) {
      window.open(googleFormUrl, '_blank');
      ga.trackSurveyOpen();
    }
  };

  if (isSuccess) {
    return (
      <section id="waitlist-section" className="bg-gradient-to-br from-vibrant-pink/10 to-purple-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Success Animation */}
            <div className="flex justify-center mb-6">
              <LottieAnimation
                animationData={successAnimationData}
                className="w-32 h-32"
                loop={false}
                autoplay={true}
              />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-source-sans">
              You're on the list! 🎉
            </h2>
            <p className="text-lg text-gray-600 mb-6 font-source-sans">
              Thanks for joining our beta waitlist. We'll notify you as soon as VIBE-WEAR launches!
            </p>
            
            {/* Survey Section with light pink background */}
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 mb-6">
              <p className="text-pink-800 font-source-sans mb-3">
                👉 Got 20 seconds? Help us build something better.
              </p>
              <button
                onClick={handleSurveyClick}
                className="border border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white px-6 py-3 rounded-lg font-medium font-source-sans transition-colors"
              >
                Share your ideas
              </button>
            </div>
            
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
    <section id="waitlist-section" className="bg-gradient-to-br from-vibrant-pink/10 to-purple-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={KangarooImage} 
              alt="Kangaroo in hammock" 
              className="w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-full"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-source-sans">
            Join Our Waiting List
          </h2>
          
          <p className="text-base text-gray-600 mb-6 font-source-sans max-w-2xl mx-auto">
            We're not quite ready to ship — but you're first in line if you join the waitlist.
          </p>

          {/* Benefits Section - Moved before email input */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center space-x-3">
                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-source-sans">Early access to new features</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-source-sans">Exclusive beta pricing</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-source-sans">Priority customer support</span>
              </div>
            </div>
          </div>

          {/* Email Input Section */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-pink focus:border-vibrant-pink transition-colors font-source-sans"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Privacy text directly below email input */}
            <p className="text-xs text-gray-500 mt-2 font-source-sans">
              We respect your privacy. No spam, just updates on our launch.
            </p>
            
            {/* Join Waitlist button centered below privacy text */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 px-6 py-3 bg-vibrant-pink text-white rounded-lg hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-source-sans font-semibold whitespace-nowrap"
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
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-source-sans">{error}</p>
              </div>
            )}
          </form>

          {/* Survey Section with light pink background */}
          <div className="bg-grey-50 border border-pink-200 rounded-lg p-4">
            <p className="text-pink-800 font-source-sans mb-2">
              👉 Got 20 seconds? Help us build something better.
            </p>
            <button
              onClick={handleSurveyClick}
              className="border border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white px-4 py-2 rounded-lg font-medium font-source-sans transition-colors"
            >
              Share your ideas
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};