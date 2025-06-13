import React, { useState, useRef, useCallback } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  selectedImage: File | null;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  selectedImage,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file type and size
  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a JPG or PNG file.';
    }

    if (file.size > maxSize) {
      return 'Image too large. Please upload a file under 5MB.';
    }

    return null;
  };

  // Create preview URL
  const createPreview = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    createPreview(file);
    onImageSelect(file);
  }, [onImageSelect, createPreview]);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  // Handle file input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  }, [handleFileSelect]);

  // Handle click to open file dialog
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle remove image
  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageSelect, previewUrl]);

  // Clean up preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className={className}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload reference image"
      />

      {/* Upload area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer
          ${dragActive 
            ? 'border-vibrant-pink bg-pink-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${selectedImage ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}
        `}
      >
        {selectedImage && previewUrl ? (
          // Preview with image
          <div className="flex items-center space-x-3">
            <div className="relative flex-shrink-0">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate font-source-sans">
                {selectedImage.name}
              </p>
              <p className="text-xs text-gray-500 font-source-sans">
                {(selectedImage.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
            <div className="flex-shrink-0">
              <ImageIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ) : (
          // Empty state
          <div className="text-center py-2">
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-source-sans">
              <span className="font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 font-source-sans mt-1">
              JPG, PNG up to 5MB
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-source-sans">{error}</p>
        </div>
      )}
    </div>
  );
};