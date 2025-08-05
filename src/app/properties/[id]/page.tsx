import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import PropertyBanner from '@/components/PropertyBanner';
import PropertyAbout from '@/components/PropertyAbout';
import PropertyFeatures from '@/components/PropertyFeatures';
import PropertyFloorPlans from '@/components/PropertyFloorPlans';
import PropertyAmenities from '@/components/PropertyAmenities';
import PropertySitePlan from '@/components/PropertySitePlan';
import PropertyBuilder from '@/components/PropertyBuilder';
import PropertyFAQ from '@/components/PropertyFAQ';
import RelatedProperties from '@/components/RelatedProperties';


export default async function PropertyPage({ params }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { id } = await params;

  let property;

  try {
    // Fetch the property details from database
    property = await prisma.property.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Error fetching property:', error);
  }

  // If property not found, show 404
  if (!property) {
    notFound();
  }

  // Debug logging (remove in production)
  // console.log('Property data:', property);

  return (
      <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/" 
          className="text-brand-primary dark:text-brand-primary hover:underline flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to listings
        </Link>
      </div>

      {/* Banner Section */}
      <PropertyBanner 
        featuredImage={property.featuredImage || ''}
        title={property.bannerTitle || property.title}
        subtitle={property.bannerSubtitle || undefined}
        description={property.bannerDescription || undefined}
      />

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Property Details */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {property.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{property.address}</p>
            </div>
            <p className="text-3xl font-bold text-brand-primary dark:text-brand-primary">
              ₹{(property.price / 100000).toFixed(1)}L
            </p>
          </div>

          {/* About Section */}
          <PropertyAbout 
            title={property.aboutTitle || undefined}
            description={property.aboutDescription || property.description || undefined}
            mainTitle={property.aboutTitle ? undefined : 'About This Property'}
          />

          {/* Highlights Section */}
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
              title="Highlights"
            />
          )}

          {/* Floor Plans Section */}
          {property.floorPlans && (
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

          {/* Facilities Section */}
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

          {/* Site Plan Section */}
          <PropertySitePlan 
            sitePlanImage={property.sitePlanImage || undefined}
            sitePlanTitle={property.sitePlanTitle || undefined}
            sitePlanDescription={property.sitePlanDescription || undefined}
          />

          {/* Builder Section */}
          <PropertyBuilder 
            builderName={property.builderName || undefined}
            builderLogo={property.builderLogo || undefined}
            builderDescription={property.builderDescription || undefined}
          />

          {/* FAQ Section */}
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

          {/* Gallery Images */}
          {property.galleryImages && property.galleryImages.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.galleryImages.map((imageUrl, index) => (
                  <div key={index} className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={imageUrl}
                      alt={`${property.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Listed on {new Date(property.createdAt).toLocaleDateString()}
            </p>
            <Link
              href={`/properties/${property.id}/contact`}
              className="px-4 py-2 bg-brand-primary hover:bg-primary-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
              Contact Agent
            </Link>
          </div>

          {/* Related Properties */}
          <RelatedProperties 
            currentPropertyId={property.id}
            currentPrice={property.price}
            currentLocation={property.location}
            limit={3}
          />
        </div>
      </div>
      </div>
    );
}