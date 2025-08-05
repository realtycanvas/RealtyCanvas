'use client';

import { useState } from 'react';
import { CodeBracketIcon, EyeIcon, PhotoIcon, XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface SitePlanData {
  title: string;
  description: string;
  imageUrl: string;
  features?: string[];
  dimensions?: {
    totalArea: string;
    builtUpArea: string;
    openSpace: string;
  };
  amenities?: string[];
}

interface PropertySitePlanEditorProps {
  sitePlanTitle: string;
  sitePlanDescription: string;
  sitePlanImage: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImageChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function PropertySitePlanEditor({ 
  sitePlanTitle,
  sitePlanDescription,
  sitePlanImage,
  onTitleChange,
  onDescriptionChange,
  onImageChange,
  label = "Site Plan", 
  placeholder = "Add site plan details and layout information" 
}: PropertySitePlanEditorProps) {
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sitePlanData, setSitePlanData] = useState<SitePlanData>({
    title: sitePlanTitle || '',
    description: sitePlanDescription || '',
    imageUrl: sitePlanImage || '',
    features: [],
    dimensions: {
      totalArea: '',
      builtUpArea: '',
      openSpace: ''
    },
    amenities: []
  });

  const updateSitePlanData = (field: keyof SitePlanData, value: any) => {
    const newData = { ...sitePlanData, [field]: value };
    setSitePlanData(newData);
    
    // Update parent component
    if (field === 'title') onTitleChange(value);
    if (field === 'description') onDescriptionChange(value);
    if (field === 'imageUrl') onImageChange(value);
  };

  const updateDimensions = (field: keyof NonNullable<SitePlanData['dimensions']>, value: string) => {
    const newDimensions = {
      totalArea: '',
      builtUpArea: '',
      openSpace: '',
      ...sitePlanData.dimensions,
      [field]: value
    };
    setSitePlanData(prev => ({ ...prev, dimensions: newDimensions }));
  };

  const addFeature = () => {
    const newFeatures = [...(sitePlanData.features || []), ''];
    updateSitePlanData('features', newFeatures);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(sitePlanData.features || [])];
    newFeatures[index] = value;
    updateSitePlanData('features', newFeatures);
  };

  const removeFeature = (index: number) => {
    const newFeatures = (sitePlanData.features || []).filter((_, i) => i !== index);
    updateSitePlanData('features', newFeatures);
  };

  const predefinedAmenities = [
    'Swimming Pool', 'Gymnasium', 'Children\'s Play Area', 'Landscaped Gardens',
    'Jogging Track', 'Clubhouse', 'Tennis Court', 'Basketball Court',
    'Parking Area', 'Security Cabin', 'Generator Room', 'Water Tank',
    'Electrical Room', 'Waste Management', 'Fire Fighting Equipment', 'CCTV Surveillance'
  ];

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = sitePlanData.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    updateSitePlanData('amenities', newAmenities);
  };

  const handleJsonChange = (jsonValue: string) => {
    try {
      const parsed = JSON.parse(jsonValue);
      if (parsed.title) onTitleChange(parsed.title);
      if (parsed.description) onDescriptionChange(parsed.description);
      if (parsed.imageUrl) onImageChange(parsed.imageUrl);
      setSitePlanData(parsed);
    } catch (error) {
      // Handle JSON parsing errors silently
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        updateSitePlanData('imageUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImagePreview(result);
          updateSitePlanData('imageUrl', result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    updateSitePlanData('imageUrl', '');
  };

  const getJsonValue = () => {
    return JSON.stringify(sitePlanData, null, 2);
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
            value={getJsonValue()}
            onChange={(e) => handleJsonChange(e.target.value)}
            rows={20}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white font-mono text-sm"
            placeholder={`{
  "title": "Master Site Plan",
  "description": "Comprehensive layout of the entire development...",
  "imageUrl": "https://example.com/site-plan.jpg",
  "features": ["Central Courtyard", "Multiple Entrances"],
  "dimensions": {
    "totalArea": "10 acres",
    "builtUpArea": "60%",
    "openSpace": "40%"
  },
  "amenities": ["Swimming Pool", "Gymnasium"]
}`}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter site plan information in JSON format.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Site Plan Details
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Plan Title
                  </label>
                  <input
                    type="text"
                    value={sitePlanData.title}
                    onChange={(e) => updateSitePlanData('title', e.target.value)}
                    placeholder="e.g., Master Site Plan"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={sitePlanData.description}
                    onChange={(e) => updateSitePlanData('description', e.target.value)}
                    placeholder="Describe the site layout, key features, and overall design..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white resize-none"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Dimensions
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="text"
                        value={sitePlanData.dimensions?.totalArea || ''}
                        onChange={(e) => updateDimensions('totalArea', e.target.value)}
                        placeholder="Total Area"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">Total Area</p>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={sitePlanData.dimensions?.builtUpArea || ''}
                        onChange={(e) => updateDimensions('builtUpArea', e.target.value)}
                        placeholder="Built-up %"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">Built-up Area</p>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={sitePlanData.dimensions?.openSpace || ''}
                        onChange={(e) => updateDimensions('openSpace', e.target.value)}
                        placeholder="Open Space %"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">Open Space</p>
                    </div>
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key Features
                  </label>
                  <div className="space-y-2">
                    {(sitePlanData.features || []).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="e.g., Central Courtyard"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-sm text-brand-primary dark:text-brand-primary hover:text-primary-600 dark:hover:text-primary-300"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Image */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Site Plan Image
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setUploadMethod('url')}
                      className={`px-2 py-1 text-xs rounded ${
                        uploadMethod === 'url'
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMethod('file')}
                      className={`px-2 py-1 text-xs rounded ${
                        uploadMethod === 'file'
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Upload
                    </button>
                  </div>
                </div>

                {uploadMethod === 'url' ? (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={sitePlanData.imageUrl}
                      onChange={(e) => updateSitePlanData('imageUrl', e.target.value)}
                      placeholder="https://example.com/site-plan.jpg"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {imagePreview ? (
                      <div className="relative">
                        <div className="w-full h-64 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden">
                          <Image
                            src={imagePreview}
                            alt="Site Plan Preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('site-plan-upload')?.click()}
                      >
                        <CloudArrowUpIcon className="mx-auto h-16 w-16 text-gray-400" />
                        <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">
                          Upload Site Plan Image
                        </p>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-green-600 dark:text-green-400">Click to browse</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF, PDF up to 10MB
                        </p>
                        <input
                          id="site-plan-upload"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                )}

                {(sitePlanData.imageUrl && uploadMethod === 'url') && (
                  <div className="mt-2">
                    <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden">
                      <Image
                        src={sitePlanData.imageUrl}
                        alt={sitePlanData.title || 'Site Plan'}
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

            {/* Site Amenities */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Site Amenities & Infrastructure
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {predefinedAmenities.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`text-sm px-3 py-2 rounded-md border transition-colors ${
                      (sitePlanData.amenities || []).includes(amenity)
                        ? 'bg-indigo-100 dark:bg-indigo-900 border-primary-300 dark:border-secondary-700 text-indigo-700 dark:text-indigo-300'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {sitePlanData.title && !isJsonMode && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
            Preview
          </h4>
          <div className="space-y-2">
            <div className="font-semibold text-green-900 dark:text-green-100">
              {sitePlanData.title}
            </div>
            {sitePlanData.description && (
              <div className="text-sm text-green-700 dark:text-green-300">
                {sitePlanData.description.substring(0, 150)}
                {sitePlanData.description.length > 150 ? '...' : ''}
              </div>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {(sitePlanData.amenities || []).slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="inline-block bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded"
                >
                  {amenity}
                </span>
              ))}
              {(sitePlanData.amenities || []).length > 3 && (
                <span className="text-xs text-green-600 dark:text-green-400">
                  +{(sitePlanData.amenities || []).length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}