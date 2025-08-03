"use client"

import React, { useState } from 'react';
import Image from 'next/image';

interface FloorPlan {
  title?: string;
  name?: string;
  image: string;
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
  
  if (!floorPlans) return null;
  
  // Ensure floorPlans is an array before mapping
  const floorPlansArray = Array.isArray(floorPlans) ? floorPlans : [];
  
  if (floorPlansArray.length === 0) return null;

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
                onClick={() => setActivePlan(index)}
                className={`px-4 py-3 text-left rounded-lg transition-colors ${activePlan === index 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
              >
                <div className="font-medium">{plan.title}</div>
                {plan.size && <div className="text-sm opacity-80">{plan.size}</div>}
              </button>
            ))}
          </div>
        </div>
        
        {/* Active floor plan */}
        <div className="lg:w-3/4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          {floorPlansArray[activePlan] && (
            <div>
              <div className="relative w-full h-[300px] md:h-[400px] mb-4">
                <Image 
                  src={floorPlansArray[activePlan].image} 
                  alt={floorPlansArray[activePlan].title || floorPlansArray[activePlan].name || 'Floor Plan'} 
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {floorPlansArray[activePlan].price && (
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Price</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{floorPlansArray[activePlan].price}</div>
                  </div>
                )}
                
                {(floorPlansArray[activePlan].size || floorPlansArray[activePlan].area) && (
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Size</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{floorPlansArray[activePlan].size || floorPlansArray[activePlan].area}</div>
                  </div>
                )}
                
                {(floorPlansArray[activePlan].bedrooms || floorPlansArray[activePlan].beds) && (
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{floorPlansArray[activePlan].bedrooms || floorPlansArray[activePlan].beds}</div>
                  </div>
                )}
                
                {(floorPlansArray[activePlan].bathrooms || floorPlansArray[activePlan].baths) && (
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Bathrooms</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{floorPlansArray[activePlan].bathrooms || floorPlansArray[activePlan].baths}</div>
                  </div>
                )}
              </div>
              
              {floorPlansArray[activePlan].description && (
                <div className="text-gray-600 dark:text-gray-300">
                  {floorPlansArray[activePlan].description}
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