import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface SnackbarNotificationProps {
  show: boolean;
  onClose: () => void;
  message?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

export const SnackbarNotification: React.FC<SnackbarNotificationProps> = React.memo(({ 
  show, 
  onClose,
  message = "Create your design first to add it to your cart.",
  type = 'info'
}) => {
  if (!show) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'error': return 'bg-red-600';
      case 'warning': return 'bg-yellow-600';
      case 'success': return 'bg-green-600';
      default: return 'bg-black';
    }
  };

  return (
    <div className={`fixed top-32 right-4 ${getBackgroundColor()} text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-up max-w-sm`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
        <p className="font-source-sans font-medium flex-1">
          {message}
        </p>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

SnackbarNotification.displayName = 'SnackbarNotification';