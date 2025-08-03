import React from 'react';
import Image from 'next/image';

interface PropertyBannerProps {
  featuredImage: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

const PropertyBanner: React.FC<PropertyBannerProps> = ({ 
  featuredImage,
  title,
  subtitle,
  description
}) => {
  return (
    <div className="relative w-full h-[50vh] min-h-[400px] mb-8">
      {featuredImage && (
        <Image
          src={featuredImage}
          alt={title || 'Property Banner'}
          fill
          className="object-cover rounded-lg"
          priority
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white rounded-lg">
        {title && <h1 className="text-4xl font-bold mb-2">{title}</h1>}
        {subtitle && <h2 className="text-2xl font-semibold mb-3">{subtitle}</h2>}
        {description && <p className="text-lg max-w-2xl">{description}</p>}
      </div>
    </div>
  );
};

export default PropertyBanner;