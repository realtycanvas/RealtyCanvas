'use client';

import { useState } from 'react';
import { 
  HomeIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  DocumentTextIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

// Dynamically import LexicalEditor to avoid SSR issues
const LexicalEditor = dynamic(
  () => import('@/components/LexicalEditor'),
  { 
    ssr: false,
    loading: () => <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse" />
  }
);

interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  currency: string;
  address: string;
  location: string;
  beds: number;
  baths: number;
  area: number;
  bannerTitle: string;
  aboutTitle: string;
  // Commercial project fields
  landArea?: string;
  numberOfFloors?: number;
  category?: string;
}

interface PropertyBasicInfoEditorProps {
  formData: PropertyFormData;
  onFormDataChange: (data: PropertyFormData) => void;
}

export default function PropertyBasicInfoEditor({ formData, onFormDataChange }: PropertyBasicInfoEditorProps) {
  const [copiedJson, setCopiedJson] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newValue = (name === 'price' || name === 'beds' || name === 'baths' || name === 'area' || name === 'numberOfFloors') 
      ? parseInt(value) || 0 
      : value;
    
    onFormDataChange({
      ...formData,
      [name]: newValue
    });
  };

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: '🏢' },
    { value: 'house', label: 'House', icon: '🏠' },
    { value: 'villa', label: 'Villa', icon: '🏡' },
    { value: 'townhouse', label: 'Townhouse', icon: '🏘️' },
    { value: 'condo', label: 'Condominium', icon: '🏬' },
    { value: 'studio', label: 'Studio', icon: '🏙️' },
    { value: 'penthouse', label: 'Penthouse', icon: '🌆' },
    { value: 'duplex', label: 'Duplex', icon: '🏘️' }
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' }
  ];

  const projectCategories = [
    { value: 'COMMERCIAL', label: 'Commercial', icon: '🏢' },
    { value: 'RESIDENTIAL', label: 'Residential', icon: '🏠' },
    { value: 'MIXED_USE', label: 'Mixed Use', icon: '🏬' },
    { value: 'RETAIL_ONLY', label: 'Retail Only', icon: '🛍️' }
  ];

  const testPropertyData = {
    title: "Luxury Modern Apartment in Downtown",
    description: `<h2>Welcome to Luxury Living</h2>
    <p>This stunning modern apartment offers the perfect blend of <strong>luxury</strong> and <em>convenience</em> in the heart of downtown.</p>
    
    <h3>Key Features:</h3>
    <ul>
      <li>Floor-to-ceiling windows with panoramic city views</li>
      <li>High-end stainless steel appliances</li>
      <li>Hardwood floors throughout</li>
      <li>In-unit washer and dryer</li>
      <li>24/7 concierge service</li>
    </ul>
    
    <h3>Building Amenities:</h3>
    <ul>
      <li>Rooftop terrace with BBQ area</li>
      <li>Fitness center and yoga studio</li>
      <li>Swimming pool and spa</li>
      <li>Business center and meeting rooms</li>
    </ul>

    <h3>Floor Plan Specifications:</h3>
    <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background-color: #f9fafb;">
          <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Room</th>
          <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Size (sq ft)</th>
          <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Features</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #d1d5db; padding: 12px;">Master Bedroom</td>
          <td style="border: 1px solid #d1d5db; padding: 12px;">180</td>
          <td style="border: 1px solid #d1d5db; padding: 12px;">Walk-in closet, en-suite bathroom</td>
        </tr>
        <tr>
          <td style="border: 1px solid #d1d5db; padding: 12px;">Living Room</td>
          <td style="border: 1px solid #d1d5db; padding: 12px;">320</td>
          <td style="border: 1px solid #d1d5db; padding: 12px;">Open concept, floor-to-ceiling windows</td>
        </tr>
        <tr>
          <td style="border: 1px solid #d1d5db; padding: 12px;">Kitchen</td>
          <td style="border: 1px solid #d1d5db; padding: 12px;">150</td>
          <td style="border: 1px solid #d1d5db; padding: 12px;">Island, premium appliances</td>
        </tr>
      </tbody>
    </table>

    <blockquote>
      <p><em>"This property represents the pinnacle of modern urban living with uncompromising attention to detail and luxury finishes."</em></p>
    </blockquote>
    
    <p>Perfect for <strong>professionals</strong> and <strong>investors</strong> seeking premium urban living.</p>`,
    price: 850000,
    currency: "USD",
    address: "123 Downtown Plaza, Metropolitan District",
    location: "Downtown Metro City",
    beds: 2,
    baths: 2,
    area: 1200,
    bannerTitle: "Premium Downtown Living Experience",
    aboutTitle: "Discover Urban Luxury",
    highlights: JSON.stringify([
      {
        "icon": "🏙️",
        "title": "Prime Location",
        "description": "Heart of downtown with easy access to business district"
      },
      {
        "icon": "🌟",
        "title": "Luxury Finishes",
        "description": "High-end materials and premium appliances throughout"
      },
      {
        "icon": "🏊‍♂️",
        "title": "Resort Amenities",
        "description": "Pool, fitness center, rooftop terrace, and concierge"
      },
      {
        "icon": "🚊",
        "title": "Transportation Hub",
        "description": "Walking distance to metro, bus lines, and major highways"
      }
    ]),
    floorPlans: JSON.stringify([
      {
        "name": "Type A - Two Bedroom Premium",
        "size": "1,200 sq.ft.",
        "bedrooms": 2,
        "bathrooms": 2,
        "price": "$850,000",
        "imageUrl": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
        "description": "Spacious layout with master suite and open living area"
      }
    ]),
    facilities: JSON.stringify([
      { "icon": "🏊‍♂️", "title": "Swimming Pool" },
      { "icon": "🏋️‍♂️", "title": "Fitness Center" },
      { "icon": "🅿️", "title": "Parking Garage" },
      { "icon": "🔒", "title": "24/7 Security" },
      { "icon": "🌿", "title": "Rooftop Garden" },
      { "icon": "📶", "title": "High-Speed WiFi" }
    ]),
    builderName: "Premium Development Group",
    builderLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200",
    builderDescription: "Award-winning luxury real estate developer with 25+ years of experience in creating premium residential properties.",
    sitePlanTitle: "Downtown Plaza Master Plan",
    sitePlanDescription: "Comprehensive urban development featuring residential towers, retail spaces, and green areas.",
    sitePlanImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
    faqs: JSON.stringify([
      {
        "question": "What are the monthly maintenance fees?",
        "answer": "Monthly maintenance fees are $450 which includes building management, concierge service, amenities access, and basic utilities."
      },
      {
        "question": "Is parking included?",
        "answer": "Yes, one designated parking space is included. Additional spaces can be purchased for $50,000 each."
      },
      {
        "question": "When is the move-in date?",
        "answer": "The property is ready for immediate occupancy. Move-in can be scheduled within 30 days of closing."
      },
      {
        "question": "Are pets allowed?",
        "answer": "Yes, pets are welcome. There's a one-time pet deposit of $500 and monthly pet fee of $50 per pet."
      }
    ])
  };

  const copyTestData = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(testPropertyData, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const loadTestData = () => {
    onFormDataChange({
      ...formData,
      ...testPropertyData
    });
  };

  const getCurrentSymbol = () => {
    const currency = currencies.find(c => c.code === formData.currency);
    return currency?.symbol || '$';
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <HomeIcon className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
              Basic Property Information
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Enter the essential details about your property to get started
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={copyTestData}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                copiedJson
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {copiedJson ? (
                <>
                  <CheckIcon className="w-4 h-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="w-4 h-4 mr-1" />
                  Copy Test JSON
                </>
              )}
            </button>
            <button
              type="button"
              onClick={loadTestData}
              className="flex items-center px-3 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
            >
              <BeakerIcon className="w-4 h-4 mr-1" />
              Load Test Data
            </button>
          </div>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Property Title */}
        <div className="col-span-2">
          <label htmlFor="title" className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <DocumentTextIcon className="w-4 h-4 mr-2 text-gray-500" />
            Property Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Luxury Modern Apartment in Downtown"
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white text-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.title?.length || 0}/100 characters
          </p>
        </div>

        {/* Property Description */}
        <div className="col-span-2">
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <DocumentTextIcon className="w-4 h-4 mr-2 text-gray-500" />
            Property Description *
          </label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
            <LexicalEditor
              initialValue={formData.description}
              onChange={(value) => onFormDataChange({ ...formData, description: value })}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use the rich text editor to format your description with headings, lists, and emphasis
          </p>
        </div>

        {/* Price Section */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center">
            <CurrencyDollarIcon className="w-5 h-5 mr-2" />
            Pricing Information
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg font-semibold">{getCurrentSymbol()}</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  placeholder="850000"
                  required
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white text-lg font-semibold"
                />
              </div>
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} ({currency.symbol}) - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.price > 0 && (
            <div className="mt-3 p-3 bg-green-100 dark:bg-green-800/30 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Formatted Price:</strong> {getCurrentSymbol()}{formData.price?.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
            <MapPinIcon className="w-5 h-5 mr-2" />
            Location Details
          </h4>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Downtown Plaza, Metropolitan District"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Area/Neighborhood *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Downtown Metro City"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Property Specifications */}
        <div className="col-span-2">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
              <HomeIcon className="w-5 h-5 mr-2" />
              Property Specifications
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="beds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bedrooms
                </label>
                <select
                  id="beds"
                  name="beds"
                  value={formData.beds || 0}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num === 0 ? 'Studio' : `${num} ${num === 1 ? 'Bedroom' : 'Bedrooms'}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="baths" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bathrooms
                </label>
                <select
                  id="baths"
                  name="baths"
                  value={formData.baths || 1}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                >
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Bathroom' : 'Bathrooms'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area || ''}
                  onChange={handleChange}
                  placeholder="1200"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {(formData.beds > 0 || formData.baths > 0 || formData.area > 0) && (
              <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-800/30 rounded-lg">
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  <strong>Property Summary:</strong> {' '}
                  {formData.beds === 0 ? 'Studio' : `${formData.beds} bed`}
                  {formData.beds > 1 ? 's' : ''} • {formData.baths} bath{formData.baths > 1 ? 's' : ''} • {formData.area > 0 ? `${formData.area.toLocaleString()} sq ft` : 'Area TBD'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Commercial Project Details */}
        <div className="col-span-2">
          <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
            <h4 className="font-semibold text-teal-900 dark:text-teal-100 mb-4 flex items-center">
              <HomeIcon className="w-5 h-5 mr-2" />
              🏢 Commercial Project Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="landArea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Land Area
                </label>
                <input
                  type="text"
                  id="landArea"
                  name="landArea"
                  value={formData.landArea || ''}
                  onChange={handleChange}
                  placeholder="e.g., 2.5 Acres, 10,000 sq ft"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="numberOfFloors" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No. of Floors
                </label>
                <input
                  type="number"
                  id="numberOfFloors"
                  name="numberOfFloors"
                  value={formData.numberOfFloors || ''}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category || 'COMMERCIAL'}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-800 dark:text-white"
                >
                  {projectCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(formData.landArea || formData.numberOfFloors || formData.category) && (
              <div className="mt-4 p-3 bg-teal-100 dark:bg-teal-800/30 rounded-lg">
                <p className="text-sm text-teal-800 dark:text-teal-200">
                  <strong>Commercial Project Summary:</strong> {' '}
                  {formData.landArea && `${formData.landArea} land area`}
                  {formData.landArea && formData.numberOfFloors && ' • '}
                  {formData.numberOfFloors && `${formData.numberOfFloors} floors`}
                  {(formData.landArea || formData.numberOfFloors) && formData.category && ' • '}
                  {formData.category && `${projectCategories.find(c => c.value === formData.category)?.label || formData.category} project`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Page Titles */}
        <div className="col-span-2">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-4">
              Page Display Titles (Optional)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bannerTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Banner Title
                </label>
                <input
                  type="text"
                  id="bannerTitle"
                  name="bannerTitle"
                  value={formData.bannerTitle}
                  onChange={handleChange}
                  placeholder="Premium Downtown Living Experience"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white"
                />
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Displayed prominently on the property page banner
                </p>
              </div>

              <div>
                <label htmlFor="aboutTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  About Section Title
                </label>
                <input
                  type="text"
                  id="aboutTitle"
                  name="aboutTitle"
                  value={formData.aboutTitle}
                  onChange={handleChange}
                  placeholder="Discover Urban Luxury"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white"
                />
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Title for the property description section
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Form Completion</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {Math.round(((formData.title?.length > 0 ? 1 : 0) + 
                        (formData.description?.length > 0 ? 1 : 0) + 
                        (formData.price > 0 ? 1 : 0) + 
                        (formData.address?.length > 0 ? 1 : 0) + 
                        (formData.location?.length > 0 ? 1 : 0)) / 5 * 100)}%
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.round(((formData.title?.length > 0 ? 1 : 0) + 
                                   (formData.description?.length > 0 ? 1 : 0) + 
                                   (formData.price > 0 ? 1 : 0) + 
                                   (formData.address?.length > 0 ? 1 : 0) + 
                                   (formData.location?.length > 0 ? 1 : 0)) / 5 * 100)}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
}