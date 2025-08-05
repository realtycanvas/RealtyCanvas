'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  CheckCircleIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  HomeIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  EyeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import PropertyBasicInfoEditor from '@/components/PropertyBasicInfoEditor';
import PropertyHighlightsEditor from '@/components/PropertyHighlightsEditor';
import PropertyFacilitiesEditor from '@/components/PropertyFacilitiesEditor';
import PropertyFloorPlansEditor from '@/components/PropertyFloorPlansEditor';
import PropertyBuilderEditor from '@/components/PropertyBuilderEditor';
import PropertySitePlanEditor from '@/components/PropertySitePlanEditor';
import PropertyFAQEditor from '@/components/PropertyFAQEditor';

// Dynamically import LexicalEditor component
const LexicalEditor = dynamic(
  () => import('@/components/LexicalEditor'),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl flex items-center justify-center">
        <span className="text-gray-500">Loading editor...</span>
      </div>
    ),
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

// Modern step configuration
const steps = [
  { 
    id: 'basic', 
    name: 'Basic Info', 
    description: 'Property details and location',
    icon: HomeIcon,
    color: 'text-blue-600'
  },
  { 
    id: 'images', 
    name: 'Photos', 
    description: 'Upload stunning property images',
    icon: PhotoIcon,
    color: 'text-green-600'
  },
  { 
    id: 'features', 
    name: 'Features', 
    description: 'Highlights and amenities',
    icon: BuildingOfficeIcon,
    color: 'text-purple-600'
  },
  { 
    id: 'floorplans', 
    name: 'Floor Plans', 
    description: 'Layout and pricing details',
    icon: DocumentTextIcon,
    color: 'text-orange-600'
  },
  { 
    id: 'builder', 
    name: 'Builder', 
    description: 'Developer information',
    icon: MapPinIcon,
    color: 'text-red-600'
  },
  { 
    id: 'faqs', 
    name: 'FAQs', 
    description: 'Common questions',
    icon: QuestionMarkCircleIcon,
    color: 'text-indigo-600'
  },
  { 
    id: 'review', 
    name: 'Review', 
    description: 'Final review and publish',
    icon: EyeIcon,
    color: 'text-emerald-600'
  },
];

