import React, { useState } from 'react';

interface BulkPropertyUploadProps {
  onDataLoaded: (data: any) => void;
}

const BulkPropertyUpload: React.FC<BulkPropertyUploadProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    setSuccess(null);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/json') {
      setError('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        validatePropertyData(jsonData);
        onDataLoaded(jsonData);
        setSuccess('Property data loaded successfully!');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Invalid JSON format');
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/json') {
      setError('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        validatePropertyData(jsonData);
        onDataLoaded(jsonData);
        setSuccess('Property data loaded successfully!');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Invalid JSON format');
      }
    };
    reader.readAsText(file);
  };

  const validatePropertyData = (data: any) => {
    // Check for required fields
    const requiredFields = ['title', 'description', 'price', 'address', 'location'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate price is a number
    if (isNaN(Number(data.price))) {
      throw new Error('Price must be a number');
    }

    // Validate JSON fields
    const jsonFields = ['highlights', 'floorPlans', 'facilities', 'faqs'];
    for (const field of jsonFields) {
      if (data[field]) {
        try {
          if (typeof data[field] === 'string') {
            JSON.parse(data[field]);
          }
        } catch (error) {
          throw new Error(`Invalid JSON format in ${field}`);
        }
      }
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Bulk Upload</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Upload a JSON file with all property data at once.
      </p>

      <div
        className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-indigo-500' : 'border-gray-300'} border-dashed rounded-md dark:border-gray-700`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600 dark:text-gray-400">
            <label
              htmlFor="bulk-upload"
              className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Upload a JSON file</span>
              <input
                id="bulk-upload"
                name="bulk-upload"
                type="file"
                className="sr-only"
                accept="application/json"
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            JSON file with property data
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</div>
      )}
      {success && (
        <div className="mt-2 text-sm text-green-600 dark:text-green-500">{success}</div>
      )}

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Expected JSON Format:</h4>
        <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
          {`{
  "title": "Property Title",
  "description": "Property description...",
  "price": 500000,
  "address": "123 Main St",
  "location": "City, State",
  "currency": "USD",
  "beds": 3,
  "baths": 2,
  "area": 2000,
  "bannerTitle": "Banner Title",
  "bannerSubtitle": "Banner Subtitle",
  "bannerDescription": "Banner description...",
  "aboutTitle": "About Title",
  "aboutDescription": "About description...",
  "highlights": "[{\"icon\":\"✨\",\"title\":\"Feature 1\",\"description\":\"Description 1\"}]",
  "floorPlans": "[{\"name\":\"Plan 1\",\"price\":500000,\"beds\":3,\"baths\":2,\"area\":2000,\"image\":\"\"}]",
  "facilities": "[\"Facility 1\",\"Facility 2\"]",
  "faqs": "[{\"question\":\"Question 1\",\"answer\":\"Answer 1\"}]"
}`}
        </pre>
      </div>
    </div>
  );
};

export default BulkPropertyUpload;