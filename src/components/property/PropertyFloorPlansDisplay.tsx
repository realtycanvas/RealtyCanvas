'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import SmartImage from '@/components/ui/SmartImage';

interface FloorPlan {
  id: string;
  level: string;
  title: string;
  imageUrl: string;
  description?: string;
  totalUnits?: number;
  availableUnits?: number;
  areaRange?: string;
  priceRange?: string;
}

interface PropertyFloorPlansDisplayProps {
  floorPlans: FloorPlan[];
  className?: string;
}

export default function PropertyFloorPlansDisplay({ floorPlans, className = '' }: PropertyFloorPlansDisplayProps) {
  const [selectedFloor, setSelectedFloor] = useState(0);

  if (!floorPlans || floorPlans.length === 0) {
    return null;
  }

  const currentFloor = floorPlans[selectedFloor];

  const nextFloor = () => {
    setSelectedFloor((prev) => (prev + 1) % floorPlans.length);
  };

  const prevFloor = () => {
    setSelectedFloor((prev) => (prev - 1 + floorPlans.length) % floorPlans.length);
  };

  return (
    <div className={`${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Floor Plan</h2>
      </div>

      {/* Floor Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {floorPlans.map((floor, index) => (
          <div
            key={floor.id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 transition-all cursor-pointer hover:shadow-xl ${
              selectedFloor === index
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedFloor(index)}
          >
            <div className="aspect-square relative">
              <SmartImage
                src={floor.imageUrl}
                alt={`${floor.level} Floor Plan`}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 bg-blue-600 text-white text-center">
              <h3 className="font-bold text-lg">{floor.level}</h3>
              {floor.title && (
                <p className="text-sm text-blue-100 mt-1">{floor.title}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Floor Details */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative">
          <div className="aspect-video relative">
            <SmartImage
              src={currentFloor.imageUrl}
              alt={`${currentFloor.level} Floor Plan`}
              fill
              className="object-contain bg-gray-50"
            />
            
            {/* Navigation Arrows */}
            {floorPlans.length > 1 && (
              <>
                <button
                  onClick={prevFloor}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-colors"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
                </button>
                <button
                  onClick={nextFloor}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-colors"
                >
                  <ChevronRightIcon className="w-6 h-6 text-gray-600" />
                </button>
              </>
            )}
          </div>
          
          {/* Floor Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {currentFloor.level}
                {currentFloor.title && (
                  <span className="text-blue-600 ml-2">• {currentFloor.title}</span>
                )}
              </h3>
              
              {currentFloor.description && (
                <p className="text-gray-600 mb-3">{currentFloor.description}</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {currentFloor.totalUnits && (
                  <div>
                    <span className="text-gray-500">Total Units:</span>
                    <div className="font-semibold text-gray-900">{currentFloor.totalUnits}</div>
                  </div>
                )}
                {currentFloor.availableUnits !== undefined && (
                  <div>
                    <span className="text-gray-500">Available:</span>
                    <div className="font-semibold text-green-600">{currentFloor.availableUnits}</div>
                  </div>
                )}
                {currentFloor.areaRange && (
                  <div>
                    <span className="text-gray-500">Area Range:</span>
                    <div className="font-semibold text-gray-900">{currentFloor.areaRange}</div>
                  </div>
                )}
                {currentFloor.priceRange && (
                  <div>
                    <span className="text-gray-500">Price Range:</span>
                    <div className="font-semibold text-blue-600">{currentFloor.priceRange}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floor Navigation Dots */}
      {floorPlans.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {floorPlans.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedFloor(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                selectedFloor === index
                  ? 'bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
