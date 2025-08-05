'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon, CodeBracketIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Facility {
  icon: string;
  title: string;
}

interface PropertyFacilitiesEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

const facilityOptions = [
  { value: '🏊‍♂️', label: 'Swimming Pool' },
  { value: '🏋️‍♂️', label: 'Gym' },
  { value: '🚗', label: 'Parking' },
  { value: '🛡️', label: 'Security' },
  { value: '🏞️', label: 'Garden' },
  { value: '🎾', label: 'Sports Court' },
  { value: '👶', label: 'Kids Play Area' },
  { value: '🏪', label: 'Clubhouse' },
  { value: '🌡️', label: 'AC' },
  { value: '💡', label: 'Power Backup' },
  { value: '💧', label: 'Water Supply' },
  { value: '🚿', label: 'Modern Bathrooms' },
  { value: '🍽️', label: 'Kitchen' },
  { value: '📺', label: 'Entertainment' },
  { value: '🌐', label: 'Internet' },
  { value: '🏥', label: 'Medical' },
];

export default function PropertyFacilitiesEditor({ value, onChange, label = "Property Facilities", placeholder = "Add facilities and amenities available in the property" }: PropertyFacilitiesEditorProps) {
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>(() => {
    try {
      return value ? JSON.parse(value) : [];
    } catch {
      return [];
    }
  });

  const updateFacilities = (newFacilities: Facility[]) => {
    setFacilities(newFacilities);
    onChange(JSON.stringify(newFacilities));
  };

  const addFacility = () => {
    const newFacilities = [...facilities, { icon: '🏊‍♂️', title: '' }];
    updateFacilities(newFacilities);
  };

  const removeFacility = (index: number) => {
    const newFacilities = facilities.filter((_, i) => i !== index);
    updateFacilities(newFacilities);
  };

  const updateFacility = (index: number, field: keyof Facility, value: string) => {
    const newFacilities = facilities.map((facility, i) => 
      i === index ? { ...facility, [field]: value } : facility
    );
    updateFacilities(newFacilities);
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
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white font-mono text-sm"
            placeholder={`[
  {
    "icon": "🏊‍♂️",
    "title": "Swimming Pool"
  },
  {
    "icon": "🏋️‍♂️",
    "title": "Fitness Center"
  }
]`}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter facilities in JSON format. Each facility should have an icon and title.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
        {facilities.map((facility, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Facility {index + 1}
              </h4>
              <button
                type="button"
                onClick={() => removeFacility(index)}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Icon Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon & Type
                </label>
                <select
                  value={facility.icon}
                  onChange={(e) => updateFacility(index, 'icon', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                >
                  {facilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.value} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Title (Optional)
                </label>
                <input
                  type="text"
                  value={facility.title}
                  onChange={(e) => updateFacility(index, 'title', e.target.value)}
                  placeholder="Leave empty to use default name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        ))}

          <button
            type="button"
            onClick={addFacility}
            className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-brand-primary hover:text-brand-primary dark:hover:border-brand-primary dark:hover:text-brand-primary transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Facility
          </button>
        </div>
      )}

      {facilities.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
            Preview
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {facilities.map((facility, index) => {
              const defaultName = facilityOptions.find(opt => opt.value === facility.icon)?.label;
              return (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <span className="text-lg">{facility.icon}</span>
                  <span className="text-green-900 dark:text-green-100">
                    {facility.title || defaultName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}