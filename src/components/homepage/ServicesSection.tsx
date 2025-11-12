'use client';

import {
  HomeIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';

export default function ServicesSection() {
  const services = [
    {
      icon: <HomeIcon className="w-8 h-8 text-white" />,
      title: "Understand Your Goals",
      description: "Residential home or commercial investment? Budget analysis and requirement mapping"
    },
    {
      icon: <ClipboardDocumentListIcon className="w-8 h-8 text-white" />,
      title: "Curated Recommendations",
      description: "Handpicked properties matching your criteria from our exclusive inventory"
    },
    {
      icon: <MagnifyingGlassIcon className="w-8 h-8 text-white" />,
      title: "Site Visits & Analysis",
      description: "Guided property tours with complete market analysis and ROI projections"
    },
    {
      icon: <DocumentTextIcon className="w-8 h-8 text-white" />,
      title: "Seamless Documentation",
      description: "End-to-end legal support, RERA verification, and booking assistance"
    },
    {
      icon: <HandRaisedIcon className="w-8 h-8 text-white" />,
      title: "Possession & Beyond",
      description: "Handover support and rental assistance"
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-brand-primary/10 to-brand-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-4   relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How We Make 
            <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
              {" "}
              Property Purchase Simple
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience unparalleled service with our comprehensive suite of
            real estate solutions
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 w-full  lg:w-48"
            >
              <div className="bg-gradient-to-r from-brand-primary to-brand-primary p-2 rounded-2xl w-10 h-10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-md font-bold text-gray-900 dark:text-white mb-2 text-center">
                {service.title}
              </h3>
              <p className="text-gray-600 text-xs text-center leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}