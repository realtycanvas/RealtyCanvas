'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import LeadCaptureForm from '../LeadCaptureForm';

export default function EnquirySection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-44 items-start justify-between">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 lg:sticky lg:top-24"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1A3D] dark:text-white mb-6">
              Ready to Start <span className="text-[#FDB022]">Your Journey?</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Whether you're looking to buy, sell, or invest, our team of experts is here to guide you every step of the way. Fill out the form, and we'll get back to you shortly.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0B1A3D] dark:text-white text-lg">Direct Contact</h3>
                  <p className="text-gray-600 dark:text-gray-400">+91 9555562626</p>
                  <p className="text-gray-600 dark:text-gray-400">sales@realtycanvas.in</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0B1A3D] dark:text-white text-lg">Visit Our Office</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    11st Floor, Landmark Cyber Park<br />
                    Sector 67, Gurugram - 122102<br />
                    Haryana, India
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800"
          >
            <LeadCaptureForm showCancelButton={false} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
