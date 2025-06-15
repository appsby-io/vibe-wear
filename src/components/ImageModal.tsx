import React from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  designName: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  designName,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 font-source-sans truncate">
            {designName}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="p-6 flex items-center justify-center bg-gray-50">
          <div className="relative max-w-full max-h-[70vh] overflow-hidden rounded-lg">
            <img
              src={imageUrl}
              alt={designName}
              className="max-w-full max-h-full object-contain"
              style={{ maxWidth: '800px', maxHeight: '600px' }}
              onContextMenu={(e) => e.preventDefault()} // Prevent right-click context menu
              draggable={false} // Prevent dragging
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center font-source-sans">
            Click outside the modal or press the X button to close
          </p>
        </div>
      </div>
    </div>
  );
};