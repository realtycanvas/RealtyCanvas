'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import LeadCaptureForm from '../LeadCaptureForm';

export default function EnquirySection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:gap-32 gap-10 items-center justify-center">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1A3D] dark:text-white mb-6">
              Ready to Start <span className="text-[#FDB022]">Your Journey?</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Whether you're looking to buy, sell, or invest, our team of experts is here to guide you every step of the way. Fill out the form, and we'll get back to you shortly.
            </p>
            
            <div className="space-y-6">
              <a 
                href="https://wa.me/919555562626"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#16A34A] hover:bg-[#20bd5a] p-6 rounded-xl shadow-md border border-transparent flex items-start gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                  <FaWhatsapp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                    Direct Contact
                  </h3>
                  <p className="text-white/90 mt-1 font-medium">+91 9555562626</p>
                  <p className="text-white/80 text-sm">sales@realtycanvas.in</p>
                </div>
              </a>
              
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Landmark+Cyber+Park+Sector+67+Gurugram"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#112D48] hover:bg-[#0b1e33] p-6 rounded-xl shadow-md border border-transparent flex items-start gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Visit Our Office</h3>
                  <p className="text-white/90 mt-1 text-sm leading-relaxed">
                    1st Floor, Landmark Cyber Park<br />
                    Sector 67, Gurugram - 122102<br />
                    Haryana, India
                  </p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2 bg-white  p-8 rounded-2xl shadow-xl border border-gray-100 "
          >
            <LeadCaptureForm showCancelButton={false} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
