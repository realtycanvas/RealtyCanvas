'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { HOME_FAQS, type HomeFaq } from '@/lib/home-faqs';

export default function FAQSection({ faqs }: { faqs?: HomeFaq[] }) {
  const items = faqs && faqs.length > 0 ? faqs : HOME_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <section className="lg:py-20 py-6 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-xl sm:text-4xl md:text-5xl font-bold text-[#0B1A3D] dark:text-white mb-6 leading-tight">
            Frequently{' '}
            <span className="bg-linear-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
              Asked Questions
            </span>
          </h2>
        </div>
        <div className="space-y-4">
          {items.map((faq, i) => (
            <div
              key={i}
              className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="text-base md:text-lg font-medium text-gray-900 dark:text-white">{faq.question}</span>
                {openIndex === i ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500 shrink-0" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500 shrink-0" />
                )}
              </button>
              {/* Answer stays in the server-rendered HTML at all times (collapsed via
                  CSS grid, not removed from the DOM) so search and answer engines can read it. */}
              <div
                id={`faq-answer-${i}`}
                className={`grid transition-all duration-200 ease-in-out ${
                  openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 pt-0 text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
