'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyType: 'residential'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        propertyType: 'residential'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 pt-20">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">Get In Touch</h1>
          {/* <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Ready to find your dream property? Our expert team is here to help you navigate 
            the real estate market in Delhi NCR with <span className="text-yellow-500">personalized recommendations</span> and <span className="text-blue-600">local insights</span>.
          </p> */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1  gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Company Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <BuildingOfficeIcon className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Realty Canvas</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                An online real estate marketplace based in India, specializing in finding you a more 
                neighbourly place by assisting you in finding a home you&apos;ll love. We provide personalized 
                recommendations and insights sourced directly from locals across Delhi NCR.
              </p>
              
              {/* Contact Details */}
              <div className="space-y-4 flex gap-10 items-start">
                <div className="flex items-start space-x-4">
                  <MapPinIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Office Address</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      1st Floor, Landmark Cyber Park<br />
                      Sector 67, Gurugram - 122102<br />
                      Haryana, India
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <PhoneIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                    <a href="tel:+919810490965" className="text-blue-600 hover:text-blue-800 transition-colors">
                      +91 9910007801
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <EnvelopeIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                    <a href="mailto:sales@realtycanvas.in" className="text-blue-600 hover:text-blue-800 transition-colors">
                      sales@realtycanvas.in
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <ClockIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Business Hours</h3>
                    <div className="text-gray-600 dark:text-gray-300">
                      <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p>Saturday: 10:00 AM - 6:00 PM</p>
                      <p>Sunday: 11:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Social Media Links */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <Link
                    href="https://www.facebook.com/realtycanvasofficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-primary p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 group"
                  >
                    <FaFacebookF className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-white" />
                  </Link>
                  <Link
                    href="https://www.instagram.com/realtycanvas.official/?igsh=NnQ3Nmx2YzBhbDU4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-primary p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 group"
                  >
                    <FaInstagram className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-white" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/realtycanvas/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-primary p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 group"
                  >
                    <FaLinkedinIn className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-white" />
                  </Link>
                  <Link
                    href="https://www.youtube.com/@Realty_Canvas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-primary p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 group"
                  >
                    <FaYoutube className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-white" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Our Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Residential Properties</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Commercial Properties</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Investment Consulting</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Channel Partners</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          {/* <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Send us a Message</h2>
            </div>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-800 dark:text-green-200">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200">Sorry, there was an error sending your message. Please try again.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Property Interest
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="investment">Investment</option>
                    <option value="consultation">Consultation</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="How can we help you?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
                  placeholder="Tell us about your property requirements, budget, preferred location, or any questions you have..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div> */}
        </div>

        {/* Google Maps Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-br from-blue-50 to-yellow-50 dark:from-blue-900/20 dark:to-yellow-900/20 rounded-2xl p-8 shadow-xl border border-blue-200 dark:border-yellow-800">
            <div className="flex items-center mb-6">
              <MapPinIcon className="w-8 h-8 text-yellow-500 mr-3" />
              <h2 className="text-2xl font-bold text-blue-700 dark:text-yellow-400">Find Us</h2>
            </div>
            <p className="text-blue-700 dark:text-yellow-300 mb-6">
              Visit our office in Gurugram for personalized consultation and property viewing assistance.
            </p>
            
            {/* Google Maps Embed */}
            <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.8234567890123!2d77.06789!3d28.4567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLandmark%20Cyber%20Park%2C%20Sector%2067%2C%20Gurugram!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Realty Canvas Office Location"
              ></iframe>
              
              {/* Location Pin Icon - Fixed Position */}
              <div className="absolute top-[45%] left-[50%] z-10 pointer-events-none">
                {/* <div className="relative">
                  <MapPinIcon className="w-12 h-12 text-yellow-500 filter drop-shadow-lg" />
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                </div> */}
              </div>
            </div>
            
            {/* Directions */}
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="https://maps.google.com/?q=Landmark+Cyber+Park+Sector+67+Gurugram"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <MapPinIcon className="w-4 h-4 mr-2" />
                Get Directions
              </a>
              <a
                href="tel:+91 9910007801"
                className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <PhoneIcon className="w-4 h-4 mr-2" />
                Call Now
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        {/* <div className="mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What areas do you cover?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  We specialize in Delhi NCR region including Gurugram, Noida, Faridabad, Ghaziabad, and New Delhi.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Do you charge consultation fees?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Initial consultation is free. We discuss our service charges transparently based on your requirements.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How quickly can you arrange property visits?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  We can typically arrange property visits within 24-48 hours of your request, subject to availability.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Do you assist with legal documentation?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Yes, we have partnerships with legal experts to assist with property documentation and registration.
                </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}