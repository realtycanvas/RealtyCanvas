'use client';

import { MessageCircle, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { VEDIC } from './data';
import { useVedic } from './vedic-provider';

const whatsappHref = `https://wa.me/${VEDIC.whatsappNumber}?text=${encodeURIComponent(VEDIC.whatsappText)}`;

export default function VedicStickyActions() {
  const { openEnquiry } = useVedic();

  return (
    <>
      {/* Mobile action bar */}
      <nav
        aria-label="Quick contact actions"
        className="fixed inset-x-0 bottom-0 z-[90] grid grid-cols-3 border-t border-white/10 bg-brand-secondary sm:hidden"
      >
        <button
          type="button"
          onClick={() => openEnquiry({ label: 'Enquire Now' })}
          className="flex cursor-pointer flex-col items-center gap-1 py-3 text-[11px] font-medium text-white"
        >
          <MessageCircle className="h-4 w-4 text-brand-primary" aria-hidden="true" />
          Enquire Now
        </button>
        <a
          href={`tel:${VEDIC.phoneHref}`}
          className="flex flex-col items-center gap-1 border-x border-white/10 py-3 text-[11px] font-medium text-white"
        >
          <Phone className="h-4 w-4 text-brand-primary" aria-hidden="true" />
          Tap To Call
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-3 text-[11px] font-medium text-white"
        >
          <FaWhatsapp className="h-4 w-4 text-brand-primary" aria-hidden="true" />
          WhatsApp
        </a>
      </nav>

      {/* Floating WhatsApp button (desktop) */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-[90] hidden h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 sm:flex"
      >
        <FaWhatsapp className="h-6 w-6" aria-hidden="true" />
      </a>
    </>
  );
}
