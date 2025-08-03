import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single property by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

// DELETE a property by ID
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Delete the property
    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Property deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}

// UPDATE a property by ID
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  try {
    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Extract fields from the request body
    const { 
      highlights, floorPlans, facilities, faqs, relatedProperties,
      ...otherData 
    } = body;

    // Parse JSON strings if they exist
    const parsedHighlights = highlights ? (typeof highlights === 'string' ? JSON.parse(highlights) : highlights) : undefined;
    const parsedFloorPlans = floorPlans ? (typeof floorPlans === 'string' ? JSON.parse(floorPlans) : floorPlans) : undefined;
    const parsedFacilities = facilities ? (typeof facilities === 'string' ? JSON.parse(facilities) : facilities) : undefined;
    
    // Handle faqs - check if it's an object with a faqs property
    let parsedFaqs;
    if (faqs) {
      try {
        // Parse if it's a string
        const parsedValue = typeof faqs === 'string' ? JSON.parse(faqs) : faqs;
        
        // Check if it's an object with a faqs property that's an array
        if (parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue) && Array.isArray(parsedValue.faqs)) {
          console.log('API: Extracted faqs array from object');
          parsedFaqs = parsedValue.faqs;
        } else {
          parsedFaqs = parsedValue;
        }
      } catch (error) {
        console.error('Error parsing faqs:', error);
        parsedFaqs = undefined;
      }
    } else {
      parsedFaqs = undefined;
    }
    const validRelatedProperties = Array.isArray(relatedProperties) ? relatedProperties : undefined;

    // Update the property
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        ...otherData,
        highlights: parsedHighlights,
        floorPlans: parsedFloorPlans,
        facilities: parsedFacilities,
        faqs: parsedFaqs,
        relatedProperties: validRelatedProperties,
      },
    });

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}