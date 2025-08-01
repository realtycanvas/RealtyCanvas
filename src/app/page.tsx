'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PropertyCard from '@/components/PropertyCard';
import { supabase } from '@/lib/supabase';

// Define the Property type based on the Prisma schema
type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  location: string;
  currency: string;
  featuredImage: string;
  galleryImages: string[];
  beds: number;
  baths: number;
  area: number;
  createdAt: Date;
};

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      try {
        console.log('Fetching properties from API...');
        const response = await fetch('/api/properties');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API response:', data);
        
        // Convert createdAt strings to Date objects
        const formattedData = (data || []).map((property: any) => ({
          ...property,
          createdAt: new Date(property.createdAt)
        }));

        setProperties(formattedData);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);
  
  // Reset loading state when navigating back to this page
  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    
    // Simulate API call
    try {
      // In a real app, you would send this data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setContactSuccess(true);
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative text-white py-20">  
        <Image 
          src="https://images.pexels.com/photos/2360673/pexels-photo-2360673.jpeg" 
          alt="Delhi NCR Skyline" 
          fill 
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-bold mb-6">Find Your Dream Property</h1>
            <p className="text-xl mb-8 max-w-2xl">Discover the perfect property that matches your lifestyle and preferences with RealityCanvas.</p>
            <Link 
              href="/properties/new" 
              className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-full hover:bg-indigo-100 transition duration-300"
            >
              Add Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Featured Properties</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Browse our selection of premium properties available for sale and rent.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <>
                {/* Skeleton loading for property cards */}
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 animate-pulse">
                    <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full mb-4"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : properties.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-600 dark:text-gray-300 text-lg">No properties found. Be the first to add one!</p>
                <Link 
                  href="/properties/new" 
                  className="inline-block mt-4 bg-indigo-600 text-white font-medium py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-300"
                >
                  Add Property
                </Link>
              </div>
            ) : (
              properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white dark:bg-gray-800 relative">
        <div className="absolute right-0 top-0 w-1/4 h-full opacity-10">
          <Image 
            src="https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg" 
            alt="India Real Estate" 
            fill 
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Our Services</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">We provide comprehensive real estate services to meet all your property needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Property Listings</h3>
              <p className="text-gray-600 dark:text-gray-300">Browse our extensive collection of properties for sale and rent.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Property Management</h3>
              <p className="text-gray-600 dark:text-gray-300">Professional management services for property owners and investors.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Consultation</h3>
              <p className="text-gray-600 dark:text-gray-300">Expert advice on buying, selling, and investing in real estate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-indigo-600 text-white relative">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="https://images.pexels.com/photos/1105754/pexels-photo-1105754.jpeg" 
            alt="Delhi Architecture" 
            fill 
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of satisfied customers who found their perfect home with us.</p>
          <Link 
            href="/properties/new" 
            className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-full hover:bg-indigo-100 transition duration-300"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Have questions about properties in Delhi NCR? Get in touch with our team.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Send us a message</h3>
                
                {contactSuccess ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Thank you!</strong>
                    <span className="block sm:inline"> We've received your message and will get back to you soon.</span>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Your Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={contactForm.name}
                        onChange={handleContactChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Your Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={contactForm.email}
                        onChange={handleContactChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Your Message</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        rows={4}
                        value={contactForm.message}
                        onChange={handleContactChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                        required
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 flex justify-center items-center"
                      disabled={contactSubmitting}
                    >
                      {contactSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Our Delhi NCR Office</h3>
                  <address className="not-italic text-gray-600 dark:text-gray-300 mb-6">
                    <p>123 Connaught Place</p>
                    <p>New Delhi, 110001</p>
                    <p className="mt-2">Email: delhi@realitycanvas.com</p>
                    <p>Phone: +91 98765 43210</p>
                  </address>
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Office Hours</h4>
                    <ul className="text-gray-600 dark:text-gray-300">
                      <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
                      <li>Saturday: 10:00 AM - 4:00 PM</li>
                      <li>Sunday: Closed</li>
                    </ul>
                  </div>
                </div>
                
                <div className="absolute inset-0 opacity-10">
                  <Image 
                    src="https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg" 
                    alt="Delhi Office" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">RealityCanvas</h3>
              <p className="text-gray-400">Your trusted partner in finding the perfect property that matches your lifestyle and preferences.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                <li><Link href="/properties" className="text-gray-400 hover:text-white transition">Properties</Link></li>
                <li><Link href="/properties/new" className="text-gray-400 hover:text-white transition">Add Property</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Property Listings</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Property Management</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Consultation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <address className="text-gray-400 not-italic">
                <p>123 Real Estate Avenue</p>
                <p>Property City, PC 12345</p>
                <p className="mt-2">Email: info@realitycanvas.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} RealityCanvas. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
