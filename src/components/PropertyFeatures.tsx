import React from 'react';

// Define interfaces for highlight items
interface HighlightItem {
  icon?: string;
  title?: string;
  description?: string;
}

interface PropertyFeaturesProps {
  highlights: string | HighlightItem[] | { highlights: HighlightItem[] };
  title?: string;
}

const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({ 
  highlights, 
  title = 'Highlights' 
}) => {
  // Safely handle null or undefined highlights
  if (!highlights) return null;
  
  // Handle both string and object formats
  let highlightsData;
  try {
    highlightsData = typeof highlights === 'string' ? 
      JSON.parse(highlights) : highlights;
  } catch (error) {
    console.error('Error parsing highlights:', error);
    return null;
  }
  
  // Extract the highlights array from the parsed object if it exists
  let highlightItems: HighlightItem[] = [];
  
  if (Array.isArray(highlightsData)) {
    highlightItems = highlightsData;
  } else if (highlightsData && typeof highlightsData === 'object') {
    // Check if it has a highlights property that is an array
    if (highlightsData.highlights && Array.isArray(highlightsData.highlights)) {
      highlightItems = highlightsData.highlights;
    } else {
      // If it's an object but not in the expected format, return null
      console.error('Highlights data is not in expected format:', highlightsData);
      return null;
    }
  }

  if (highlightItems.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {highlightItems.map((highlight: HighlightItem | string, index) => (
          <div 
            key={index} 
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start">
              {typeof highlight !== 'string' && highlight.icon && (
                <div className="mr-3 text-indigo-600 dark:text-indigo-400">
                  <span className="text-xl">{highlight.icon}</span>
                </div>
              )}
              <div>
                {typeof highlight === 'string' ? (
                  <p className="text-gray-900 dark:text-white">{highlight}</p>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {highlight.title}
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {highlight.description}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyFeatures;