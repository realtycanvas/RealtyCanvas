import React from 'react';
import Image from 'next/image';

interface PropertyBuilderProps {
  builderName?: string;
  builderLogo?: string;
  builderDescription?: string;
  title?: string;
}

const PropertyBuilder: React.FC<PropertyBuilderProps> = ({ 
  builderName, 
  builderLogo,
  builderDescription,
  title = 'About the Builder'
}) => {
  if (!builderName && !builderDescription) return null;
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {builderLogo && (
            <div className="md:w-1/4 flex-shrink-0">
              <div className="relative w-[200px] h-[100px]">
                <Image 
                  src={builderLogo} 
                  alt={builderName || 'Builder Logo'} 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
          
          <div className={`${builderLogo ? 'md:w-3/4' : 'w-full'}`}>
            {builderName && (
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">
                {builderName}
              </h3>
            )}
            
            {builderDescription && (
              <div 
                className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400"
                dangerouslySetInnerHTML={{ __html: builderDescription }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyBuilder;