'use client';
import JsonLd from '@/components/SEO/JsonLd';

import { useState } from 'react';
import Link from 'next/link';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { BrandButton } from '@/components/ui/BrandButton';

export default function ContactPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyType: 'residential'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        propertyType: 'residential'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "url": `${baseUrl}/contact`,
        "name": "Contact Realty Canvas",
        "isPartOf": { "@type": "WebSite", "url": baseUrl }
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "Realty Canvas",
        "url": baseUrl,
        "telephone": "+91 9555562626",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1st Floor, Landmark Cyber Park, Sector 67",
          "addressLocality": "Gurugram",
          "postalCode": "122102",
          "addressRegion": "Haryana",
          "addressCountry": "IN"
        },
        "openingHoursSpecification": [
          { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "09:00", "closes": "19:00" },
          { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday"], "opens": "10:00", "closes": "18:00" },
          { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Sunday"], "opens": "11:00", "closes": "18:00" }
        ]
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
          { "@type": "ListItem", "position": 2, "name": "Contact", "item": `${baseUrl}/contact` }
        ]
      }} />
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-secondary via-brand-secondary/95 to-brand-secondary/90 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-6">
            <span className="text-brand-primary font-medium text-sm">Contact Realty Canvas</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Let’s Connect</h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto">We help homebuyers, business owners, and investors discover properties they’ll truly love—backed by local insights and personalized recommendations.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1  gap-8">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Company Info */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center mb-6">
                <BuildingOfficeIcon className="w-8 h-8 text-brand-primary mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Realty Canvas</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                An online real estate marketplace based in India, specializing in finding you a more
                neighbourly place by assisting you in finding a home you&apos;ll love. We provide personalized
                recommendations and insights sourced directly from locals across Gurgaon
              </p>

              {/* Contact Details */}
              <div className="space-y-4 md:space-y-0 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="flex items-center space-x-4">
                  <EnvelopeIcon className="w-6 h-6 text-brand-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                    <a href="mailto:sales@realtycanvas.in" className="text-brand-primary hover:brightness-110 transition-colors">
                      sales@realtycanvas.in
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <PhoneIcon className="w-6 h-6 text-brand-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                    <a href="tel:+919555562626" className="text-brand-primary hover:brightness-110 transition-colors">
                      +91 9555562626
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <ClockIcon className="w-6 h-6 text-brand-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Business Hours</h3>
                    <div className="text-gray-600 dark:text-gray-300">
                      <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p>Saturday: 10:00 AM - 6:00 PM</p>
                      <p>Sunday: 11:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPinIcon className="w-6 h-6 text-brand-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Office Address</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      1st Floor, Landmark Cyber Park<br />
                      Sector 67, Gurugram - 122102<br />
                      Haryana, India
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Services */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Our Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-brand-primary/10 rounded-lg">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Residential Properties</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-brand-primary/10 rounded-lg">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Commercial Properties</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-brand-primary/10 rounded-lg">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Investment Consulting</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-brand-primary/10 rounded-lg">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Channel Partners</span>
                </div>
              </div>
            </div>
          </div>


        </div>

        <div className="mt-16">
          <div className="bg-gradient-to-br from-brand-secondary/5 to-brand-secondary/10 dark:from-brand-secondary/20 dark:to-brand-secondary/30 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <MapPinIcon className="w-8 h-8 text-brand-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Find Us</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Visit our office in Gurugram for personalized consultation and property viewing assistance.
            </p>

            {/* Google Maps Embed */}
            <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.8234567890123!2d77.06789!3d28.4567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLandmark%20Cyber%20Park%2C%20Sector%2067%2C%20Gurugram!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Realty Canvas Office Location"
              ></iframe>

              <div className="absolute top-[45%] left-[50%] z-10 pointer-events-none"></div>
            </div>

            {/* Directions */}
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="https://maps.google.com/?q=Landmark+Cyber+Park+Sector+67+Gurugram"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-[#112D48] hover:bg-[#091a30] text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <MapPinIcon className="w-4 h-4 mr-2" />
                Get Directions
              </a>
              <a
                href="tel:+91 9555562626"
                className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <PhoneIcon className="w-4 h-4 mr-2" />
                Call Now
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        {/* <div className="mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What areas do you cover?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  We specialize in Gurgaon region including Gurugram, Noida, Faridabad, Ghaziabad, and New Delhi.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Do you charge consultation fees?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Initial consultation is free. We discuss our service charges transparently based on your requirements.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How quickly can you arrange property visits?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  We can typically arrange property visits within 24-48 hours of your request, subject to availability.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Do you assist with legal documentation?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Yes, we have partnerships with legal experts to assist with property documentation and registration.
                </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}