export default function ModernPropertyListingPage() {
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
  const [isAIAssisted, setIsAIAssisted] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: 0,
    address: '',
    location: '',
    currency: 'INR',
    beds: 0,
    baths: 0,
    area: 0,
    bannerTitle: '',
    bannerSubtitle: '',
    bannerDescription: '',
    aboutTitle: '',
    aboutDescription: '',
    builderName: '',
    builderLogo: '',
    builderDescription: '',
    sitePlanTitle: '',
    sitePlanDescription: '',
    sitePlanImage: '',
    highlights: JSON.stringify([]),
    floorPlans: JSON.stringify([]),
    facilities: JSON.stringify([]),
    faqs: JSON.stringify([]),
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
  }, [featuredImage, galleryImages, sitePlanImage]);

  const isStepComplete = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Basic Info
        return formData.title && formData.address && formData.price > 0;
      case 1: // Images
        return featuredImage !== null;
      case 2: // Features
        return true; // Optional step
      case 3: // Floor Plans
        return true; // Optional step
      case 4: // Builder
        return true; // Optional step
      case 5: // FAQs
        return true; // Optional step
      case 6: // Review
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // AI function to generate property description
  const generateDescription = async () => {
    if (!formData.title || !formData.address || !isAIAssisted) return;
    
    setIsGeneratingDescription(true);
    try {
      const response = await fetch('/api/property-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'generate_description',
          propertyData: {
            title: formData.title,
            price: formData.price,
            address: formData.address,
            location: formData.location,
            beds: formData.beds,
            baths: formData.baths,
            area: formData.area
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.content) {
          setFormData({
            ...formData,
            description: data.content
          });
        }
      }
    } catch (error) {
      console.error('Error generating description:', error);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Create FormData object for file uploads
      const submitData = new FormData();
      
      // Add basic form data
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof PropertyFormData];
        if (Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value));
        } else {
          submitData.append(key, value.toString());
        }
      });

      // Add files
      if (featuredImage) {
        submitData.append('featuredImage', featuredImage);
      }
      
      galleryImages.forEach((file, index) => {
        submitData.append(`galleryImage${index}`, file);
      });

      if (sitePlanImage) {
        submitData.append('sitePlanImage', sitePlanImage);
      }

      const response = await fetch('/api/properties', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/properties/${result.id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      alert('An error occurred while submitting the property');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Step {currentStep + 1} of {steps.length}
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>

      {/* Step Icons */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep || isStepComplete(index);
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <button
                onClick={() => setCurrentStep(index)}
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 text-white shadow-lg scale-110'
                    : isActive
                    ? 'bg-blue-500 text-white shadow-lg scale-110'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {isCompleted && index !== currentStep ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </button>
              <span className={`text-xs text-center font-medium ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderImageUpload = () => (
    <div className="space-y-8">
      {/* Featured Image */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Featured Image
        </h3>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
          {featuredImagePreview ? (
            <div className="relative">
              <Image
                src={featuredImagePreview}
                alt="Featured preview"
                width={400}
                height={300}
                className="mx-auto rounded-lg shadow-lg"
              />
              <button
                onClick={() => {
                  setFeaturedImage(null);
                  setFeaturedImagePreview(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <div>
              <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Upload Featured Image
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Drag and drop your main property image here, or click to browse
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFeaturedImage(file);
                }}
                className="hidden"
                id="featured-upload"
              />
              <label
                htmlFor="featured-upload"
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <PhotoIcon className="w-5 h-5 mr-2" />
                Choose Image
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Images */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Gallery Images
        </h3>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {galleryImagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <Image
                  src={preview}
                  alt={`Gallery ${index + 1}`}
                  width={200}
                  height={150}
                  className="w-full h-32 object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={() => {
                    const newGallery = galleryImages.filter((_, i) => i !== index);
                    setGalleryImages(newGallery);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setGalleryImages([...galleryImages, ...files]);
              }}
              className="hidden"
              id="gallery-upload"
            />
            <label
              htmlFor="gallery-upload"
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors cursor-pointer"
            >
              <PhotoIcon className="w-5 h-5 mr-2" />
              Add Gallery Images
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* AI Assistance Toggle */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100">
              AI-Powered Listing Assistant
            </h4>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              Enable AI to help generate compelling descriptions and content
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAIAssisted(!isAIAssisted)}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isAIAssisted
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            {isAIAssisted ? 'AI Enabled' : 'Enable AI'}
          </button>
        </div>
      </div>

      <PropertyBasicInfoEditor
        formData={formData}
        onFormDataChange={(newData) => setFormData({
          ...formData,
          ...newData
        })}
      />

      {/* AI Description Generator */}
      {isAIAssisted && formData.title && formData.address && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                AI Description Generator
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Generate a compelling property description using AI
              </p>
            </div>
            <button
              type="button"
              onClick={generateDescription}
              disabled={isGeneratingDescription}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isGeneratingDescription ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Generate Description
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderImageUpload();
      case 2:
        return (
          <PropertyHighlightsEditor
            value={formData.highlights}
            onChange={(highlights) => setFormData({ ...formData, highlights })}
            propertyData={{
              title: formData.title,
              price: formData.price,
              address: formData.address,
              location: formData.location,
              beds: formData.beds,
              baths: formData.baths,
              area: formData.area
            }}
          />
        );
      case 3:
        return (
          <PropertyFloorPlansEditor
            value={formData.floorPlans}
            onChange={(floorPlans) => setFormData({ ...formData, floorPlans })}
          />
        );
      case 4:
        return (
          <div className="space-y-8">
            <PropertyBuilderEditor
              builderName={formData.builderName}
              builderLogo={formData.builderLogo}
              builderDescription={formData.builderDescription}
              onBuilderNameChange={(builderName) => setFormData({ ...formData, builderName })}
              onBuilderLogoChange={(builderLogo) => setFormData({ ...formData, builderLogo })}
              onBuilderDescriptionChange={(builderDescription) => setFormData({ ...formData, builderDescription })}
            />
            <PropertySitePlanEditor
              sitePlanTitle={formData.sitePlanTitle}
              sitePlanDescription={formData.sitePlanDescription}
              sitePlanImage={formData.sitePlanImage}
              onTitleChange={(sitePlanTitle) => setFormData({ ...formData, sitePlanTitle })}
              onDescriptionChange={(sitePlanDescription) => setFormData({ ...formData, sitePlanDescription })}
              onImageChange={(sitePlanImage) => setFormData({ ...formData, sitePlanImage })}
            />
          </div>
        );
      case 5:
        return (
          <PropertyFAQEditor
            value={formData.faqs}
            onChange={(faqs) => setFormData({ ...formData, faqs })}
          />
        );
      case 6:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Review Your Listing</h3>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Property Title</h4>
                  <p className="text-gray-600 dark:text-gray-300">{formData.title || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Price</h4>
                  <p className="text-2xl font-bold text-blue-600">₹{formData.price.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h4>
                  <p className="text-gray-600 dark:text-gray-300">{formData.address || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Property Details</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {formData.beds} beds • {formData.baths} baths • {formData.area} sq ft
                  </p>
                </div>
              </div>
              
              {featuredImagePreview && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Featured Image</h4>
                  <Image
                    src={featuredImagePreview}
                    alt="Featured preview"
                    width={300}
                    height={200}
                    className="rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              List Your Property
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Create a stunning listing that attracts the right buyers
            </p>
          </div>
          <Link
            href="/properties"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Properties
          </Link>
        </div>
      </div>

      <div className="max-w-7xl flex items-center justify-center flex-col mx-auto px-4 sm:px-6 lg:px-8  gap-8">
        <div className="">
          {/* Sidebar */}
          <div className="lg:col-span-1 mb-6">
            {renderStepIndicator()}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Step Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex items-center">
                  {(() => {
                    const Icon = steps[currentStep].icon;
                    return <Icon className="w-8 h-8 mr-4" />;
                  })()}
                  <div>
                    <h2 className="text-2xl font-bold">{steps[currentStep].name}</h2>
                    <p className="opacity-90">{steps[currentStep].description}</p>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-8">
                {renderCurrentStep()}
              </div>

              {/* Navigation */}
              <div className="bg-gray-50 dark:bg-gray-700 px-8 py-6 flex justify-between items-center border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                    currentStep === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Previous
                </button>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Step {currentStep + 1} of {steps.length}
                </div>

                {currentStep === steps.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`flex items-center px-8 py-3 rounded-xl font-medium transition-all ${
                      isSubmitting
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        Publish Property
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Next
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}