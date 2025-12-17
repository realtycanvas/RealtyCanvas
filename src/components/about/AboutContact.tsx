import React from "react";

export default function AboutContact() {
  return (
    <section className="py-24 lg:py-32 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-4">We’re here to help you every step of the way.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Phone */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-primary text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a2 2 0 011.94 1.515l.58 2.32a2 2 0 01-.91 2.263l-1.27.848a11.042 11.042 0 005.516 5.516l.848-1.27a2 2 0 012.263-.91l2.32.58A2 2 0 0121 17.72V21a2 2 0 01-2 2h-1a16 16 0 01-15-15V5z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">+91 9555562626</div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-primary text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">sales@realtycanvas.in</div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-primary text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8c0 7.5-7.5 12-7.5 12S4.5 15.5 4.5 8a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Address</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  1st Floor, Landmark Cyber Park, Sector 67, Gurugram (122102)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}