'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon, CodeBracketIcon, EyeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface FloorPlan {
  name: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  image: string; // Changed from imageUrl to image for consistency
  description?: string;
}

interface PropertyFloorPlansEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function PropertyFloorPlansEditor({ 
  value, 
  onChange, 
  label = "Floor Plans", 
  placeholder = "Add floor plans with details and pricing" 
}: PropertyFloorPlansEditorProps) {
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(() => {
    try {
      return value ? JSON.parse(value) : [];
    } catch {
      return [];
    }
  });

  const updateFloorPlans = (newFloorPlans: FloorPlan[]) => {
    setFloorPlans(newFloorPlans);
    onChange(JSON.stringify(newFloorPlans));
  };

  const addFloorPlan = () => {
    const newFloorPlans = [...floorPlans, {
      name: '',
      size: '',
      bedrooms: 1,
      bathrooms: 1,
      price: '',
      image: '', // Changed from imageUrl to image
      description: ''
    }];
    updateFloorPlans(newFloorPlans);
  };

  const removeFloorPlan = (index: number) => {
    const newFloorPlans = floorPlans.filter((_, i) => i !== index);
    updateFloorPlans(newFloorPlans);
  };

  const updateFloorPlan = (index: number, field: keyof FloorPlan, value: string | number) => {
    const newFloorPlans = floorPlans.map((floorPlan, i) => 
      i === index ? { ...floorPlan, [field]: value } : floorPlan
    );
    updateFloorPlans(newFloorPlans);
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

      {isJsonMode ? (
        <div className="space-y-4">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={15}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white font-mono text-sm"
            placeholder={`[
  {
    "name": "Type A - Studio",
    "size": "650 sq.ft.",
    "bedrooms": 1,
    "bathrooms": 1,
    "price": "$180,000",
    "imageUrl": "https://example.com/floor-plan-a.jpg",
    "description": "Compact and efficient design perfect for young professionals"
  },
  {
    "name": "Type B - Two Bedroom",
    "size": "1200 sq.ft.",
    "bedrooms": 2,
    "bathrooms": 2,
    "price": "$320,000",
    "imageUrl": "https://example.com/floor-plan-b.jpg",
    "description": "Spacious layout ideal for small families"
  }
]`}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter floor plans in JSON format. Each plan should include name, size, bedrooms, bathrooms, price, and imageUrl.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {floorPlans.map((floorPlan, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  Floor Plan {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeFloorPlan(index)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Details */}
                <div className="space-y-4">
                  {/* Plan Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      value={floorPlan.name}
                      onChange={(e) => updateFloorPlan(index, 'name', e.target.value)}
                      placeholder="e.g., Type A - Studio Apartment"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  {/* Size and Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Size
                      </label>
                      <input
                        type="text"
                        value={floorPlan.size}
                        onChange={(e) => updateFloorPlan(index, 'size', e.target.value)}
                        placeholder="e.g., 1200 sq.ft."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price
                      </label>
                      <input
                        type="text"
                        value={floorPlan.price}
                        onChange={(e) => updateFloorPlan(index, 'price', e.target.value)}
                        placeholder="e.g., $250,000"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Bedrooms and Bathrooms */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bedrooms
                      </label>
                      <select
                        value={floorPlan.bedrooms}
                        onChange={(e) => updateFloorPlan(index, 'bedrooms', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                      >
                        {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bathrooms
                      </label>
                      <select
                        value={floorPlan.bathrooms}
                        onChange={(e) => updateFloorPlan(index, 'bathrooms', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                      >
                        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Bathroom' : 'Bathrooms'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={floorPlan.description || ''}
                      onChange={(e) => updateFloorPlan(index, 'description', e.target.value)}
                      placeholder="Brief description of this floor plan..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white resize-none"
                    />
                  </div>
                </div>

                {/* Right Column - Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Floor Plan Image
                  </label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={floorPlan.image}
                      onChange={(e) => updateFloorPlan(index, 'image', e.target.value)}
                      placeholder="https://example.com/floor-plan.jpg"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    />
                    {floorPlan.image && (
                      <div className="mt-2">
                        <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden">
                          <Image
                            src={floorPlan.image}
                            alt={floorPlan.name || 'Floor Plan'}
                            fill
                            className="object-contain"
                            onError={() => {
                              // Handle image error
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addFloorPlan}
            className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-brand-primary hover:text-brand-primary dark:hover:border-brand-primary dark:hover:text-brand-primary transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Floor Plan
          </button>
        </div>
      )}

      {floorPlans.length > 0 && !isJsonMode && (
        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
            Preview ({floorPlans.length} Floor Plans)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {floorPlans.map((plan, index) => (
              <div key={index} className="bg-white dark:bg-purple-800/30 p-3 rounded-lg">
                <div className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  {plan.name || `Plan ${index + 1}`}
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-300">
                  {plan.size} • {plan.bedrooms}BR • {plan.bathrooms}BA • {plan.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}