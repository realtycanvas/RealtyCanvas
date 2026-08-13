'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { VEDIC } from './data';

type Props = {
  submitLabel?: string;
  // Identifies which form on the page produced the lead, appended to sourcePath.
  formId: string;
  onSuccess?: () => void;
  // "glass" is the hero treatment: the card itself is translucent over the banner
  // video from md up, so labels/consent flip to light-on-dark at that breakpoint.
  variant?: 'light' | 'glass';
};

const EMPTY = { name: '', email: '', phone: '' };

export default function VedicLeadForm({ submitLabel = 'Submit Now', formId, onSuccess, variant = 'light' }: Props) {
  const [values, setValues] = useState(EMPTY);
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const set = (field: keyof typeof EMPTY, value: string) => setValues((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const next: { email?: string; phone?: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Enter a valid email address';
    if (!/^\d{10}$/.test(values.phone)) next.phone = 'Enter a 10-digit mobile number';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!consent) {
      toast.error('Please accept the consent to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          timeline: 'Not specified',
          propertyType: VEDIC.lead.propertyType,
          city: VEDIC.lead.city,
          state: VEDIC.lead.state,
          projectSlug: VEDIC.lead.projectSlug,
          projectTitle: VEDIC.lead.projectTitle,
          sourcePath: `${VEDIC.lead.sourcePath}#${formId}`,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Thank you! Our team will contact you shortly.');
        setValues(EMPTY);
        setErrors({});
        onSuccess?.();
      } else {
        toast.error(result.error || result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('[vedic-city-goa] lead submit failed', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isGlass = variant === 'glass';

  // Hero inputs follow the reference banner card: 46px tall, 16px gutter, and a
  // near-opaque white fill so they stay readable on top of the translucent card.
  const inputClass = isGlass
    ? 'w-full h-[46px] rounded-md border border-black/15 bg-white md:bg-white/94 px-4 text-sm text-gray-900 placeholder:text-black/45 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30'
    : 'w-full h-11 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30';

  const errorClass = isGlass ? 'mt-1 text-xs text-red-600 md:text-red-300' : 'mt-1 text-xs text-red-600';

  const buttonClass = isGlass
    ? 'h-[46px] w-full cursor-pointer rounded-md border-2 border-brand-primary bg-linear-[135deg,var(--brand-secondary)_0%,#1b3040_100%] text-sm font-semibold tracking-wide text-white transition-all hover:bg-linear-[135deg,#08131b_0%,var(--brand-secondary)_100%] disabled:cursor-not-allowed disabled:opacity-70'
    : 'h-11 w-full cursor-pointer rounded-md bg-brand-primary text-sm font-semibold tracking-wide text-brand-secondary transition-colors hover:bg-brand-primary/85 disabled:cursor-not-allowed disabled:opacity-70';

  const consentClass = isGlass
    ? 'flex cursor-pointer items-start gap-2 text-[9px] leading-[1.45] text-black/65 md:text-white/90'
    : 'flex cursor-pointer items-start gap-2 text-[11px] leading-snug text-gray-500';

  return (
    <form onSubmit={handleSubmit} className={isGlass ? 'space-y-3.5' : 'space-y-3'} noValidate>
      <div>
        <label htmlFor={`${formId}-name`} className="sr-only">
          Your Name
        </label>
        <input
          id={`${formId}-name`}
          type="text"
          name="name"
          placeholder="Your Name *"
          value={values.name}
          onChange={(e) => set('name', e.target.value.replace(/[^A-Za-z\s]/g, ''))}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={`${formId}-email`} className="sr-only">
          Your Email
        </label>
        <input
          id={`${formId}-email`}
          type="email"
          name="email"
          placeholder="Your Email *"
          value={values.email}
          onChange={(e) => set('email', e.target.value)}
          required
          aria-invalid={Boolean(errors.email)}
          className={inputClass}
        />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor={`${formId}-phone`} className="sr-only">
          Mobile Number
        </label>
        <div className="flex">
          <span
            className={
              isGlass
                ? 'inline-flex h-[46px] items-center rounded-l-md border border-r-0 border-black/15 bg-gray-100 px-3 text-sm text-gray-700 md:bg-white/94'
                : 'inline-flex h-11 items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-600'
            }
          >
            +91
          </span>
          <input
            id={`${formId}-phone`}
            type="tel"
            name="phone"
            inputMode="numeric"
            placeholder="Mobile Number *"
            maxLength={10}
            value={values.phone}
            onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            required
            aria-invalid={Boolean(errors.phone)}
            className={`${inputClass} rounded-l-none`}
          />
        </div>
        {errors.phone && <p className={errorClass}>{errors.phone}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className={buttonClass}>
        {isSubmitting ? 'Sending enquiry...' : submitLabel}
      </button>

      <label className={consentClass}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[var(--brand-primary)]"
        />
        <span>
          I authorize Realty Canvas representatives to call, SMS, email or WhatsApp me about its products and offers.
        </span>
      </label>
    </form>
  );
}
