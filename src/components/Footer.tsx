import Link from 'next/link'
import SmartImage from '@/components/ui/SmartImage'
import React from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  return (
    <section>
      {/* Footer */}
      <footer className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white py-16 relative overflow-hidden z-20">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-brand-primary/10 to-brand-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-brand-primary/5 to-brand-primary/5 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-6 no-underline hover:no-underline focus:no-underline">
                <SmartImage src="/logo-white.webp" alt="Reality Canvas" width={1200} height={100} className="w-56 h-22" />
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-xs lg:ml-8">
                Your trusted partner in finding the perfect property that
                matches your lifestyle and investment goals. Experience the
                future of real estate.
              </p>
              <div className="flex space-x-4 lg:ml-8">
                <Link
                  href="https://www.facebook.com/realtycanvasofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-primary p-3 rounded-2xl transition-all duration-300 transform hover:scale-110"
                >
                  <FaFacebookF className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.instagram.com/realtycanvas.official/?igsh=NnQ3Nmx2YzBhbDU4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-primary p-3 rounded-2xl transition-all duration-300 transform hover:scale-110"
                >
                  <FaInstagram className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/realtycanvas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-primary p-3 rounded-2xl transition-all duration-300 transform hover:scale-110"
                >
                  <FaLinkedinIn className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.youtube.com/@Realty_Canvas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-primary p-3 rounded-2xl transition-all duration-300 transform hover:scale-110"
                >
                  <FaYoutube className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 block"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 block"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 block"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 block"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sitemap"
                    className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 block"
                  >
                    Sitemap
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 block"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className=" pt-8 ">
              <div className="grid grid-cols-1 -mt-8 gap-6">
                <h4 className="text-xl font-bold  text-white">Contact Us</h4>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-brand-primary to-brand-primary p-2 rounded-xl">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-300">Realty Canvas 1st Floor, Landmark Cyber Park, Sector 67, Gurugram (122102)</p>

                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-brand-primary to-brand-primary p-2 rounded-xl">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-300">+91 9555562626</p>
                    {/* <p className="text-gray-300">+91 11 2345 6789</p> */}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-brand-primary to-brand-primary p-2 rounded-xl">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>

                    <p className="text-gray-300">sales@realtycanvas.in</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            {/* <div>
               <h4 className="text-xl font-bold mb-6 text-white">Services</h4>
               <ul className="space-y-3">
                 <li>
                   <Link
                     href="/coming-soon"
                     className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 block"
                   >
                     Residential
                   </Link>
                 </li>
                 <li>
                   <Link
                     href="/coming-soon"
                     className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 block"
                   >
                     Commercial
                   </Link>
                 </li>
                 <li>
                   <Link
                     href="/coming-soon"
                     className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 block"
                   >
                     Property Management
                   </Link>
                 </li>
                 <li>
                   <Link
                     href="/coming-soon"
                     className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 block"
                   >
                     Investment Advisory
                   </Link>
                 </li>
                 <li>
                   <Link
                     href="/properties/new"
                     className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 block"
                   >
                     List Property
                   </Link>
                 </li>
               </ul>
             </div> */}
          </div>



          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
              <p>
                &copy; {new Date().getFullYear()} Realty Canvas. All rights
                reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link
                href="/privacy-policy"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookie-policy"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}

export default Footer