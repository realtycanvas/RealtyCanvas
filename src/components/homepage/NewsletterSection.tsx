'use client';

import { useState } from 'react';
import { BrandButton } from '../ui/BrandButton';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
         setSubscribed(true);
         setEmail('');
         console.log('Newsletter subscription successful');
         
         // Reset success message after 3 seconds
         setTimeout(() => setSubscribed(false), 3000);
       } else {
        const errorData = await response.json();
        console.error('Newsletter subscription failed:', errorData.error);
        alert('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert('Failed to subscribe. Please check your connection and try again.');
    } finally {
       setSubscribing(false);
     }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-brand-primary via-brand-primary to-brand-primary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className=" text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Stay Updated with Latest Properties
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Get notified about new properties, market insights, and exclusive deals
            delivered straight to your inbox
          </p>

          <form onSubmit={handleSubscribe} className="">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-2xl text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300"
              />
              <button
                type="submit"
                disabled={subscribing || subscribed}
                className="bg-white dark:bg-gray-800 text-brand-secondary dark:text-brand-primary font-bold py-4 px-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/25 min-w-[220px] no-underline hover:no-underline focus:no-underline"
              >
                {subscribing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subscribing...
                  </span>
                ) : subscribed ? (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Subscribed!
                  </span>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </div>
            <p className="text-sm text-white/70 mt-4">
              * We respect your privacy. Unsubscribe at any time.
            </p>
          </form>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-white/80">Newsletter Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">Weekly</div>
              <div className="text-white/80">Property Updates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">Exclusive</div>
              <div className="text-white/80">Deals & Offers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}