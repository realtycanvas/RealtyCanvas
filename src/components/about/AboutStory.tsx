"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function AboutStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const instagramPosts: string[] = [
    "https://www.instagram.com/p/C_kQ1vyBPZM/",
    "https://www.instagram.com/p/C_sU8iZhvgC/",
    "https://www.instagram.com/p/C_9-goHh3D7/",
    "https://www.instagram.com/p/DA2gHp8h-LP/",
    "https://www.instagram.com/p/DEeuq9ShLPr/",
    "https://www.instagram.com/p/DErSmlahLco/",
    "https://www.instagram.com/p/DEzNCp3hoyo/",
    "https://www.instagram.com/p/DFKJDCPBMZn/",
    "https://www.instagram.com/p/DGDJIm3vPaP/",
    "https://www.instagram.com/p/DG2erazh1-e/",
    "https://www.instagram.com/p/DHqL52yhYlz/",
    "https://www.instagram.com/p/DJZDgsPBaHM/",
    "https://www.instagram.com/p/DJZDgsPBaHM/",
    "https://www.instagram.com/p/DMpUESuS1JN/",
  ];

  const toEmbedUrl = (url: string) => {
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/").filter(Boolean);
      const pIndex = parts.indexOf("p");
      const shortcode = pIndex !== -1 && parts[pIndex + 1] ? parts[pIndex + 1] : parts[1] || parts[0];
      return `https://www.instagram.com/p/${shortcode}/embed`;
    } catch {
      return url;
    }
  };

  const scrollBy = (delta: number) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section ref={ref} className="py-24 lg:pt-32 bg-white dark:bg-gray-900">
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white uppercase">
                Building Dreams Since 2017
              </h2>
            </div>

            <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                Realty Canvas began with a clear purpose: to bridge the gap between what clients need and what traditional real estate offers. We're not just here to list properties—we're here to help you find a home that feels like home.
              </p>
              <p>
                What started as a commitment to integrity and transparency has grown into a comprehensive real estate solution serving Gurgaon We specialize in residential and commercial property acquisition and investment, guided by three core principles: Fidelity, Integrity, and Solidity.
              </p>
              <p>
                Today, we continue to uncover the finest opportunities for our clients, helping them make sensible and prudent decisions with complete confidence. Every recommendation we make is rooted in accurate information, local expertise, and a genuine commitment to your goals.
              </p>
            </div>

            {/* Timeline */}

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
                alt="Realty Canvas Building"
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
        <div className="mt-12">
          <div className="space-y-4">
            <div className="flex items-center justify-between md:mb-10 mb-2">
              <h3 className="md:text-4xl text-2xl capitalize font-bold text-gray-900 dark:text-white">Key Milestones</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => scrollBy(-600)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() => scrollBy(600)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div ref={carouselRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 no-scrollbar">
              {instagramPosts.map((url, idx) => (
                <div
                  key={`${idx}-${url}`}
                  className="min-w-[320px] sm:min-w-[340px] lg:min-w-[393px] snap-start bg-white  rounded-xl shadow-md overflow-hidden border border-gray-100"
                >
                  <iframe
                    src={toEmbedUrl(url)}
                    title="Instagram post"
                    className="w-full h-[490px] sm:h-[420px] md:h-[520px] lg:h-[620px]"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                  />
                  <div className="px-4 py-3 flex justify-between items-center">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                    >
                      View on Instagram
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
