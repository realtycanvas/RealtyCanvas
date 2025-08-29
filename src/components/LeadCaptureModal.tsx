'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface FormData {
  name: string;
  phone: string;
  email: string;
  timeline: string;
  propertyType: 'COMMERCIAL' | 'RESIDENTIAL';
  city: string;
  state: string;
}

export default function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    timeline: '',
    propertyType: 'COMMERCIAL',
    city: '',
    state: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if modal has been shown before
    const hasShownModal = localStorage.getItem('leadCaptureModalShown');
    
    if (!hasShownModal) {
      // Show modal after 20 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('leadCaptureModalShown', 'true');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit form data to API
      const response = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Show success message
        alert(result.message || 'Thank you! We will contact you soon.');
        
        // Close modal after successful submission
        setIsOpen(false);
        
        // Reset form
         setFormData({
           name: '',
           phone: '',
           email: '',
           timeline: '',
           propertyType: 'COMMERCIAL',
           city: '',
           state: '',
         });
      } else {
        // Show error message
        alert(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Find Your Dream Property
            </h2>
            <p className="text-gray-600 mt-0.5 text-xs">
              Get personalized recommendations
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mt-3">
          {/* Property Type Tabs */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">Property Type *</label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                 type="button"
                 onClick={() => handleInputChange('propertyType', 'COMMERCIAL')}
                 className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                   formData.propertyType === 'COMMERCIAL'
                     ? 'bg-white text-blue-600 shadow-sm'
                     : 'text-gray-600 hover:text-gray-800'
                 }`}
               >
                 🏢 Commercial
               </button>
               <button
                 type="button"
                 onClick={() => handleInputChange('propertyType', 'RESIDENTIAL')}
                 className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                   formData.propertyType === 'RESIDENTIAL'
                     ? 'bg-white text-blue-600 shadow-sm'
                     : 'text-gray-600 hover:text-gray-800'
                 }`}
               >
                 🏠 Residential
               </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-medium text-gray-700">Name *</label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="w-full h-8 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-xs font-medium text-gray-700">Phone Number *</label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              className="w-full h-8 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-medium text-gray-700">Email ID *</label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="w-full h-8 text-sm"
            />
          </div>

          {/* City and State Fields */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label htmlFor="city" className="block text-xs font-medium text-gray-700">City *</label>
              <Input
                id="city"
                type="text"
                placeholder="Enter city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
                className="w-full h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="state" className="block text-xs font-medium text-gray-700">State *</label>
              <select
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                required
                className="w-full h-8 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select state</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Delhi">Delhi</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Puducherry">Puducherry</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="timeline" className="block text-xs font-medium text-gray-700">Purchase Timeline *</label>
            <select
              id="timeline"
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              required
              className="w-full h-8 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select your timeline</option>
              <option value="1-month">1 Month</option>
              <option value="3-months">3 Months</option>
              <option value="6-months">6 Months</option>
              <option value="more-than-6-months">More than 6 Months</option>
            </select>
          </div>

          <div className="flex gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-8 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-8 text-sm bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          We respect your privacy. Your information will be used only to provide you with property recommendations.
        </p>
      </div>
    </div>
  );
}