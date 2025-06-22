import React, { useState } from 'react';
import { ArrowLeft, ToggleLeft, ToggleRight, Download, Eye, TrendingUp } from 'lucide-react';
import { useFeature, useFeatureToggle } from '../../store/useFeature';

interface AdminPageProps {
  onBack: () => void;
}

interface PromptData {
  id: string;
  original_prompt: string;
  enhanced_prompt: string;
  revised_prompt: string;
  style: string;
  product_color: string;
  quality: string;
  success: boolean;
  error_message: string;
  image_url: string;
  user_session: string;
  created_at: string;
}

interface PromptStats {
  total: number;
  successful: number;
  failed: number;
  successRate: number;
  topStyles: { style: string; count: number }[];
  topColors: { color: string; count: number }[];
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [prompts, setPrompts] = useState<PromptData[]>([]);
  const [stats, setStats] = useState<PromptStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptData | null>(null);
  
  const betaGateEnabled = useFeature('betaGate');
  const toggleFeature = useFeatureToggle();

  // Simple password protection (in production, use proper auth)
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'vibewear2025') {
      setIsAuthenticated(true);
      setError('');
      loadPromptData();
    } else {
      setError('Invalid password');
    }
  };

  const handleToggleBetaGate = () => {
    toggleFeature('betaGate', !betaGateEnabled);
  };

  const loadPromptData = async () => {
    setLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/rest/v1/user_prompts?order=created_at.desc`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPrompts(data);
        calculateStats(data);
      } else {
        console.error('Failed to fetch prompts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: PromptData[]) => {
    const total = data.length;
    const successful = data.filter(p => p.success).length;
    const failed = total - successful;
    const successRate = total > 0 ? (successful / total) * 100 : 0;

    // Count styles
    const styleCount: Record<string, number> = {};
    const colorCount: Record<string, number> = {};

    data.forEach(prompt => {
      styleCount[prompt.style] = (styleCount[prompt.style] || 0) + 1;
      colorCount[prompt.product_color] = (colorCount[prompt.product_color] || 0) + 1;
    });

    const topStyles = Object.entries(styleCount)
      .map(([style, count]) => ({ style, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topColors = Object.entries(colorCount)
      .map(([color, count]) => ({ color, count }))
      .sort((a, b) => b.count - a.count);

    setStats({
      total,
      successful,
      failed,
      successRate,
      topStyles,
      topColors,
    });
  };

  const exportData = () => {
    const csvContent = [
      'ID,Original Prompt,Style,Product Color,Quality,Success,Error Message,Created At',
      ...prompts.map(p => 
        `"${p.id}","${p.original_prompt}","${p.style}","${p.product_color}","${p.quality}","${p.success}","${p.error_message || ''}","${p.created_at}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibewear-prompts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center font-source-sans">
            Admin Access
          </h1>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-source-sans">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-pink focus:border-vibrant-pink transition-colors font-source-sans"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm font-source-sans">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-vibrant-pink text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors font-source-sans font-semibold"
            >
              Access Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-source-sans"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to App
              </button>
              <h1 className="text-2xl font-bold text-gray-900 ml-6 font-source-sans">Admin Panel</h1>
            </div>
            <button
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-vibrant-pink text-white rounded-lg hover:bg-pink-600 transition-colors font-source-sans font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 font-source-sans">Total Prompts</p>
                  <p className="text-2xl font-bold text-gray-900 font-source-sans">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 font-source-sans">Successful</p>
                  <p className="text-2xl font-bold text-green-600 font-source-sans">{stats.successful}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">✗</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 font-source-sans">Failed</p>
                  <p className="text-2xl font-bold text-red-600 font-source-sans">{stats.failed}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">%</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 font-source-sans">Success Rate</p>
                  <p className="text-2xl font-bold text-purple-600 font-source-sans">{stats.successRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popular Styles and Colors */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-source-sans">Popular Styles</h3>
              <div className="space-y-3">
                {stats.topStyles.map((item) => (
                  <div key={item.style} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 font-source-sans capitalize">{item.style}</span>
                    <span className="text-sm font-semibold text-gray-900 font-source-sans">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-source-sans">Product Colors</h3>
              <div className="space-y-3">
                {stats.topColors.map((item) => (
                  <div key={item.color} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 font-source-sans">{item.color}</span>
                    <span className="text-sm font-semibold text-gray-900 font-source-sans">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feature Experiments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-source-sans">
            Feature Experiments
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 font-source-sans">Beta Gate Modal</h3>
                <p className="text-sm text-gray-600 font-source-sans">
                  Show beta gate modal after 3 designs or when adding to cart
                </p>
              </div>
              <button
                onClick={handleToggleBetaGate}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  betaGateEnabled
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {betaGateEnabled ? (
                  <>
                    <ToggleRight className="w-5 h-5" />
                    <span className="font-source-sans">ON</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-5 h-5" />
                    <span className="font-source-sans">OFF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Prompts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 font-source-sans">Recent Prompts</h2>
            <button
              onClick={loadPromptData}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-source-sans font-semibold disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibrant-pink mx-auto"></div>
              <p className="text-gray-600 mt-2 font-source-sans">Loading prompts...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-source-sans">
                      Prompt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-source-sans">
                      Style
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-source-sans">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-source-sans">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-source-sans">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prompts.slice(0, 50).map((prompt) => (
                    <tr key={prompt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-source-sans max-w-xs truncate">
                          {prompt.original_prompt}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 font-source-sans capitalize">
                          {prompt.style}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full font-source-sans ${
                          prompt.success 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {prompt.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-source-sans">
                        {new Date(prompt.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedPrompt(prompt)}
                          className="text-vibrant-pink hover:text-pink-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Prompt Detail Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 font-source-sans">Prompt Details</h3>
                <button
                  onClick={() => setSelectedPrompt(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-source-sans">Original Prompt</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg font-source-sans">
                    {selectedPrompt.original_prompt}
                  </p>
                </div>
                
                {selectedPrompt.enhanced_prompt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-source-sans">Enhanced Prompt</label>
                    <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg font-source-sans">
                      {selectedPrompt.enhanced_prompt}
                    </p>
                  </div>
                )}
                
                {selectedPrompt.revised_prompt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-source-sans">DALL-E Revised Prompt</label>
                    <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg font-source-sans">
                      {selectedPrompt.revised_prompt}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-source-sans">Style</label>
                    <p className="text-sm text-gray-900 font-source-sans capitalize">{selectedPrompt.style}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-source-sans">Product Color</label>
                    <p className="text-sm text-gray-900 font-source-sans">{selectedPrompt.product_color}</p>
                  </div>
                </div>
                
                {selectedPrompt.image_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-source-sans">Generated Image</label>
                    <img 
                      src={selectedPrompt.image_url} 
                      alt="Generated design" 
                      className="max-w-xs rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                
                {!selectedPrompt.success && selectedPrompt.error_message && (
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-1 font-source-sans">Error Message</label>
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg font-source-sans">
                      {selectedPrompt.error_message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};