'use client';

import { useMemo, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

type FAQ = { question: string; answer: string };

export default function FAQSection({ faqs }: { faqs?: FAQ[] }) {
  const defaultFaqs: FAQ[] = useMemo(() => ([
    {
      question: 'Who is Realty Canvas?',
      answer:
        'Realty Canvas is a Gurgaon-based real estate advisory focused on verified residential and commercial projects. We provide transparent pricing, RERA-compliant guidance, and end-to-end support from discovery to possession.',
    },
    {
      question: 'What services does Realty Canvas offer?',
      answer:
        'We offer project discovery, price verification, site visits, deal negotiation, documentation assistance, loan facilitation, and post-purchase support including registration and possession.',
    },
    {
      question: 'Why should I choose Realty Canvas?',
      answer:
        'We benchmark prices across builders, ensure paperwork is clean, and prioritize your ROI. Our team works directly with developer sales desks and uses verified information only.',
    },
    {
      question: 'Does Realty Canvas charge any consultation fees?',
      answer:
        'Consultation is free for buyers. We are compensated by the developer channel without affecting your final price. You always receive transparent, all-inclusive quotes.',
    },
    {
      question: 'Can Realty Canvas help me with home loans?',
      answer:
        'Yes. We coordinate with trusted lending partners to secure pre-approvals and process documentation. We aim for quick turnarounds with competitive interest rates.',
    },
    {
      question: 'Where does Realty Canvas operate?',
      answer:
        'We primarily operate in Gurgaon and NCR across premium residential and Grade-A commercial corridors including Golf Course Extension Road, Dwarka Expressway, and New Gurgaon.',
    },
  ]), []);

  const items = faqs && faqs.length > 0 ? faqs : defaultFaqs;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <section className="lg:py-20 py-6 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Frequently  <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">Asked Questions</span>
          </h2>
        </div>
        <div className="space-y-4">
          {items.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => toggle(i)}
              >
                <span className="text-base md:text-lg font-medium text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                {openIndex === i ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 pt-0">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}