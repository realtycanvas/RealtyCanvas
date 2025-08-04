'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon, CodeBracketIcon, EyeIcon } from '@heroicons/react/24/outline';

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

export default function PropertyHighlightsEditor({ value, onChange, label = "Property Highlights", placeholder = "Add key features and highlights of your property" }: PropertyHighlightsEditorProps) {
  const [isJsonMode, setIsJsonMode] = useState(false);
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
          <button
            type="button"
            onClick={() => setIsJsonMode(!isJsonMode)}
            className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              isJsonMode
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
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
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={highlight.title}
                    onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                    placeholder="e.g., Prime Location"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={highlight.description}
                    onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                    placeholder="Brief description..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white resize-none"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addHighlight}
            className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Highlight
          </button>
        </div>
      )}

      {highlights.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Preview
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="text-lg">{highlight.icon}</div>
                <div>
                  <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {highlight.title || 'Untitled'}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
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