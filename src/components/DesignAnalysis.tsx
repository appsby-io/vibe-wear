import React, { useState } from 'react';
import { Eye, Lightbulb, TrendingUp, X, Loader2 } from 'lucide-react';
import { analyzeDesignWithGPT4o, generatePromptSuggestions } from '../utils/imageAnalysis';

interface Design {
  id: string;
  name: string;
  imageUrl: string;
  prompt?: string;
  revisedPrompt?: string;
}

interface DesignAnalysisProps {
  design: Design;
  originalPrompt: string;
  selectedStyle: string;
  productColor: string;
  onClose: () => void;
}

export const DesignAnalysis: React.FC<DesignAnalysisProps> = ({
  design,
  originalPrompt,
  selectedStyle,
  productColor,
  onClose,
}) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeDesignWithGPT4o(
        design.imageUrl,
        originalPrompt,
        selectedStyle,
        productColor
      );
      
      if (result.success) {
        setAnalysis(result.analysis);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to analyze design. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!analysis) return;
    
    setIsGeneratingSuggestions(true);
    setError(null);
    
    try {
      const result = await generatePromptSuggestions(
        design.imageUrl,
        originalPrompt,
        selectedStyle,
        analysis
      );
      
      if (result.success) {
        setSuggestions(result.suggestions);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to generate suggestions. Please try again.');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-vibrant-pink" />
            <h2 className="text-2xl font-bold text-gray-900 font-source-sans">
              Design Analysis
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Design Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 font-source-sans">
                Generated Design
              </h3>
              <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center">
                <img
                  src={design.imageUrl}
                  alt={design.name}
                  className="max-w-full max-h-64 object-contain rounded-lg"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 font-source-sans">
                Design Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Original Prompt:</span>
                  <p className="text-gray-600 mt-1 font-source-sans">"{originalPrompt}"</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Style:</span>
                  <p className="text-gray-600 mt-1 font-source-sans">{selectedStyle}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Product Color:</span>
                  <p className="text-gray-600 mt-1 font-source-sans">{productColor}</p>
                </div>
                {design.revisedPrompt && (
                  <div>
                    <span className="font-medium text-gray-700">DALL-E Revised Prompt:</span>
                    <p className="text-gray-600 mt-1 text-xs font-source-sans">"{design.revisedPrompt}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Analysis Section */}
          <div className="space-y-6">
            {!analysis && !isAnalyzing && (
              <div className="text-center py-8">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-source-sans">
                  Get AI Analysis
                </h3>
                <p className="text-gray-600 mb-4 font-source-sans">
                  Let GPT-4o analyze your design and provide expert feedback on style consistency, 
                  t-shirt suitability, and improvement suggestions.
                </p>
                <button
                  onClick={handleAnalyze}
                  className="px-6 py-3 bg-vibrant-pink text-white rounded-lg hover:bg-pink-600 transition-colors font-source-sans font-semibold"
                >
                  Analyze Design with AI
                </button>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-vibrant-pink animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-source-sans">
                  GPT-4o is analyzing your design...
                </p>
              </div>
            )}

            {analysis && (
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 font-source-sans flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  AI Analysis Results
                </h3>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-blue-800 font-source-sans text-sm leading-relaxed">
                    {analysis}
                  </pre>
                </div>
                
                {!suggestions && !isGeneratingSuggestions && (
                  <div className="mt-6 pt-6 border-t border-blue-200">
                    <button
                      onClick={handleGenerateSuggestions}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-source-sans font-semibold"
                    >
                      <Lightbulb className="w-4 h-4" />
                      <span>Get Improvement Suggestions</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {isGeneratingSuggestions && (
              <div className="text-center py-4">
                <Loader2 className="w-6 h-6 text-vibrant-pink animate-spin mx-auto mb-2" />
                <p className="text-gray-600 text-sm font-source-sans">
                  Generating improved prompt suggestions...
                </p>
              </div>
            )}

            {suggestions && (
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4 font-source-sans flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Improvement Suggestions
                </h3>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-green-800 font-source-sans text-sm leading-relaxed">
                    {suggestions}
                  </pre>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 font-source-sans">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};