'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FormData {
  name: string;
  phone: string;
  email: string;
  timeline: string;
  propertyType: 'COMMERCIAL' | 'RESIDENTIAL' | '';
  city: string;
  state: string;
}

interface LeadCaptureFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

export default function LeadCaptureForm({ onSuccess, onCancel, showCancelButton = true }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    timeline: '',
    propertyType: '',
    city: '',
    state: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Thank you! We will contact you soon.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          timeline: '',
          propertyType: '',
          city: '',
          state: '',
        });
        if (onSuccess) onSuccess();
      } else {
        alert(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Property Type Radios */}
      <fieldset className="space-y-1.5">
        <legend className="block text-xs font-medium text-gray-700">Property Type *</legend>
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 text-xs text-gray-700">
            <input
              type="radio"
              name="propertyType"
              value="COMMERCIAL"
              checked={formData.propertyType === 'COMMERCIAL'}
              onChange={() => handleInputChange('propertyType', 'COMMERCIAL')}
              required
              className="accent-blue-600"
            />
            <span>🏢 Commercial</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-gray-700">
            <input
              type="radio"
              name="propertyType"
              value="RESIDENTIAL"
              checked={formData.propertyType === 'RESIDENTIAL'}
              onChange={() => handleInputChange('propertyType', 'RESIDENTIAL')}
              required
              className="accent-blue-600"
            />
            <span>🏠 Residential</span>
          </label>
        </div>
      </fieldset>

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
        {showCancelButton && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 h-8 text-sm"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-8 text-sm bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
}
