import { MapPin, Phone } from 'lucide-react';
import VedicLeadForm from './vedic-lead-form';
import { VEDIC } from './data';

export default function VedicContact() {
  return (
    <section id="contact-us" className="scroll-mt-20 bg-gray-50 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-2xl bg-brand-secondary shadow-xl lg:grid-cols-2">
          <div className="p-8 text-white sm:p-10">
            <h2 className="text-2xl font-bold sm:text-3xl">Get in Touch</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Ready to book your villa plot or schedule a site visit? Our team is here to help you explore {VEDIC.name}{' '}
              in North Goa.
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/20">
                  <Phone className="h-4 w-4 text-brand-primary" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.15em] text-white/50">Phone</span>
                  <a
                    href={`tel:${VEDIC.phoneHref}`}
                    className="text-sm font-semibold transition-colors hover:text-brand-primary"
                  >
                    {VEDIC.phoneDisplay}
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/20">
                  <MapPin className="h-4 w-4 text-brand-primary" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.15em] text-white/50">Location</span>
                  <span className="text-sm font-semibold">North Goa</span>
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 sm:p-10">
            <h3 className="mb-5 text-lg font-bold text-brand-secondary">Contact Form</h3>
            <VedicLeadForm formId="contact" />
          </div>
        </div>
      </div>
    </section>
  );
}
