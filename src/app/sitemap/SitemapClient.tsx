'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  NewspaperIcon, 
  InformationCircleIcon, 
  PhoneIcon,
  MapIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SitemapClientProps {
  projects: Array<{ slug: string; title: string; updatedAt: Date }>;
  blogPosts: Array<{ slug: { current: string }; title: string }>;
}

const staticPages = [
  { href: '/', label: 'Home', icon: HomeIcon, description: 'Return to the homepage' },
  { href: '/projects', label: 'Projects', icon: BuildingOfficeIcon, description: 'Explore our latest properties' },
  { href: '/blog', label: 'Blog', icon: NewspaperIcon, description: 'Read real estate insights' },
  { href: '/about', label: 'About Us', icon: InformationCircleIcon, description: 'Learn about our company' },
  { href: '/contact', label: 'Contact Us', icon: PhoneIcon, description: 'Get in touch with us' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function SitemapClient({ projects, blogPosts }: SitemapClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopyUrl = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedUrl(path);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  };

  const query = searchQuery.toLowerCase().trim();

  const filteredStaticPages = staticPages.filter(page => 
    !query ||
    page.label.toLowerCase().includes(query) || 
    page.description.toLowerCase().includes(query)
  );

  const filteredProjects = projects.filter(project => 
    !query ||
    project.title.toLowerCase().includes(query)
  );

  const filteredBlogPosts = blogPosts.filter(post => 
    !query ||
    post.title.toLowerCase().includes(query)
  );

  return (
    <div className="bg-gray-50 min-h-screen py-16 mt-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center p-3 bg-brand-primary/10 rounded-full mb-4">
              <MapIcon className="w-8 h-8 text-brand-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Site Overview
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Navigate through our entire website with ease. Find properties, articles, and company information all in one place.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary sm:text-sm shadow-sm transition-all duration-200"
                placeholder="Search pages, projects, or articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {/* Main Pages Section */}
          <AnimatePresence mode='popLayout'>
            {filteredStaticPages.length > 0 && (
              <motion.section layout>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-brand-primary rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">Main Navigation</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {filteredStaticPages.map((page) => (
                    <motion.div 
                      key={page.href} 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="group relative block bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-1 h-full">
                        <Link href={page.href} className="absolute inset-0 z-10" />
                        <div className="flex flex-col items-center text-center h-full relative z-20 pointer-events-none">
                          <div className="w-12 h-12 bg-brand-primary/5 text-brand-primary rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                            <page.icon className="w-6 h-6" />
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-brand-primary transition-colors">{page.label}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2">{page.description}</p>
                        </div>
                        <button
                          onClick={(e) => handleCopyUrl(e, page.href)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-50 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-brand-primary hover:text-white transition-all duration-200 z-30 pointer-events-auto"
                          title="Copy URL"
                        >
                          {copiedUrl === page.href ? (
                            <CheckIcon className="w-4 h-4 text-green-500" />
                          ) : (
                            <LinkIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Projects Section */}
            {(searchQuery === '' || filteredProjects.length > 0) && (
              <motion.section 
                layout
                variants={item} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]"
              >
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <BuildingOfficeIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Properties & Projects</h2>
                  </div>
                  <span className="text-xs font-medium bg-white px-3 py-1 rounded-full border border-gray-200 text-gray-500">
                    {filteredProjects.length} Items
                  </span>
                </div>
                <div className="p-2 flex-1 overflow-hidden">
                  {filteredProjects.length > 0 ? (
                    <ul className="h-full overflow-y-auto custom-scrollbar p-2 space-y-2">
                      <AnimatePresence mode='popLayout'>
                        {filteredProjects.map((project, index) => (
                          <motion.li 
                            key={project.slug}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100 relative">
                              <Link 
                                href={`/projects/${project.slug}`} 
                                className="absolute inset-0 z-10"
                              />
                              <span className="text-gray-600 font-medium group-hover:text-brand-primary transition-colors line-clamp-1 pr-8">
                                {project.title}
                              </span>
                              <div className="flex items-center z-20 relative">
                                <button
                                  onClick={(e) => handleCopyUrl(e, `/projects/${project.slug}`)}
                                  className="p-1.5 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-brand-primary hover:text-white transition-all duration-200 mr-2"
                                  title="Copy URL"
                                >
                                  {copiedUrl === `/projects/${project.slug}` ? (
                                    <CheckIcon className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <LinkIcon className="w-4 h-4" />
                                  )}
                                </button>
                                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  View →
                                </span>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                      <BuildingOfficeIcon className="w-12 h-12 mb-2 opacity-50" />
                      <p>No projects found matching "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* Blog Posts Section */}
            {(searchQuery === '' || filteredBlogPosts.length > 0) && (
              <motion.section 
                layout
                variants={item} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]"
              >
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <NewspaperIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Insights & Articles</h2>
                  </div>
                  <span className="text-xs font-medium bg-white px-3 py-1 rounded-full border border-gray-200 text-gray-500">
                    {filteredBlogPosts.length} Items
                  </span>
                </div>
                <div className="p-2 flex-1 overflow-hidden">
                  {filteredBlogPosts.length > 0 ? (
                    <ul className="h-full overflow-y-auto custom-scrollbar p-2 space-y-2">
                      <AnimatePresence mode='popLayout'>
                        {filteredBlogPosts.map((post, index) => (
                          <motion.li 
                            key={post.slug.current}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100 relative">
                              <Link 
                                href={`/blog/${post.slug.current}`} 
                                className="absolute inset-0 z-10"
                              />
                              <span className="text-gray-600 font-medium group-hover:text-brand-primary transition-colors line-clamp-1 pr-8">
                                {post.title}
                              </span>
                              <div className="flex items-center z-20 relative">
                                <button
                                  onClick={(e) => handleCopyUrl(e, `/blog/${post.slug.current}`)}
                                  className="p-1.5 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-brand-primary hover:text-white transition-all duration-200 mr-2"
                                  title="Copy URL"
                                >
                                  {copiedUrl === `/blog/${post.slug.current}` ? (
                                    <CheckIcon className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <LinkIcon className="w-4 h-4" />
                                  )}
                                </button>
                                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  Read →
                                </span>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                      <NewspaperIcon className="w-12 h-12 mb-2 opacity-50" />
                      <p>No articles found matching "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </motion.section>
            )}
          </div>

          {searchQuery && filteredStaticPages.length === 0 && filteredProjects.length === 0 && filteredBlogPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No results found for "{searchQuery}". Try a different search term.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
