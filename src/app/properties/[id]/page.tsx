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
import ModernPropertyPage from '@/components/property/ModernPropertyPage';

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

  return <ModernPropertyPage property={property} />;
}