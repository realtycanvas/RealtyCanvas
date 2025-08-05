'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPinIcon, 
  HomeIcon, 
  BuildingOfficeIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShareIcon,
  HeartIcon,
  EyeIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import PropertyAbout from '@/components/PropertyAbout';
import PropertyFeatures from '@/components/PropertyFeatures';
import PropertyFloorPlans from '@/components/PropertyFloorPlans';
import PropertyAmenities from '@/components/PropertyAmenities';
import PropertySitePlan from '@/components/PropertySitePlan';
import PropertyBuilder from '@/components/PropertyBuilder';
import PropertyFAQ from '@/components/PropertyFAQ';
import RelatedProperties from '@/components/RelatedProperties';
import { BrandButton } from '@/components/ui/BrandButton';

interface Property {
  id: string;
  title: string;
  description: string | null;
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
  bannerTitle: string | null;
  bannerSubtitle: string | null;
  bannerDescription: string | null;
  aboutTitle: string | null;
  aboutDescription: string | null;
  highlights: any;
  floorPlans: any;
  facilities: any;
  sitePlanImage: string | null;
  sitePlanTitle: string | null;
  sitePlanDescription: string | null;
  builderName: string | null;
  builderLogo: string | null;
  builderDescription: string | null;
  faqs: any;
  relatedProperties: any;
}

interface ModernPropertyPageProps {
  property: Property;
}

