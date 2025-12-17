'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon, CodeBracketIcon, EyeIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQ {
  question: string;
  answer: string;
}

interface PropertyFAQEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function PropertyFAQEditor({
  value,
  onChange,
  label = "Frequently Asked Questions",
  placeholder = "Add common questions and answers about the property"
}: PropertyFAQEditorProps) {
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>(() => {
    try {
      return value ? JSON.parse(value) : [];
    } catch {
      return [];
    }
  });

  const updateFAQs = (newFAQs: FAQ[]) => {
    setFaqs(newFAQs);
    onChange(JSON.stringify(newFAQs));
  };

  const addFAQ = () => {
    const newFAQs = [...faqs, { question: '', answer: '' }];
    updateFAQs(newFAQs);
    setExpandedFAQ(newFAQs.length - 1); // Expand the newly added FAQ
  };

  const removeFAQ = (index: number) => {
    const newFAQs = faqs.filter((_, i) => i !== index);
    updateFAQs(newFAQs);
    if (expandedFAQ === index) {
      setExpandedFAQ(null);
    } else if (expandedFAQ !== null && expandedFAQ > index) {
      setExpandedFAQ(expandedFAQ - 1);
    }
  };

  const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
    const newFAQs = faqs.map((faq, i) =>
      i === index ? { ...faq, [field]: value } : faq
    );
    updateFAQs(newFAQs);
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const commonQuestions = [

    "How can I contact you for more information about this property?",
  ];

  const addCommonQuestion = (question: string) => {
    let answer = '';

    // Provide default answer for contact question
    if (question === "How can I contact you for more information about this property?") {
      answer = "For purchasing this property or to get more information, please contact us:\n\n📞 Phone: +91 9555562626\n📧 Email: sales@realtycanvas.in\n\nOur team is available to assist you with all your queries and help you with the property purchase process. We look forward to hearing from you!";
    }

    const newFAQs = [...faqs, { question, answer }];
    updateFAQs(newFAQs);
    setExpandedFAQ(newFAQs.length - 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {placeholder}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsJsonMode(!isJsonMode)}
            className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${isJsonMode
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'bg-primary-100 dark:bg-secondary-900 text-brand-primary dark:text-brand-primary'
              }`}
          >
            {isJsonMode ? (
              <>
                <EyeIcon className="w-4 h-4 mr-1" />
                Visual Editor
              </>
            ) : (
              <>
                <CodeBracketIcon className="w-4 h-4 mr-1" />
                JSON Mode
              </>
            )}
          </button>
        </div>
      </div>

      {isJsonMode ? (
        <div className="space-y-4">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={15}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white font-mono text-sm"
            placeholder={`[
  {
    "question": "What are the maintenance charges?",
    "answer": "The monthly maintenance charges are $150 which includes common area maintenance, security, and basic utilities."
  },
  {
    "question": "Is parking included?",
    "answer": "Yes, one covered parking space is included with each unit. Additional parking can be purchased separately."
  }
]`}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter FAQs in JSON format. Each FAQ should have a question and answer.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick Add Common Questions */}
          {faqs.length === 0 && (
            <div className="bg-primary-50 dark:bg-secondary-900/20 p-4 rounded-lg border border-primary-200 dark:border-secondary-800">
              <h4 className="text-sm font-medium text-brand-secondary dark:text-white mb-3">
                Quick Add Common Questions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {commonQuestions.map((question, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addCommonQuestion(question)}
                    className="text-left text-sm text-brand-secondary dark:text-gray-300 hover:text-brand-secondary dark:hover:text-white hover:bg-primary-100 dark:hover:bg-secondary-800/50 p-2 rounded transition-colors"
                  >
                    + {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                {/* FAQ Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleFAQ(index)}
                      className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-secondary-900 text-brand-primary dark:text-brand-primary"
                    >
                      {expandedFAQ === index ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </button>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      FAQ {index + 1}: {faq.question || 'New Question'}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFAQ(index)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* FAQ Content (Expanded) */}
                {expandedFAQ === index && (
                  <div className="px-4 pb-4 space-y-4">
                    {/* Question */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Question
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                        placeholder="Enter the question..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    {/* Answer */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Answer
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                        placeholder="Enter the detailed answer..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add FAQ Button */}
          <button
            type="button"
            onClick={addFAQ}
            className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-brand-primary hover:text-brand-primary dark:hover:border-brand-primary dark:hover:text-brand-primary transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add FAQ
          </button>
        </div>
      )}

      {faqs.length > 0 && !isJsonMode && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
            Preview ({faqs.length} FAQs)
          </h4>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="text-sm">
                <div className="font-medium text-yellow-900 dark:text-yellow-100">
                  Q{index + 1}: {faq.question || 'Untitled Question'}
                </div>
                {faq.answer && (
                  <div className="text-yellow-700 dark:text-yellow-300 ml-4">
                    A: {faq.answer.substring(0, 100)}
                    {faq.answer.length > 100 ? '...' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}