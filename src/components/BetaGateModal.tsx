import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { ga } from '../lib/ga';

interface BetaGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAnyway: () => void;
}

export const BetaGateModal: React.FC<BetaGateModalProps> = ({
  isOpen,
  onClose,
  onContinueAnyway,
}) => {
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
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join waitlist');
      }

      setIsSuccess(true);
      ga.trackSignUp('beta_modal');

      // Open Google Form in new tab
      const googleFormUrl = import.meta.env.VITE_GOOGLE_FORM_URL;
      if (googleFormUrl) {
        window.open(googleFormUrl, '_blank');
        ga.trackSurveyOpen();
      }

      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setEmail('');
      }, 3000);

    } catch (error) {
      console.error('Error joining waitlist:', error);
      setError('Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueAnyway = () => {
    onContinueAnyway();
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
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
                  <div className="flex items-center space-x-2">
                    <RocketLaunchIcon className="h-6 w-6 text-vibrant-pink" />
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-bold text-gray-900 font-source-sans"
                    >
                      This is just beta 🚀
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {isSuccess ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 font-source-sans">
                      Thanks! Check your inbox 📧
                    </h4>
                    <p className="text-sm text-gray-600 font-source-sans">
                      We've added you to our waitlist and opened a quick survey.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <p className="text-gray-600 font-source-sans">
                        Join our waiting list to get early access & exclusive perks when we launch.
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

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={isSubmitting || !email.trim()}
                          className="flex-1 bg-vibrant-pink text-white py-3 px-4 rounded-lg hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-source-sans font-semibold"
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
                        <button
                          type="button"
                          onClick={handleContinueAnyway}
                          className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-source-sans font-semibold"
                        >
                          Continue Anyway
                        </button>
                      </div>
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