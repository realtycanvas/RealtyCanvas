import React from 'react';

interface PropertyAboutProps {
  title?: string;
  description?: string;
  mainTitle?: string;
}

const PropertyAbout: React.FC<PropertyAboutProps> = ({ 
  title, 
  description,
  mainTitle = 'About This Property'
}) => {
  if (!description) return null;
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{mainTitle}</h2>
      {title && <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">{title}</h3>}
      <div 
        className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

export default PropertyAbout;