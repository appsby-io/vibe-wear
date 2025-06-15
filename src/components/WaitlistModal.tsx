import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { LottieAnimation } from './LottieAnimation';
import successAnimationData from '../assets/success.json';
import KangarooImage from '../assets/cangaroo-hammock.jpg';
import { ga } from '../lib/ga';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  headline?: string;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  headline = "We're not quite ready to ship — but you're first in line if you join the waitlist.",
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      ga.trackWaitlistModalShown();
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!isSuccess) {
      ga.trackWaitlistModalDismissed();
    }
    onClose();
    // Reset state when modal closes
    setTimeout(() => {
      setIsSuccess(false);
      setEmail('');
      setError(null);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
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
        let errorMessage = 'Failed to join waitlist';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          errorMessage = `Server error (${response.status}). Please try again.`;
        }
        throw new Error(errorMessage);
      }

      await response.json();
      setIsSuccess(true);
      ga.trackSignUp('waitlist_modal');

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

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold text-gray-900 font-source-sans"
                  >
                    {isSuccess ? "You're on the list! 🎉" : "Join Our Waitlist"}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {isSuccess ? (
                  <div className="text-center py-4">
                    {/* Success Animation */}
                    <div className="flex justify-center mb-6">
                      <LottieAnimation
                        animationData={successAnimationData}
                        className="w-32 h-32"
                        loop={false}
                        autoplay={true}
                      />
                    </div>
                    
                    <p className="text-gray-600 mb-6 font-source-sans">
                      Thanks for joining our waitlist. We'll notify you as soon as VIBE-WEAR launches!
                    </p>

                    {/* Survey Section with light pink background */}
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                      <p className="text-pink-800 font-source-sans mb-3">
                        👉 Got 20 seconds? Help us build something better.
                      </p>
                      <button
                        onClick={handleSurveyClick}
                        className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium font-source-sans transition-colors"
                      >
                        Share your ideas
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Kangaroo Image */}
                    <div className="flex justify-center mb-4">
                      <img 
                        src={KangarooImage} 
                        alt="Kangaroo in hammock" 
                        className="w-24 h-24 object-cover rounded-full"
                      />
                    </div>

                    <div className="mb-6">
                      <p className="text-gray-600 font-source-sans text-center">
                        {headline}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-pink focus:border-vibrant-pink transition-colors font-source-sans"
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      {error && (
                        <div className="text-red-600 text-sm font-source-sans">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting || !email.trim()}
                        className="w-full bg-vibrant-pink text-white py-3 px-4 rounded-lg hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-source-sans font-semibold"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Joining...</span>
                          </div>
                        ) : (
                          'Join Waitlist'
                        )}
                      </button>
                    </form>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};