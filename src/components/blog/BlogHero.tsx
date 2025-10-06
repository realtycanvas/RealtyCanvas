"use client"

import { motion } from "framer-motion"

export default function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary-500 via-secondary-600 to-secondary-700 dark:from-secondary-800 dark:via-secondary-900 dark:to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23feb711' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-brand-primary/20 to-brand-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-r from-brand-primary/15 to-brand-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 rounded-full blur-2xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Real Estate{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-yellow-400">
                Insights
              </span>{" "}
              & News
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Stay ahead of the market with expert analysis, investment strategies, 
              and the latest trends in real estate
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            {[
              "Market Analysis",
              "Investment Tips", 
              "Industry News",
              "Property Trends",
              "Expert Insights"
            ].map((tag, index) => (
              <span
                key={tag}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}