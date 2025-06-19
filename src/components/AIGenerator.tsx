import React, { useState } from 'react';
import { Sparkles, Mic, Image, AlertCircle } from 'lucide-react';
import { validatePrompt } from '../utils/imageGeneration';
import { ImageUpload } from './ImageUpload';
import { ga } from '../lib/ga';

interface AIGeneratorProps {
  onGenerate: (prompt: string, styleOverride?: string) => void;
  isGenerating: boolean;
  selectedStyle?: string | null;
  canGenerate: boolean;
  onShowWaitlistModal?: () => void;
}

export const AIGenerator: React.FC<AIGeneratorProps> = ({ 
  onGenerate, 
  isGenerating, 
  selectedStyle, 
  canGenerate,
  onShowWaitlistModal
}) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isGenerating) return;
    
    // Check if user can generate
    if (!canGenerate) {
      if (onShowWaitlistModal) {
        onShowWaitlistModal();
      }
      return;
    }
    
    // Check if prompt is empty
    if (!prompt.trim()) {
      setValidationError('Please enter a description for your design');
      return;
    }
    
    // Validate prompt before generation
    const validation = validatePrompt(prompt.trim());
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }
    
    setError(null);
    setValidationError(null);
    
    try {
      // Scroll to top IMMEDIATELY when button is clicked
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Start generation immediately without delay
      await onGenerate(prompt.trim(), selectedStyle || undefined);
      
    } catch (err) {
      setError('Failed to generate design. Please try again.');
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleTooltipClick = (buttonType: string) => {
    ga.trackFeatureClick(buttonType);
    setShowTooltip(buttonType);
    setTimeout(() => setShowTooltip(null), 2000);
  };

  const handleMicClick = () => {
    handleTooltipClick('mic');
  };

  const handleImageClick = () => {
    ga.trackFeatureClick('image_upload');
    setShowTooltip('image_upload');
    setTimeout(() => setShowTooltip(null), 2000);
  };

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
  };

  const currentError = validationError || error;

  // Check if OpenAI API key is available
  const isApiKeyAvailable = !!import.meta.env.VITE_OPENAI_API_KEY;

  return (
    <>
      {/* Desktop Layout - Same as mobile but not sticky */}
      <div className="hidden lg:block bg-white border-b border-gray-100 pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="w-full lg:w-[640px] mx-auto">
            {/* Text input area with buttons inside at bottom - same as mobile */}
            <div className={`relative bg-white rounded-2xl border-2 transition-all ${
              currentError ? 'border-red-300' : 'border-black'
            }`}>
              {/* Enhanced watermark text - only show when empty */}
              {!prompt && (
                <div className="absolute top-3 left-4 text-gray-400 text-sm font-source-sans pointer-events-none">
                  Try: "Majestic lion wearing a crown with golden mane"
                </div>
              )}
              
              {/* Enhanced text input - auto-sizing */}
              <textarea
                value={prompt}
                onChange={handlePromptChange}
                placeholder=""
                className="w-full px-4 pt-3 pb-12 bg-transparent text-base placeholder-gray-500 focus:outline-none resize-none font-source-sans"
                disabled={isGenerating}
                rows={1}
                maxLength={1000}
                style={{
                  minHeight: '48px',
                  maxHeight: '96px', // 2 lines max
                  overflowY: prompt.split('\n').length > 2 || prompt.length > 80 ? 'auto' : 'hidden'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 96) + 'px';
                }}
              />

              {/* Bottom row with icons and generate button - inside the input field */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                {/* Left side icons */}
                <div className="flex space-x-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleMicClick}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all relative overflow-hidden group"
                      title="Voice input"
                    >
                      <Mic className="h-4 w-4 text-gray-600 group-hover:text-vibrant-pink transition-colors" />
                      <div className="absolute inset-0 bg-vibrant-pink opacity-0 group-hover:opacity-10 rounded-full transition-opacity"></div>
                    </button>
                    {showTooltip === 'mic' && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap z-50">
                        Coming soon 🦘
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleImageClick}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all relative overflow-hidden group"
                      title="Upload reference image"
                    >
                      <Image className="h-4 w-4 text-gray-600 group-hover:text-vibrant-pink transition-colors" />
                      <div className="absolute inset-0 bg-vibrant-pink opacity-0 group-hover:opacity-10 rounded-full transition-opacity"></div>
                    </button>
                    {showTooltip === 'image_upload' && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap z-50">
                        Coming soon 🦘
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Generate button - right aligned */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center space-x-2 relative overflow-hidden ${
                    !isGenerating
                      ? 'bg-vibrant-pink text-white hover:bg-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-source-sans text-sm">Creating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span className="font-source-sans text-sm">
                        {canGenerate ? 'Generate Design' : 'Join Waitlist'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Enhanced error display */}
            {currentError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 text-sm font-medium font-source-sans">Generation Error</p>
                  <p className="text-red-600 text-sm font-source-sans mt-1">{currentError}</p>
                </div>
              </div>
            )}

            {/* API Key Status Notice */}
            {!isApiKeyAvailable && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-700 text-sm font-medium font-source-sans">Demo Mode</p>
                  <p className="text-yellow-600 text-sm font-source-sans mt-1">
                    AI image generation is currently unavailable. Join our waitlist below to be notified when this feature is ready!
                  </p>
                </div>
              </div>
            )}

            {/* Generation limit notice */}
            {!canGenerate && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-700 text-sm font-medium font-source-sans">Generation Limit Reached</p>
                  <p className="text-blue-600 text-sm font-source-sans mt-1">
                    You've reached the 3 design limit for the beta. Join our waitlist to get early access when we launch!
                  </p>
                </div>
              </div>
            )}

            {/* Quality indicator with beta notice */}
            {selectedStyle && isApiKeyAvailable && canGenerate && (
              <div className="mt-4 flex items-center justify-center">
                <div className="inline-flex items-center px-4 py-2 bg-vibrant-pink/10 rounded-full">
                  <span className="text-vibrant-pink text-sm font-medium font-source-sans">
                    You are using the BETA version. Please join our waiting list.
                  </span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Mobile Layout - Sticky at bottom, above keyboard */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        <div className="px-4 py-3">
         <form onSubmit={handleSubmit} className="w-full lg:w-[640px] mx-auto">
            {/* Text input area with buttons inside at bottom */}
            <div className={`relative bg-white rounded-2xl border-2 transition-all ${
              currentError ? 'border-red-300' : 'border-black'
            }`}>
              {/* Enhanced watermark text - only show when empty */}
              {!prompt && (
                <div className="absolute top-3 left-4 text-gray-400 text-sm font-source-sans pointer-events-none">
                  Try: "Majestic lion wearing a crown with golden mane"
                </div>
              )}
              
              {/* Enhanced text input - auto-sizing */}
              <textarea
                value={prompt}
                onChange={handlePromptChange}
                placeholder=""
                className="w-full px-4 pt-3 pb-12 bg-transparent text-base placeholder-gray-500 focus:outline-none resize-none font-source-sans"
                disabled={isGenerating}
                rows={1}
                maxLength={1000}
                style={{
                  minHeight: '48px',
                  maxHeight: '96px', // 2 lines max on mobile
                  overflowY: prompt.split('\n').length > 2 || prompt.length > 80 ? 'auto' : 'hidden'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 96) + 'px';
                }}
              />

              {/* Bottom row with icons and generate button - inside the input field */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                {/* Left side icons */}
                <div className="flex space-x-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleMicClick}
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all relative overflow-hidden group"
                      title="Voice input"
                    >
                      <Mic className="h-4 w-4 text-gray-600 group-hover:text-vibrant-pink transition-colors" />
                      <div className="absolute inset-0 bg-vibrant-pink opacity-0 group-hover:opacity-10 rounded-full transition-opacity"></div>
                    </button>
                    {showTooltip === 'mic' && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap z-50">
                        Coming soon 🦘
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleImageClick}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all relative overflow-hidden group"
                      title="Upload reference image"
                    >
                      <Image className="h-4 w-4 text-gray-600 group-hover:text-vibrant-pink transition-colors" />
                      <div className="absolute inset-0 bg-vibrant-pink opacity-0 group-hover:opacity-10 rounded-full transition-opacity"></div>
                    </button>
                    {showTooltip === 'image_upload' && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap z-50">
                        Coming soon 🦘
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Generate button - right aligned */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`h-10 px-5 rounded-full font-semibold transition-all flex items-center space-x-1 relative overflow-hidden ${
                    !isGenerating
                      ? 'bg-vibrant-pink text-white hover:bg-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-source-sans text-xs">Creating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3" />
                      <span className="font-source-sans text-xs">
                        {canGenerate ? 'Generate' : 'Join Waitlist'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Enhanced error display */}
            {currentError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 text-sm font-medium font-source-sans">Generation Error</p>
                  <p className="text-red-600 text-sm font-source-sans mt-1">{currentError}</p>
                </div>
              </div>
            )}

            {/* API Key Status Notice */}
            {!isApiKeyAvailable && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-700 text-sm font-medium font-source-sans">Demo Mode</p>
                  <p className="text-yellow-600 text-sm font-source-sans mt-1">
                    AI image generation is currently unavailable. Join our waitlist below to be notified when this feature is ready!
                  </p>
                </div>
              </div>
            )}

            {/* Generation limit notice */}
            {!canGenerate && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-700 text-sm font-medium font-source-sans">Generation Limit Reached</p>
                  <p className="text-blue-600 text-sm font-source-sans mt-1">
                    You've reached the 3 design limit for the beta. Join our waitlist to get early access when we launch!
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};