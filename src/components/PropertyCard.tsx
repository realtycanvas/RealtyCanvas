import Link from 'next/link';
import ImageCarousel from './ImageCarousel';
import { stripHtml } from '@/utils/strip-html';

// Define Property type directly since generated Prisma types aren't available
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

type PropertyCardProps = {
  property: Property;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  // Prepare images array for carousel
  const images = [];
  if (property.featuredImage) {
    images.push(property.featuredImage);
  }
  if (property.galleryImages && property.galleryImages.length > 0) {
    images.push(...property.galleryImages);
  }
  
  // If no images available, use placeholder
  if (images.length === 0) {
    images.push('/placeholder-property.svg');
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
      <ImageCarousel 
        images={images} 
        title={property.title} 
        autoplay={true} 
        loop={true} 
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{property.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{property.address}</p>
        <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xl mb-2">
          ${property.price.toLocaleString()}
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-4">
          {stripHtml(property.description)}
        </p>
        <Link 
          href={`/properties/${property.id}`}
          className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}