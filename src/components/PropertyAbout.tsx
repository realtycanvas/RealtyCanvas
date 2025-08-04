import React from 'react';
import { hasHtmlTags, preserveRichText } from '@/utils/strip-html';

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
  
  // Debug logging (remove in production)
  // console.log('PropertyAbout - description:', description);
  // console.log('PropertyAbout - description type:', typeof description);
  
  const isHtml = hasHtmlTags(description);
  // console.log('PropertyAbout - isHtml:', isHtml);
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{mainTitle}</h2>
      {title && <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">{title}</h3>}
      
      {isHtml ? (
        <div 
          className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400 leading-relaxed dark:prose-invert
            prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-p:text-gray-600 dark:prose-p:text-gray-400
            prose-ul:text-gray-600 dark:prose-ul:text-gray-400
            prose-ol:text-gray-600 dark:prose-ol:text-gray-400
            prose-li:text-gray-600 dark:prose-li:text-gray-400
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-em:text-gray-700 dark:prose-em:text-gray-300
            prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
            prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:border-indigo-300 dark:prose-blockquote:border-indigo-600
            prose-code:text-gray-900 dark:prose-code:text-white prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-50 dark:prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700
            prose-table:border-collapse prose-table:border prose-table:border-gray-300 dark:prose-table:border-gray-600
            prose-thead:bg-gray-50 dark:prose-thead:bg-gray-800
            prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900 dark:prose-th:text-white
            prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600 prose-td:px-4 prose-td:py-2 prose-td:text-gray-600 dark:prose-td:text-gray-400
            prose-hr:border-gray-300 dark:prose-hr:border-gray-600"
          dangerouslySetInnerHTML={{ 
            __html: (() => {
              try {
                return preserveRichText(description);
              } catch (error) {
                console.error('Error processing HTML description:', error);
                return description; // Fallback to original description
              }
            })()
          }}
        />
      ) : (
        <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
          {description}
        </div>
      )}
    </div>
  );
};

export default PropertyAbout;