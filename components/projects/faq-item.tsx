'use client';
import { useState } from 'react';

const FaqItem = ({ question, answer }: { question: string; answer: string | null }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <span className={`shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FaqItem;
