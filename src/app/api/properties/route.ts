import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('API: Received property creation request');
    const body = await request.json();
    console.log('API: Request body keys:', Object.keys(body));
    console.log('API: Request body:', body);
    console.log('API: Required fields check:', {
      title: !!body.title,
      description: !!body.description,
      price: !!body.price,
      address: !!body.address,
      location: !!body.location,
      featuredImage: !!body.featuredImage
    });
    console.log('API: JSON fields:', {
      highlights: typeof body.highlights,
      floorPlans: typeof body.floorPlans,
      facilities: typeof body.facilities,
      faqs: typeof body.faqs,
      faqs_value: body.faqs
    });
    
    // Validate required fields
    const { 
      title, description, price, address, location, currency, featuredImage, galleryImages, beds, baths, area,
      // New fields
      bannerTitle, bannerSubtitle, bannerDescription,
      aboutTitle, aboutDescription,
      highlights, floorPlans, facilities,
      sitePlanImage, sitePlanTitle, sitePlanDescription,
      builderName, builderLogo, builderDescription,
      faqs, relatedProperties
    } = body;
    
    if (!title || !description || !price || !address || !location || !featuredImage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      // Ensure galleryImages is an array and doesn't contain null values
      const validGalleryImages = Array.isArray(galleryImages) 
        ? galleryImages.filter(url => url !== null && url !== undefined) 
        : [];
      
      // Parse JSON strings if they exist
      let parsedHighlights, parsedFloorPlans, parsedFacilities, parsedFaqs;
      
      try {
        parsedHighlights = highlights ? (typeof highlights === 'string' ? JSON.parse(highlights) : highlights) : [];
      } catch (error) {
        console.error('Error parsing highlights:', error);
        parsedHighlights = [];
      }
      
      try {
        parsedFloorPlans = floorPlans ? (typeof floorPlans === 'string' ? JSON.parse(floorPlans) : floorPlans) : [];
      } catch (error) {
        console.error('Error parsing floorPlans:', error);
        parsedFloorPlans = [];
      }
      
      try {
        parsedFacilities = facilities ? (typeof facilities === 'string' ? JSON.parse(facilities) : facilities) : [];
      } catch (error) {
        console.error('Error parsing facilities:', error);
        parsedFacilities = [];
      }
      
      try {
        console.log('API: Before parsing FAQs - type:', typeof faqs, 'value:', faqs);
        if (faqs) {
          let parsedValue;
          if (typeof faqs === 'string') {
            console.log('API: FAQs is a string, attempting to parse');
            parsedValue = JSON.parse(faqs);
          } else {
            console.log('API: FAQs is not a string, using as is');
            parsedValue = faqs;
          }
          
          // Check if it's an object with a faqs property that's an array
          if (parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue) && Array.isArray(parsedValue.faqs)) {
            console.log('API: Extracted faqs array from object');
            parsedFaqs = parsedValue.faqs;
          } else {
            parsedFaqs = parsedValue;
          }
        } else {
          console.log('API: FAQs is falsy, using empty array');
          parsedFaqs = [];
        }
        console.log('API: Parsed FAQs result:', parsedFaqs);
      } catch (error) {
        console.error('API: Error parsing faqs:', error);
        console.log('API: FAQs value that failed parsing:', faqs);
        console.log('API: FAQs string representation:', JSON.stringify(faqs));
        parsedFaqs = [];
      }
      const validRelatedProperties = Array.isArray(relatedProperties) ? relatedProperties : [];
      
      // Create the property in the database
      const property = await prisma.property.create({
        data: {
          title,
          description,
          price,
          address,
          location,
          currency: currency || 'USD',
          featuredImage,
          galleryImages: validGalleryImages,
          beds: beds || 0,
          baths: baths || 0,
          area: area || 0,
          
          // New fields
          bannerTitle,
          bannerSubtitle,
          bannerDescription,
          aboutTitle,
          aboutDescription,
          highlights: parsedHighlights,
          floorPlans: parsedFloorPlans,
          facilities: parsedFacilities,
          sitePlanImage,
          sitePlanTitle,
          sitePlanDescription,
          builderName,
          builderLogo,
          builderDescription,
          faqs: parsedFaqs,
          relatedProperties: validRelatedProperties,
        },
      });

      return NextResponse.json(property, { status: 201 });
    } catch (dbError) {
      console.error('Database error creating property:', dbError);
      console.log('API: Database connection error when creating property');
      // Ensure galleryImages is an array and doesn't contain null values
      const validGalleryImages = Array.isArray(galleryImages) 
        ? galleryImages.filter(url => url !== null && url !== undefined) 
        : [];
      
      // Parse JSON strings if they exist
      const parsedHighlights = highlights ? (typeof highlights === 'string' ? JSON.parse(highlights) : highlights) : null;
      const parsedFloorPlans = floorPlans ? (typeof floorPlans === 'string' ? JSON.parse(floorPlans) : floorPlans) : null;
      const parsedFacilities = facilities ? (typeof facilities === 'string' ? JSON.parse(facilities) : facilities) : null;
      const parsedFaqs = faqs ? (typeof faqs === 'string' ? JSON.parse(faqs) : faqs) : null;
      const validRelatedProperties = Array.isArray(relatedProperties) ? relatedProperties : [];
      
      // Create a mock property with a generated ID
      const mockProperty = {
        id: `mock-${Date.now()}`,
        title,
        description,
        price,
        address,
        location,
        currency: currency || 'USD',
        featuredImage,
        galleryImages: validGalleryImages,
        beds: beds || 0,
        baths: baths || 0,
        area: area || 0,
        createdAt: new Date(),
        // New fields
        bannerTitle,
        bannerSubtitle,
        bannerDescription,
        aboutTitle,
        aboutDescription,
        highlights: parsedHighlights,
        floorPlans: parsedFloorPlans,
        facilities: parsedFacilities,
        sitePlanImage,
        sitePlanTitle,
        sitePlanDescription,
        builderName,
        builderLogo,
        builderDescription,
        faqs: parsedFaqs,
        relatedProperties: validRelatedProperties,
      };
      
      return NextResponse.json(
        { property: mockProperty, warning: 'Created in mock mode due to database connection error' },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    let properties = [];
    
    try {
      // Try to fetch from database
      properties = await prisma.property.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json(properties);
    } catch (dbError) {
      console.error('Database error fetching properties:', dbError);
      return NextResponse.json(
        { properties: [] },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}