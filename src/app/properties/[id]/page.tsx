import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

type PropertyPageProps = {
  params: {
    id: string;
  };
};

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = params;

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

  return (
      <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/" 
          className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to listings
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Property Images */}
        <div className="relative h-96 w-full bg-gray-200 dark:bg-gray-700">
          {property.featuredImage ? (
            <Image
              src={property.featuredImage}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">No image available</p>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {property.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{property.address}</p>
            </div>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              ${property.price.toLocaleString()}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
            <div 
              className="text-gray-700 dark:text-gray-300 rich-text-content" 
              dangerouslySetInnerHTML={{ __html: property.description }}
            />
          </div>

          {/* Additional Images */}
          {property.galleryImages && property.galleryImages.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">More Photos</h2>
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
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Contact Agent
            </Link>
          </div>
        </div>
      </div>
      </div>
    );
}