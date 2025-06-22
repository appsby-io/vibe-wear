import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface CookieBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    Cookies.set('cookieConsent', 'accepted', { expires: 365 });
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    Cookies.set('cookieConsent', 'declined', { expires: 365 });
    setIsVisible(false);
    onDecline();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-source-sans">
            We use cookies to improve vibewear.ai & measure usage. By continuing, you agree to our use of cookies.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm border border-gray-400 text-gray-300 hover:text-white hover:border-white rounded-lg transition-colors font-source-sans"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-vibrant-pink text-white hover:bg-pink-600 rounded-lg transition-colors font-source-sans font-semibold"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};