'use client';

import { motion } from 'framer-motion';

export default function BlogHero() {
  return (
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
              <span className="text-brand-primary font-medium text-sm">Realty Canvas Blogs</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Real Estate Insights & News
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Stay ahead of the market with expert analysis, investment strategies, and the latest trends in real
              estate.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
