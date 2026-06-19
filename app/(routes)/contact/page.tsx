'use client';

import { useState } from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { motion } from 'framer-motion';
import JsonLd from '@/components/common/JsonLd';
import Breadcrumb from '@/components/ui/breadcrumb';

export default function ContactPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyType: 'residential',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          propertyType: formData.propertyType || 'residential',
          city: 'Gurugram',
          state: 'Haryana',
          timeline: 'Flexible',
          sourcePath: '/contact',
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        propertyType: 'residential',
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
      <Breadcrumb items={[{ label: 'Contact' }]} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          url: `${baseUrl}/contact`,
          name: 'Contact Realty Canvas',
          isPartOf: { '@type': 'WebSite', url: baseUrl },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          name: 'Realty Canvas',
          url: baseUrl,
          telephone: '+91 9555562626',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '1st Floor, Landmark Cyber Park, Sector 67',
            addressLocality: 'Gurugram',
            postalCode: '122102',
            addressRegion: 'Haryana',
            addressCountry: 'IN',
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '19:00',
            },
            { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '10:00', closes: '18:00' },
            { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '11:00', closes: '18:00' },
          ],
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
            { '@type': 'ListItem', position: 2, name: 'Contact', item: `${baseUrl}/contact` },
          ],
        }}
      />

      <section className="relative overflow-hidden bg-linear-to-br from-brand-secondary via-brand-secondary/95 to-brand-secondary/90 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23feb711' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-linear-to-r from-brand-primary/20 to-brand-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-linear-to-r from-brand-primary/15 to-brand-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-linear-to-r from-brand-primary/10 to-brand-primary/5 rounded-full blur-2xl"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20">
                <span className="text-brand-primary font-medium text-sm">Contact Realty Canvas</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">Let’s Connect</h1>

              {/* Description */}
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                We help homebuyers, business owners, and investors discover properties they’ll truly love backed by
                local insights and personalized recommendations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1  gap-8">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Company Info */}
            <div className="bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded p-8 shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center mb-6">
                <BuildingOfficeIcon className="w-8 h-8 text-brand-primary mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Realty Canvas</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                An online real estate marketplace based in India, specializing in finding you a more neighbourly place
                by assisting you in finding a home you&apos;ll love. We provide personalized recommendations and
                insights sourced directly from locals across Gurgaon
              </p>

              {/* Contact Details */}
              <div className="space-y-4 md:space-y-0 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="flex items-start space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                    <Link
                      href="mailto:sales@realtycanvas.in"
                      className="text-gray-600 dark:text-gray-300 hover:brightness-110 transition-colors"
                    >
                      sales@realtycanvas.in
                    </Link>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <PhoneIcon className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                    <Link
                      href="tel:+919555562626"
                      className="text-gray-600 dark:text-gray-300 hover:brightness-110 transition-colors"
                    >
                      +91 9555562626
                    </Link>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <ClockIcon className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Business Hours</h3>
                    <div className="text-gray-600 dark:text-gray-300">
                      <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p>Saturday: 10:00 AM - 6:00 PM</p>
                      <p>Sunday: 11:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="w-6 h-6 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Office Address</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      1st Floor, Landmark Cyber Park
                      <br />
                      Sector 67, Gurugram - 122102
                      <br />
                      Haryana, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white dark:bg-gray-800 rounded p-8 shadow border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-brand-primary/10 rounded">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Residential Properties</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-brand-primary/10 rounded">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Commercial Properties</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-brand-primary/10 rounded">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Investment Consulting</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-brand-primary/10 rounded">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Channel Partners</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="bg-linear-to-br from-brand-secondary/5 to-brand-secondary/10 dark:from-brand-secondary/20 dark:to-brand-secondary/30 rounded p-8 shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <MapPinIcon className="w-8 h-8 text-brand-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Find Us</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Visit our office in Gurugram for personalized consultation and property viewing assistance.
            </p>

            {/* Google Maps Embed */}
            <div className="relative w-full h-96 rounded overflow-hidden shadow-lg">
              <iframe
                src="https://maps.google.com/maps?q=Landmark+Cyber+Park,+Sector+67,+Gurugram,+Haryana+122102&output=embed"
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
              <Link
                href="https://maps.google.com/?q=Landmark+Cyber+Park+Sector+67+Gurugram"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-[#112D48] hover:bg-[#091a30] text-white rounded transition-colors shadow-md hover:shadow-lg"
              >
                <MapPinIcon className="w-4 h-4 mr-2" />
                Get Directions
              </Link>
              <Link
                href="tel:+91 9555562626"
                className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors shadow-md hover:shadow-lg"
              >
                <PhoneIcon className="w-4 h-4 mr-2" />
                Call Now
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        {/* <div className="mt-16">
          <div className="bg-white dark:bg-gray-800 rounded p-8 shadow">
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
