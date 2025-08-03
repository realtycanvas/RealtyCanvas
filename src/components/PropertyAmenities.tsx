import React from 'react';

interface PropertyAmenitiesProps {
  facilities: any[] | null;
  title?: string;
}

const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({ 
  facilities, 
  title = 'Project Facilities' 
}) => {
  if (!facilities || facilities.length === 0) return null;

  // Ensure facilities is an array before mapping
  const facilitiesArray = Array.isArray(facilities) ? facilities : [];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {facilitiesArray.map((facility, index) => {
          // Handle both string facilities and object facilities
          const isStringFacility = typeof facility === 'string';
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              {!isStringFacility && facility.icon && (
                <div className="text-indigo-600 dark:text-indigo-400 mb-2">
                  <span className="text-2xl">{facility.icon}</span>
                </div>
              )}
              <h3 className="text-md font-medium text-gray-900 dark:text-white text-center">
                {isStringFacility ? facility : facility.name || facility.title}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyAmenities;