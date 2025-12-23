'use client';

import Image from 'next/image';
import {
  HandRaisedIcon,
  ChartBarIcon,
  CheckCircleIcon,
  BoltIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import SmartImage from '../ui/SmartImage';

export default function BenefitsSection() {
  return (
    <section className="lg:py-20 py-4 px-6 md:px-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-24 gap-4 items-center justify-center">
          {/* Left side - Benefits */}
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Why RealtyCanvas Stands Apart: 
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
               Benefits of <br/>
                <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
                  {" "}
                  Choosing Us
                </span>
              </h2>
              
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
              
                  <CheckCircleIcon className="w-6 h-6 text-yellow-500" />
              
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Verified Properties
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs">
                    All our properties are thoroughly verified with proper documentation and legal clearance.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
              
                  <BoltIcon className="w-6 h-6 text-yellow-500" />
             
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Quick Process
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs">
                    Our streamlined process ensures quick property registration and documentation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                
                  <CurrencyDollarIcon className="w-6 h-6 text-yellow-500" />
              
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Best Prices
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs">
                    Get the best market prices with transparent pricing and no hidden charges.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
              
                  <HandRaisedIcon className="w-6 h-6 text-yellow-500" />
             
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                   Post-Purchase Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs">
                   Ongoing assistance with possession, documentation, and resale planning.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">

                   <ChartBarIcon className="w-6 h-6 text-yellow-500" />
             
                 <div>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Maximum ROI Focus
                   </h3>
                   <p className="text-gray-600 dark:text-gray-300 text-xs">
                    Strategic location selection for highest appreciation potential.
                   </p>
                 </div>
               </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="flex items-end border-2 lg:w-[380px] w-full lg:h-[600px] h-full border-gray-500 overflow-hidden rounded-tl-[200px] rounded-br-[200px]">
            <div className="relative  overflow-hidden ">
              <SmartImage
                src="/bannernew.webp"
                alt="Real Estate Benefits"
                width={1200}
                height={100}
                className="object-cover w-full h-full"
                // priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}