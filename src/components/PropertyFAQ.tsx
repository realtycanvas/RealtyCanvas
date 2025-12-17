"use client"
import React, { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface PropertyFAQProps {
  faqs: FAQ[] | string | null;
  title?: string;
}

const PropertyFAQ: React.FC<PropertyFAQProps> = ({
  faqs,
  title = 'Frequently Asked Questions'
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs) return null;

  // Ensure faqs is an array before mapping
  let faqsArray: FAQ[] = [];

  if (typeof faqs === 'string') {
    try {
      const parsedFaqs = JSON.parse(faqs);
      if (Array.isArray(parsedFaqs)) {
        faqsArray = parsedFaqs;
      } else if (parsedFaqs && typeof parsedFaqs === 'object' && Array.isArray(parsedFaqs.faqs)) {
        // Handle case where faqs might be nested in an object
        faqsArray = parsedFaqs.faqs;
      }
    } catch (error) {
      console.error('Error parsing FAQs:', error);
      return null;
    }
  } else if (Array.isArray(faqs)) {
    faqsArray = faqs;
  }

  // Add default contact FAQ
  const defaultContactFAQ = {
    question: "How can I contact you for more information about this property?",
    answer: "For purchasing this property or to get more information, please contact us:\n\n📞 Phone: +91 9555562626\n📧 Email: sales@realtycanvas.in\n\nOur team is available to assist you with all your queries and help you with the property purchase process. We look forward to hearing from you!"
  };

  // Always include the contact FAQ at the end
  const allFAQs = [...faqsArray, defaultContactFAQ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>

      <div className="space-y-4">
        {allFAQs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full p-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</h3>
              <span className="ml-6 flex-shrink-0">
                <svg
                  className={`w-6 h-6 transform ${openIndex === index ? 'rotate-180' : ''} text-gray-500 dark:text-gray-400`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {openIndex === index && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {faq.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyFAQ;