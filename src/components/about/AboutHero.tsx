"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="relative mt-24   overflow-hidden bg-gradient-to-br from-brand-secondary via-brand-secondary/95 to-brand-secondary/90 py-24 lg:py-32">

      

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
              <span className="text-brand-primary font-medium text-sm">About Realty Canvas</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Paint Your Own Paradise
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Realty Canvas is your trusted real estate marketplace in Gurgaon, helping homebuyers, business owners, and investors discover properties they'll truly love—backed by local insights, personalized recommendations, and transparent guidance every step of the way.
            </p>


          </motion.div>
        </div>
      </div>
    </section>
  );
}