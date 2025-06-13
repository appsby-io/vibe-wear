import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorDisplayProps {
  generationError: string | null;
  onClose: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = React.memo(({ 
  generationError, 
  onClose 
}) => {
  if (!generationError) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50 animate-slide-up">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1">
          <p className="text-red-800 text-sm font-medium font-source-sans">Generation Failed</p>
          <p className="text-red-600 text-xs font-source-sans mt-1">{generationError}</p>
        </div>
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-600 transition-colors"
          aria-label="Close error message"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

ErrorDisplay.displayName = 'ErrorDisplay';