export default function ModernPropertyPage({ property }: ModernPropertyPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Prepare all images for gallery
  const allImages = [property.featuredImage, ...property.galleryImages].filter(Boolean);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else {
      return `₹${price.toLocaleString('en-IN')}`;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: HomeIcon },
    { id: 'floor-plans', label: 'Floor Plans', icon: BuildingOfficeIcon },
    { id: 'amenities', label: 'Amenities', icon: MapPinIcon },
    { id: 'gallery', label: 'Gallery', icon: CameraIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-brand-primary hover:text-primary-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/properties" className="text-brand-primary hover:text-primary-600">
              Properties
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-300 truncate">{property.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image Gallery */}
            <div className="relative mb-8">
              <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 relative group">
                <Image
                  src={allImages[selectedImageIndex]}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
                
                {/* Image Overlay Controls */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => setIsFavorited(!isFavorited)}
                      className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                      {isFavorited ? (
                        <HeartIconSolid className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      )}
                    </button>
                    <button className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors">
                      <ShareIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {allImages.slice(0, 5).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                              selectedImageIndex === index 
                                ? 'bg-white' 
                                : 'bg-white/50 hover:bg-white/70'
                            }`}
                          />
                        ))}
                        {allImages.length > 5 && (
                          <button
                            onClick={() => setShowImageModal(true)}
                            className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900 hover:bg-white transition-colors"
                          >
                            +{allImages.length - 5} more
                          </button>
                        )}
                      </div>
                      
                      <button
                        onClick={() => setShowImageModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900 hover:bg-white transition-colors"
                      >
                        <EyeIcon className="w-4 h-4" />
                        <span>View All Photos</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Thumbnail Strip for Desktop */}
              {allImages.length > 1 && (
                <div className="hidden lg:flex mt-4 space-x-3 overflow-x-auto pb-2">
                  {allImages.slice(0, 6).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden ${
                        selectedImageIndex === index 
                          ? 'ring-3 ring-brand-primary' 
                          : 'ring-1 ring-gray-200 dark:ring-gray-600 hover:ring-brand-primary'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`View ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span className="text-lg">{property.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl lg:text-4xl font-bold text-brand-primary mb-1">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Listed {new Date(property.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{property.beds}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</div>
                </div>
                <div className="text-center border-x border-gray-200 dark:border-gray-600">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{property.baths}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{property.area}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sq Ft</div>
                </div>
              </div>
            </div>

            {/* Tabbed Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-brand-primary text-brand-primary bg-primary-50 dark:bg-gray-700'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* About Section */}
                    <PropertyAbout 
                      mainTitle="About This Property"
                      title={property.aboutTitle || undefined}
                      description={property.aboutDescription || property.description || "No description available."}
                    />
                    
                    {/* Features/Highlights */}
                    {property.highlights && (
                      <PropertyFeatures 
                        highlights={(() => {
                          try {
                            return typeof property.highlights === 'string' ? 
                              JSON.parse(property.highlights) : 
                              property.highlights;
                          } catch (error) {
                            console.error('Error parsing highlights:', error);
                            return [];
                          }
                        })()}
                        title="Property Highlights"
                      />
                    )}
                    
                    {/* Builder Info */}
                    <PropertyBuilder 
                      builderName={property.builderName || undefined}
                      builderLogo={property.builderLogo || undefined}
                      builderDescription={property.builderDescription || undefined}
                    />
                    
                    {/* FAQ */}
                    {property.faqs && (
                      <PropertyFAQ 
                        faqs={(() => {
                          try {
                            return typeof property.faqs === 'string' ? 
                              JSON.parse(property.faqs) : 
                              property.faqs;
                          } catch (error) {
                            console.error('Error parsing faqs:', error);
                            return [];
                          }
                        })()}
                        title="Frequently Asked Questions"
                      />
                    )}
                  </div>
                )}

                {activeTab === 'floor-plans' && property.floorPlans && (
                  <PropertyFloorPlans 
                    floorPlans={(() => {
                      try {
                        return typeof property.floorPlans === 'string' ? 
                          JSON.parse(property.floorPlans) : 
                          property.floorPlans;
                      } catch (error) {
                        console.error('Error parsing floorPlans:', error);
                        return [];
                      }
                    })()}
                    title="Floor Plans & Pricing"
                  />
                )}

                {activeTab === 'amenities' && (
                  <div className="space-y-8">
                    {property.facilities && (
                      <PropertyAmenities 
                        facilities={(() => {
                          try {
                            return typeof property.facilities === 'string' ? 
                              JSON.parse(property.facilities) : 
                              property.facilities;
                          } catch (error) {
                            console.error('Error parsing facilities:', error);
                            return [];
                          }
                        })()}
                        title="Project Facilities"
                      />
                    )}
                    
                    <PropertySitePlan 
                      sitePlanImage={property.sitePlanImage || undefined}
                      sitePlanTitle={property.sitePlanTitle || undefined}
                      sitePlanDescription={property.sitePlanDescription || undefined}
                    />
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImageIndex(index);
                          setShowImageModal(true);
                        }}
                        className="relative aspect-w-16 aspect-h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 group"
                      >
                        <Image
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <EyeIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Related Properties */}
            <div className="mt-12">
              <RelatedProperties 
                currentPropertyId={property.id}
                currentPrice={property.price}
                currentLocation={property.location}
                limit={3}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-8 space-y-6">
              {/* Contact Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Interested in this property?
                </h3>
                
                <div className="space-y-4">
                  <Link href={`/properties/${property.id}/contact`} className=''>
                    <div className='flex items-center justify-center w-full rounded-xl text-blue-950 border-2 border-blue-950 hover:scale-105 bg-white dark:bg-brand-primary dark:text-white p-5  transition-all duration-300'>
                      <PhoneIcon className="w-5 h-5 mr-2" />
                      Contact Agent
                    </div>
                     
                 
                  </Link>
                  
                  <BrandButton
                    variant="primary"
                    size="lg"
                    className="w-full rounded-xl"
                  >
                    <EnvelopeIcon className="w-5 h-5 mr-2" />
                    Request Info
                  </BrandButton>
                  
                 
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-between mb-2">
                      <span>Property ID:</span>
                      <span className="font-medium">{property.id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Updated:</span>
                      <span className="font-medium">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Facts
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Type</span>
                    <span className="font-medium text-gray-900 dark:text-white">Residential</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Area</span>
                    <span className="font-medium text-gray-900 dark:text-white">{property.area} sq ft</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Location</span>
                    <span className="font-medium text-gray-900 dark:text-white">{property.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Price</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatPrice(property.price)}</span>
                  </div>
                </div>
              </div>

             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}