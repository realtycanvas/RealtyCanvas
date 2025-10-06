"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function AboutStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20">
                <span className="text-brand-primary font-medium text-sm">Our Story</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Building Dreams Since 2014
              </h2>
            </div>

            <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                RealityCanvas was founded with a simple yet powerful vision: to revolutionize the real estate industry by putting people first. What started as a small team of passionate real estate professionals has grown into a trusted name in property development and sales.
              </p>
              <p>
                Our journey began when we recognized the gap between traditional real estate practices and what modern clients truly needed. We set out to create a company that would not just sell properties, but build lasting relationships and create communities where people thrive.
              </p>
              <p>
                Today, we continue to innovate and push boundaries, leveraging cutting-edge technology and maintaining our commitment to exceptional service. Every project we undertake is a testament to our dedication to quality, transparency, and client satisfaction.
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Key Milestones</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-brand-primary rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">2014 - Company Founded</div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm">Started with a vision to transform real estate</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-brand-primary rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">2018 - First Major Project</div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm">Completed our landmark residential complex</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-brand-primary rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">2022 - Digital Innovation</div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm">Launched our digital platform for seamless property experience</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-brand-primary rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">2024 - Expansion</div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm">Expanded operations to multiple cities</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="/building.png"
                alt="RealityCanvas Building"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/20 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-xs">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Excellence</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">In every project</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}