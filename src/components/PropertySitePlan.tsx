import React from 'react';
import Image from 'next/image';

interface PropertySitePlanProps {
  sitePlanImage?: string;
  sitePlanTitle?: string;
  sitePlanDescription?: string;
  title?: string;
}

const PropertySitePlan: React.FC<PropertySitePlanProps> = ({ 
  sitePlanImage, 
  sitePlanTitle,
  sitePlanDescription,
  title = 'Site Plan'
}) => {
  if (!sitePlanImage) return null;
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="relative w-full h-[400px] md:h-[500px] mb-4">
          <Image 
            src={sitePlanImage} 
            alt={sitePlanTitle || 'Site Plan'} 
            fill
            className="object-contain rounded-lg"
          />
        </div>
        
        {sitePlanTitle && (
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
            {sitePlanTitle}
          </h3>
        )}
        
        {sitePlanDescription && (
          <div 
            className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400"
            dangerouslySetInnerHTML={{ __html: sitePlanDescription }}
          />
        )}
      </div>
    </div>
  );
};

export default PropertySitePlan;