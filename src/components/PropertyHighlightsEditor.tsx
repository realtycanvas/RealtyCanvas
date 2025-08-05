'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon, CodeBracketIcon, EyeIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Highlight {
  icon: string;
  title: string;
  description: string;
}

interface PropertyHighlightsEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  propertyData?: any; // For AI assistance
}

const iconOptions = [
  { value: '🏠', label: 'Home' },
  { value: '📍', label: 'Location' },
  { value: '🌟', label: 'Premium' },
  { value: '🏢', label: 'Modern' },
  { value: '🔒', label: 'Secure' },
  { value: '🚗', label: 'Parking' },
  { value: '🏊', label: 'Pool' },
  { value: '🏋️', label: 'Gym' },
  { value: '🌳', label: 'Garden' },
  { value: '💰', label: 'Investment' },
  { value: '🔗', label: 'Connectivity' },
  { value: '🏆', label: 'Premium' },
];

export default function PropertyHighlightsEditor({ value, onChange, label = "Property Highlights", placeholder = "Add key features and highlights of your property", propertyData }: PropertyHighlightsEditorProps) {
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [isAIAssisted, setIsAIAssisted] = useState(false);
  const [isGeneratingIcon, setIsGeneratingIcon] = useState<number | null>(null);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState<number | null>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState<number | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>(() => {
    try {
      return value ? JSON.parse(value) : [];
    } catch {
      return [];
    }
  });

  const updateHighlights = (newHighlights: Highlight[]) => {
    setHighlights(newHighlights);
    onChange(JSON.stringify(newHighlights));
  };

  const addHighlight = () => {
    const newHighlights = [...highlights, { icon: '🏠', title: '', description: '' }];
    updateHighlights(newHighlights);
  };

  const removeHighlight = (index: number) => {
    const newHighlights = highlights.filter((_, i) => i !== index);
    updateHighlights(newHighlights);
  };

  const updateHighlight = (index: number, field: keyof Highlight, value: string) => {
    const newHighlights = highlights.map((highlight, i) => 
      i === index ? { ...highlight, [field]: value } : highlight
    );
    updateHighlights(newHighlights);
  };

  // AI function to suggest icon based on title
  const suggestIcon = async (index: number, title: string) => {
    if (!title.trim() || !isAIAssisted) return;
    
    setIsGeneratingIcon(index);
    try {
      const response = await fetch('/api/property-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'suggest_icon',
          highlightTitle: title
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.icon) {
          updateHighlight(index, 'icon', data.icon);
        }
      }
    } catch (error) {
      console.error('Error suggesting icon:', error);
    } finally {
      setIsGeneratingIcon(null);
    }
  };

  // AI function to generate title
  const generateTitle = async (index: number) => {
    if (!isAIAssisted || !propertyData) return;
    
    setIsGeneratingTitle(index);
    try {
      const response = await fetch('/api/property-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'generate_highlight_title',
          propertyData: propertyData,
          highlightIndex: index
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.title) {
          updateHighlight(index, 'title', data.title);
          // Auto-suggest icon after generating title
          setTimeout(() => suggestIcon(index, data.title), 500);
        }
      }
    } catch (error) {
      console.error('Error generating title:', error);
    } finally {
      setIsGeneratingTitle(null);
    }
  };

  // AI function to generate description
  const generateDescription = async (index: number) => {
    if (!isAIAssisted || !propertyData) return;
    
    setIsGeneratingDescription(index);
    try {
      const response = await fetch('/api/property-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'generate_highlight_description',
          propertyData: propertyData,
          highlightIndex: index,
          highlightTitle: highlights[index]?.title || ''
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.description) {
          updateHighlight(index, 'description', data.description);
        }
      }
    } catch (error) {
      console.error('Error generating description:', error);
    } finally {
      setIsGeneratingDescription(null);
    }
  };

  // AI function to generate highlights
  const generateHighlights = async () => {
    if (!propertyData || !isAIAssisted) return;
    
    try {
      const response = await fetch('/api/property-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'generate_highlights',
          propertyData: propertyData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.highlights && Array.isArray(data.highlights)) {
          updateHighlights(data.highlights);
        }
      }
    } catch (error) {
      console.error('Error generating highlights:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {placeholder}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* AI Assistance Toggle */}
          <button
            type="button"
            onClick={() => setIsAIAssisted(!isAIAssisted)}
            className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              isAIAssisted
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <SparklesIcon className="w-4 h-4 mr-1" />
            {isAIAssisted ? 'AI Enabled' : 'Enable AI'}
          </button>
          
          <button
            type="button"
            onClick={() => setIsJsonMode(!isJsonMode)}
            className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              isJsonMode
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'bg-primary-100 dark:bg-secondary-900 text-brand-primary dark:text-brand-primary'
            }`}
          >
            {isJsonMode ? (
              <>
                <EyeIcon className="w-4 h-4 mr-1" />
                Visual Editor
              </>
            ) : (
              <>
                <CodeBracketIcon className="w-4 h-4 mr-1" />
                JSON Mode
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Generate Highlights Button */}
      {isAIAssisted && propertyData && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100">
                AI-Powered Highlights
              </h4>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                Let AI generate compelling highlights based on your property details
              </p>
            </div>
            <button
              type="button"
              onClick={generateHighlights}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
            >
              <SparklesIcon className="w-4 h-4 mr-2" />
              Generate Highlights
            </button>
          </div>
        </div>
      )}

      {isJsonMode ? (
        <div className="space-y-4">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white font-mono text-sm"
            placeholder={`[
  {
    "icon": "🏠",
    "title": "Prime Location",
    "description": "Strategically located in the heart of the city"
  },
  {
    "icon": "🌟",
    "title": "Modern Design",
    "description": "Contemporary architecture with premium finishes"
  }
]`}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter highlights in JSON format. Each highlight should have an icon, title, and description.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {highlights.map((highlight, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Highlight {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Icon Selection */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon
                  </label>
                  <div className="relative">
                    <select
                      value={highlight.icon}
                      onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    >
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value} {option.label}
                        </option>
                      ))}
                    </select>
                    {isGeneratingIcon === index && (
                      <div className="absolute right-2 top-2">
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  {/* Generate Icon Button - Only show after title is added */}
                  {isAIAssisted && highlight.title.trim() && (
                    <button
                      type="button"
                      onClick={() => suggestIcon(index, highlight.title)}
                      disabled={isGeneratingIcon === index}
                      className="mt-2 w-full flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                    >
                      {isGeneratingIcon === index ? (
                        <>
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-3 h-3 mr-1" />
                          Generate Icon
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={highlight.title}
                      onChange={(e) => {
                        updateHighlight(index, 'title', e.target.value);
                        // Auto-suggest icon when title changes (with debounce)
                        if (isAIAssisted && e.target.value.trim()) {
                          setTimeout(() => suggestIcon(index, e.target.value), 1000);
                        }
                      }}
                      placeholder="e.g., Prime Location"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    />
                    {isGeneratingTitle === index && (
                      <div className="absolute right-2 top-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  {/* Generate Title Button */}
                  {isAIAssisted && (
                    <button
                      type="button"
                      onClick={() => generateTitle(index)}
                      disabled={isGeneratingTitle === index}
                      className="mt-2 w-full flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md text-xs font-medium hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                    >
                      {isGeneratingTitle === index ? (
                        <>
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-3 h-3 mr-1" />
                          Generate Title
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      value={highlight.description}
                      onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                      placeholder="Brief description..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white resize-none"
                    />
                    {isGeneratingDescription === index && (
                      <div className="absolute right-2 top-2">
                        <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  {/* Generate Description Button */}
                  {isAIAssisted && (
                    <button
                      type="button"
                      onClick={() => generateDescription(index)}
                      disabled={isGeneratingDescription === index}
                      className="mt-2 w-full flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md text-xs font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                    >
                      {isGeneratingDescription === index ? (
                        <>
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-3 h-3 mr-1" />
                          Generate Description
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addHighlight}
            className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-brand-primary hover:text-brand-primary dark:hover:border-brand-primary dark:hover:text-brand-primary transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Highlight
          </button>
        </div>
      )}

      {highlights.length > 0 && (
        <div className="mt-6 p-4 bg-primary-50 dark:bg-secondary-900/20 rounded-lg border border-primary-200 dark:border-secondary-800">
          <h4 className="text-sm font-medium text-brand-secondary dark:text-white mb-2">
            Preview
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="text-lg">{highlight.icon}</div>
                <div>
                  <div className="text-sm font-medium text-brand-secondary dark:text-white">
                    {highlight.title || 'Untitled'}
                  </div>
                  <div className="text-xs text-brand-secondary dark:text-gray-300">
                    {highlight.description || 'No description'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}