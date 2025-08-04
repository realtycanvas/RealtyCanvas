'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import PropertyBasicInfoEditor from '@/components/PropertyBasicInfoEditor';
import PropertyHighlightsEditor from '@/components/PropertyHighlightsEditor';
import PropertyFacilitiesEditor from '@/components/PropertyFacilitiesEditor';
import PropertyFloorPlansEditor from '@/components/PropertyFloorPlansEditor';
import PropertyBuilderEditor from '@/components/PropertyBuilderEditor';
import PropertySitePlanEditor from '@/components/PropertySitePlanEditor';
import PropertyFAQEditor from '@/components/PropertyFAQEditor';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import BulkPropertyUpload from '@/components/BulkPropertyUpload';

// Dynamically import LexicalEditor component
const LexicalEditor = dynamic(
  () => import('@/components/LexicalEditor'),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md flex items-center justify-center"><span className="text-gray-500">Loading editor...</span></div>,
  }
);

interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  address: string;
  location: string;
  currency: string;
  beds: number;
  baths: number;
  area: number;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  builderName: string;
  builderLogo: string;
  builderDescription: string;
  sitePlanTitle: string;
  sitePlanDescription: string;
  sitePlanImage: string;
  highlights: string;
  floorPlans: string;
  facilities: string;
  faqs: string;
  relatedProperties: string[];
}

// Define the steps for the multi-step form
const steps = [
  { id: 'basic', name: 'Basic Information', description: 'Property details and location' },
  { id: 'images', name: 'Images', description: 'Upload property images' },
  { id: 'features', name: 'Features', description: 'Highlights and facilities' },
  { id: 'floorplans', name: 'Floor Plans', description: 'Floor plans and pricing' },
  { id: 'builder', name: 'Builder Info', description: 'Builder details and site plan' },
  { id: 'faqs', name: 'FAQs', description: 'Frequently asked questions' },
  { id: 'review', name: 'Review', description: 'Review and submit' },
];

export default function NewPropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);
  const [sitePlanImage, setSitePlanImage] = useState<File | null>(null);
  const [sitePlanImagePreview, setSitePlanImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: 0,
    address: '',
    location: '',
    currency: 'USD',
    beds: 0,
    baths: 0,
    area: 0,
    // Banner section
    bannerTitle: '',
    bannerSubtitle: '',
    bannerDescription: '',
    // About section
    aboutTitle: '',
    aboutDescription: '',
    // Builder information
    builderName: '',
    builderLogo: '',
    builderDescription: '',
    // Site plan
    sitePlanTitle: '',
    sitePlanDescription: '',
    sitePlanImage: '',
    // JSON fields (initialized as empty arrays/objects)
    highlights: JSON.stringify([]),
    floorPlans: JSON.stringify([]),
    facilities: JSON.stringify([]),
    faqs: JSON.stringify([]),
    // Related properties
    relatedProperties: [],
  });

  // Generate image previews when files are selected
  useEffect(() => {
    if (featuredImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(featuredImage);
    } else {
      setFeaturedImagePreview(null);
    }

    if (sitePlanImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSitePlanImagePreview(reader.result as string);
      };
      reader.readAsDataURL(sitePlanImage);
    } else {
      setSitePlanImagePreview(null);
    }

    const previews: string[] = [];
    const readers: FileReader[] = [];

    galleryImages.forEach((file, index) => {
      readers[index] = new FileReader();
      readers[index].onloadend = () => {
        previews[index] = readers[index].result as string;
        if (previews.filter(Boolean).length === galleryImages.length) {
          setGalleryImagePreviews(previews);
        }
      };
      readers[index].readAsDataURL(file);
    });

    if (galleryImages.length === 0) {
      setGalleryImagePreviews([]);
    }
  }, [featuredImage, sitePlanImage, galleryImages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (name === 'price' || name === 'beds' || name === 'baths' || name === 'area') {
      const numValue = value === '' ? 0 : parseFloat(value);
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
      return;
    }
    
    // Special handling for JSON fields
    if (name === 'faqs' || name === 'highlights' || name === 'floorPlans' || name === 'facilities') {
      try {
        // Only validate if the field is not empty
        if (value.trim() !== '') {
          // Try to parse the JSON to validate it
          JSON.parse(value);
        }
        // If parsing succeeds or the field is empty, update the form data
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        } as typeof formData));
        // Clear any previous error for this field
        setJsonErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      } catch (error) {
        // If JSON parsing fails, still update the form data so user can fix it
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        } as typeof formData));
        // Set error message
        setJsonErrors(prev => ({
          ...prev,
          [name]: 'Invalid JSON format. Please check your syntax.'
        }));
        console.error(`Invalid JSON format in ${name}:`, error);
      }
    } else {
      // For non-JSON fields, update normally
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      } as typeof formData));
    }
  };

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFeaturedImage(e.target.files[0]);
    }
  };

  const handleSitePlanImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSitePlanImage(e.target.files[0]);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setGalleryImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const removeFeaturedImage = () => {
    setFeaturedImage(null);
  };

  const removeSitePlanImage = () => {
    setSitePlanImage(null);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if there are any JSON errors before submitting
    const jsonErrorsExist = Object.values(jsonErrors).some(error => error !== '');
    if (jsonErrorsExist) {
      alert('Please fix the JSON format errors before submitting.');
      return;
    }
    
    // Validate JSON fields
    try {
      // Only validate if the fields are not empty
      if (formData.highlights.trim() !== '') {
        JSON.parse(formData.highlights);
      }
      if (formData.floorPlans.trim() !== '') {
        JSON.parse(formData.floorPlans);
      }
      if (formData.facilities.trim() !== '') {
        JSON.parse(formData.facilities);
      }
      if (formData.faqs.trim() !== '') {
        // Make sure the FAQs is a valid JSON array, not an object with a 'faqs' property
        const parsedFaqs = JSON.parse(formData.faqs);
        if (parsedFaqs && typeof parsedFaqs === 'object' && parsedFaqs.faqs && Array.isArray(parsedFaqs.faqs)) {
          // If it's an object with a 'faqs' array property, extract just the array
          formData.faqs = JSON.stringify(parsedFaqs.faqs);
          console.log('Client: Extracted FAQs array from object:', formData.faqs);
        }
      }
    } catch (error) {
      console.error('Error validating JSON fields:', error);
      alert('There is an issue with one of the JSON fields. Please check the format and try again.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Prepare all images for upload (featured image first, site plan, then gallery)
      const allImages = [];
      if (featuredImage) allImages.push(featuredImage);
      if (sitePlanImage) allImages.push(sitePlanImage);
      allImages.push(...galleryImages);
      
      // Upload images to server
      const imageUrls = await Promise.all(
        allImages.map(async (image) => {
          try {
            const formData = new FormData();
            formData.append('file', image);
            
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
            
            if (!response.ok) {
              console.error('Image upload failed:', await response.text());
              return null;
            }
            
            const data = await response.json();
            return data.url;
          } catch (error) {
            console.error('Error uploading image:', error);
            return null;
          }
        })
      );
      
      // Filter out any null values from failed uploads
      const validImageUrls = imageUrls.filter(url => url !== null);

      // Prepare request body
      const requestBody = {
        ...formData,
        price: formData.price,
        beds: formData.beds,
        baths: formData.baths,
        area: formData.area,
        featuredImage: featuredImage && validImageUrls.length > 0 ? validImageUrls[0] : '',
        sitePlanImage: sitePlanImage && validImageUrls.length > (featuredImage ? 1 : 0) ? validImageUrls[featuredImage ? 1 : 0] : '',
        galleryImages: validImageUrls.slice((featuredImage ? 1 : 0) + (sitePlanImage ? 1 : 0)),
      };
      
     // Log the request body for debugging
      console.log('Client: Request body:', requestBody);
      console.log('Client: JSON fields check:', {
        highlights: typeof requestBody.highlights,
        highlights_value: requestBody.highlights,
        floorPlans: typeof requestBody.floorPlans,
        floorPlans_value: requestBody.floorPlans,
        facilities: typeof requestBody.facilities,
        facilities_value: requestBody.facilities,
        faqs: typeof requestBody.faqs,
        faqs_value: requestBody.faqs
      });
      
      // Create property in the database
      const requestBodyString = JSON.stringify(requestBody);
      console.log('Client: Stringified request body:', requestBodyString);
      
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBodyString,
      });
      
      // Log the response status
      console.log('Response status:', response.status);
      
      // If response is not ok, try to get more detailed error
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to create property: ${errorText}`);
      }

      const data = await response.json();
      router.push(`/properties/${data.id}`);
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Failed to create property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the current step content
  const handleBulkDataLoaded = (data: any) => {
    // Update form data with the loaded JSON data
    const newFormData = { ...formData } as Record<string, any>;
    
    // Process each field from the uploaded data
    Object.keys(data).forEach(key => {
      if (key in newFormData) {
        // Handle JSON fields that need to be stringified
        if (['highlights', 'floorPlans', 'facilities', 'faqs'].includes(key)) {
          if (typeof data[key] === 'string') {
            newFormData[key] = data[key];
          } else {
            newFormData[key] = JSON.stringify(data[key]);
          }
        } else {
          // For other fields, directly assign the value
          newFormData[key] = data[key];
        }
      }
    });
    
    setFormData(newFormData as typeof formData);
    
    // Move to the Images step (step 1) after successful upload
    setCurrentStep(1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-6">
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Bulk Property Data Upload</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Upload a JSON file with all property data at once, or fill the form manually below.
              </p>
              
              <BulkPropertyUpload onDataLoaded={handleBulkDataLoaded} />
              
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Don&apos;t have a JSON file? Fill out the form below.
                </p>
              </div>
            </div>
            
            <PropertyBasicInfoEditor
              formData={{
                title: formData.title,
                description: formData.description,
                price: formData.price,
                currency: formData.currency,
                address: formData.address,
                location: formData.location,
                beds: formData.beds,
                baths: formData.baths,
                area: formData.area,
                bannerTitle: formData.bannerTitle,
                aboutTitle: formData.aboutTitle
              }}
              onFormDataChange={(data) => {
                setFormData(prev => ({
                  ...prev,
                  ...data
                }));
              }}
            />
          </div>
        );

      case 1: // Images
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Featured Image</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">This will be the main image displayed for your property.</p>
              
              <div className="mt-4">
                {featuredImagePreview ? (
                  <div className="relative">
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img src={featuredImagePreview} alt="Featured preview" className="object-cover w-full h-full" />
                    </div>
                    <button
                      type="button"
                      onClick={removeFeaturedImage}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-700">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor="featured-image-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input id="featured-image-upload" name="featured-image" type="file" className="sr-only" onChange={handleFeaturedImageChange} accept="image/*" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Gallery Images</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add multiple images to showcase your property.</p>
              
              <div className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img src={preview} alt={`Gallery preview ${index + 1}`} className="object-cover w-full h-full" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  <div className="flex justify-center items-center border-2 border-gray-300 border-dashed rounded-lg p-4 dark:border-gray-700">
                    <label htmlFor="gallery-images-upload" className="cursor-pointer text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Add Images</span>
                      <input id="gallery-images-upload" name="gallery-images" type="file" className="sr-only" onChange={handleGalleryImagesChange} accept="image/*" multiple />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Features
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Property Highlights</h3>
              <PropertyHighlightsEditor
                value={formData.highlights}
                onChange={(value) => setFormData(prev => ({ ...prev, highlights: value }))}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Property Facilities</h3>
              <PropertyFacilitiesEditor
                value={formData.facilities}
                onChange={(value) => setFormData(prev => ({ ...prev, facilities: value }))}
              />
            </div>
          </div>
        );

      case 3: // Floor Plans
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Floor Plans</h3>
              <PropertyFloorPlansEditor
                value={formData.floorPlans}
                onChange={(value) => setFormData(prev => ({ ...prev, floorPlans: value }))}
              />
            </div>
          </div>
        );

      case 4: // Builder Info
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Builder Information</h3>
              <PropertyBuilderEditor
                builderName={formData.builderName}
                builderLogo={formData.builderLogo}
                builderDescription={formData.builderDescription}
                onBuilderNameChange={(value) => setFormData(prev => ({ ...prev, builderName: value }))}
                onBuilderLogoChange={(value) => setFormData(prev => ({ ...prev, builderLogo: value }))}
                onBuilderDescriptionChange={(value) => setFormData(prev => ({ ...prev, builderDescription: value }))}
              />
            </div>

            <PropertySitePlanEditor
              sitePlanTitle={formData.sitePlanTitle}
              sitePlanDescription={formData.sitePlanDescription}
              sitePlanImage={formData.sitePlanImage}
              onTitleChange={(value) => setFormData(prev => ({ ...prev, sitePlanTitle: value }))}
              onDescriptionChange={(value) => setFormData(prev => ({ ...prev, sitePlanDescription: value }))}
              onImageChange={(value) => setFormData(prev => ({ ...prev, sitePlanImage: value }))}
            />
          </div>
        );

      case 5: // FAQs
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
              <PropertyFAQEditor
                value={formData.faqs}
                onChange={(value) => setFormData(prev => ({ ...prev, faqs: value }))}
              />
            </div>
          </div>
        );

      case 6: // Review
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Review Your Property Listing</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Please review all the information before submitting.</p>
              
              <div className="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {formData.title || 'Property Title'}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    {formData.address || 'Property Address'}
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {formData.price ? `${formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : formData.currency === 'GBP' ? '£' : '₹'}${formData.price.toLocaleString()}` : 'Not specified'}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Details</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {formData.beds && `${formData.beds} Beds`}{formData.beds && formData.baths ? ' • ' : ''}
                        {formData.baths && `${formData.baths} Baths`}{(formData.beds || formData.baths) && formData.area ? ' • ' : ''}
                        {formData.area && `${formData.area} sq ft`}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Images</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {featuredImage ? 'Featured image uploaded' : 'No featured image'}
                        {galleryImages.length > 0 && `, ${galleryImages.length} gallery images uploaded`}
                        {sitePlanImage && ', Site plan image uploaded'}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Features</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {formData.highlights && formData.highlights !== '[]' ? 
                          `${JSON.parse(formData.highlights).length} highlights added` : 
                          'No highlights added'}
                        <br />
                        {formData.facilities && formData.facilities !== '[]' ? 
                          `${JSON.parse(formData.facilities).length} facilities added` : 
                          'No facilities added'}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Floor Plans</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {formData.floorPlans && formData.floorPlans !== '[]' ? 
                          `${JSON.parse(formData.floorPlans).length} floor plans added` : 
                          'No floor plans added'}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Builder</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {formData.builderName || 'Not specified'}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">FAQs</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {formData.faqs && formData.faqs !== '[]' ? 
                          `${JSON.parse(formData.faqs).length} FAQs added` : 
                          'No FAQs added'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Property</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Fill in the details to create a new property listing.
        </p>
      </div>

      {/* Steps */}
      <nav aria-label="Progress" className="mb-8">
        <ol className="md:flex md:space-x-4 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
          {steps.map((step, index) => (
            <li key={step.id} className="md:flex-1">
              <button
                onClick={() => goToStep(index)}
                className={`group flex w-full items-center ${index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                disabled={index > currentStep}
              >
                <span className={`flex items-center px-4 py-2 text-sm font-medium rounded-full ${index < currentStep ? 'bg-indigo-600 text-white' : index === currentStep ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                  {index < currentStep ? (
                    <CheckCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  ) : (
                    <span className="mr-2">{index + 1}</span>
                  )}
                  {step.name}
                </span>
                <span className="hidden md:ml-2 md:block text-sm font-medium text-gray-500 dark:text-gray-400">{step.description}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <form onSubmit={currentStep === steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
          {renderStepContent()}

          {/* Step 4: Builder Info */}
          {currentStep === 4 && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Builder Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="col-span-2">
                    <label htmlFor="builderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Builder Name
                    </label>
                    <input
                      type="text"
                      id="builderName"
                      name="builderName"
                      value={formData.builderName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="builderLogo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Builder Logo URL
                    </label>
                    <input
                      type="text"
                      id="builderLogo"
                      name="builderLogo"
                      value={formData.builderLogo}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Enter the URL of the builder&apos;s logo image
                    </p>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="builderDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Builder Description
                    </label>
                    <textarea
                      id="builderDescription"
                      name="builderDescription"
                      rows={4}
                      value={formData.builderDescription}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

{/* Step 5: FAQs - Rendered through renderStepContent() */}


          {/* Step 6: Review */}
          {currentStep === 6 && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Review Your Property</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Basic Information</h3>
                    <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                      <div className="py-2 flex justify-between">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{formData.title}</dd>
                      </div>
                      <div className="py-2 flex justify-between">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{formData.currency} {formData.price}</dd>
                      </div>
                      <div className="py-2 flex justify-between">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{formData.address}</dd>
                      </div>
                      <div className="py-2 flex justify-between">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{formData.location}</dd>
                      </div>
                      <div className="py-2 flex justify-between">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Bedrooms</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{formData.beds}</dd>
                      </div>
                      <div className="py-2 flex justify-between">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Bathrooms</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{formData.baths}</dd>
                      </div>
                      <div className="py-2 flex justify-between">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Area</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{formData.area} sq ft</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Images</h3>
                    <div className="space-y-4">
                      {featuredImagePreview && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Featured Image</p>
                          <div className="relative w-full h-32">
                            <Image 
                              src={featuredImagePreview} 
                              alt="Featured image preview" 
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        </div>
                      )}
                      {galleryImagePreviews.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Gallery Images ({galleryImagePreviews.length})</p>
                          <div className="grid grid-cols-3 gap-2">
                            {galleryImagePreviews.slice(0, 3).map((preview, index) => (
                              <div key={index} className="relative w-full h-16">
                                <Image 
                                  src={preview} 
                                  alt={`Gallery image ${index + 1}`} 
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                            ))}
                            {galleryImagePreviews.length > 3 && (
                              <div className="relative w-full h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                                <span className="text-sm text-gray-600 dark:text-gray-300">+{galleryImagePreviews.length - 3} more</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {sitePlanImagePreview && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Site Plan Image</p>
                          <div className="relative w-full h-32">
                            <Image 
                              src={sitePlanImagePreview} 
                              alt="Site plan image preview" 
                              fill
                              className="object-contain rounded-md"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Please review all information before submitting. Once submitted, you&apos;ll be able to edit the property from the property management page.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${currentStep === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'}`}
            >
              <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Previous
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
                <ArrowRightIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Property'
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}