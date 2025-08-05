"use client"

import React, { useState } from 'react';
import Image from 'next/image';

interface FloorPlan {
  title?: string;
  name?: string;
  image?: string;
  imageUrl?: string; // Add support for imageUrl field from editor
  price?: string;
  size?: string;
  area?: string;
  bedrooms?: string;
  beds?: string;
  bathrooms?: string;
  baths?: string;
  description?: string;
}

interface PropertyFloorPlansProps {
  floorPlans: FloorPlan[] | string | null;
  title?: string;
}

const PropertyFloorPlans: React.FC<PropertyFloorPlansProps> = ({ 
  floorPlans, 
  title = 'Floor Plans' 
}) => {
  const [activePlan, setActivePlan] = useState<number>(0);
  const [imageError, setImageError] = useState<boolean>(false);
  
  if (!floorPlans) return null;
  
  // Ensure floorPlans is an array before mapping
  const floorPlansArray = Array.isArray(floorPlans) ? floorPlans : [];
  
  // Debug logging (remove in production)
  // console.log('PropertyFloorPlans - floorPlans:', floorPlans);
  // console.log('PropertyFloorPlans - floorPlansArray:', floorPlansArray);
  
  if (floorPlansArray.length === 0) return null;

  const currentPlan = floorPlansArray[activePlan];
  const imageUrl = currentPlan?.image || currentPlan?.imageUrl;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Floor plan tabs */}
        <div className="lg:w-1/4">
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {floorPlansArray.map((plan, index) => (
              <button
                key={index}
                onClick={() => {
                  setActivePlan(index);
                  setImageError(false); // Reset image error when switching plans
                }}
                className={`px-4 py-3 text-left rounded-lg transition-colors ${activePlan === index 
                  ? 'bg-brand-primary text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
              >
                <div className="font-medium">{plan.title || plan.name || `Plan ${index + 1}`}</div>
                {plan.size && <div className="text-sm opacity-80">{plan.size}</div>}
              </button>
            ))}
          </div>
        </div>
        
        {/* Active floor plan */}
        <div className="lg:w-3/4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          {currentPlan && (
            <div>
              <div className="relative w-full h-[300px] md:h-[400px] mb-4">
                {imageUrl && !imageError ? (
                  <Image 
                    src={imageUrl} 
                    alt={currentPlan.title || currentPlan.name || 'Floor Plan'} 
                    fill
                    className="object-contain rounded-lg"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>{imageError ? 'Failed to load image' : 'No floor plan image available'}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {currentPlan.price && (
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Price</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{currentPlan.price}</div>
                  </div>
                )}
                
                {(currentPlan.size || currentPlan.area) && (
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Size</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{currentPlan.size || currentPlan.area}</div>
                  </div>
                )}
                
                {(currentPlan.bedrooms || currentPlan.beds) && (
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{currentPlan.bedrooms || currentPlan.beds}</div>
                  </div>
                )}
                
                {(currentPlan.bathrooms || currentPlan.baths) && (
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Bathrooms</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{currentPlan.bathrooms || currentPlan.baths}</div>
                  </div>
                )}
              </div>
              
              {currentPlan.description && (
                <div className="text-gray-600 dark:text-gray-300">
                  {currentPlan.description}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyFloorPlans;