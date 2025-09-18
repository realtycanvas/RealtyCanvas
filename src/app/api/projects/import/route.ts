import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function uniqueSlug(base: string) {
  let candidate = base || 'project';
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.project.findFirst({ where: { slug: candidate } });
    if (!exists) return candidate;
    const suffix = Math.random().toString(36).slice(2, 6);
    candidate = `${base}-${suffix}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project, highlights, amenities, faqs, media, floorPlans, documents, configurations, units, anchors, pricingPlans, construction, nearbyPoints } = body;

    if (!project || !project.title || !project.description || !project.address || !project.featuredImage) {
      return NextResponse.json({ error: 'Missing required project fields (title, description, address, featuredImage)' }, { status: 400 });
    }

    // Generate unique slug
    const baseSlug = project.slug ? slugify(project.slug) : slugify(project.title);
    const finalSlug = await uniqueSlug(baseSlug);

    // Create project with all nested data in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the project
      const createdProject = await tx.project.create({
        data: {
          slug: finalSlug,
          title: project.title,
          subtitle: project.subtitle || null,
          description: project.description,
          category: project.category || 'COMMERCIAL',
          status: project.status || 'PLANNED',
          reraId: project.reraId || null,
          developerName: project.developerName || null,
          developerLogo: project.developerLogo || null,
          possessionDate: project.possessionDate ? new Date(project.possessionDate) : null,
          launchDate: project.launchDate ? new Date(project.launchDate) : null,
          address: project.address,
          locality: project.locality || null,
          city: project.city || null,
          state: project.state || null,
          latitude: typeof project.latitude === 'number' ? project.latitude : null,
          longitude: typeof project.longitude === 'number' ? project.longitude : null,
          currency: project.currency || 'INR',
          featuredImage: project.featuredImage,
          galleryImages: Array.isArray(project.galleryImages) ? project.galleryImages : [],
          videoUrl: project.videoUrl || null,
          videoUrls: Array.isArray(project.videoUrls) ? project.videoUrls : [],
          basePrice: typeof project.basePrice === 'number' ? project.basePrice : null,
          priceRange: project.priceRange || null,
          bannerTitle: project.bannerTitle || null,
          bannerSubtitle: project.bannerSubtitle || null,
          bannerDescription: project.bannerDescription || null,
          aboutTitle: project.aboutTitle || null,
          aboutDescription: project.aboutDescription || null,
          sitePlanImage: project.sitePlanImage || null,
          sitePlanTitle: project.sitePlanTitle || null,
          sitePlanDescription: project.sitePlanDescription || null,
          minRatePsf: typeof project.minRatePsf === 'number' ? project.minRatePsf : null,
          maxRatePsf: typeof project.maxRatePsf === 'number' ? project.maxRatePsf : null,
          minUnitArea: typeof project.minUnitArea === 'number' ? project.minUnitArea : null,
          maxUnitArea: typeof project.maxUnitArea === 'number' ? project.maxUnitArea : null,
          totalUnits: typeof project.totalUnits === 'number' ? project.totalUnits : null,
          soldUnits: typeof project.soldUnits === 'number' ? project.soldUnits : null,
          availableUnits: typeof project.availableUnits === 'number' ? project.availableUnits : null,
          // Commercial project specific fields
          numberOfFloors: typeof project.numberOfFloors === 'number' ? project.numberOfFloors : null,
          numberOfTowers: typeof project.numberOfTowers === 'number' ? project.numberOfTowers : null,
          numberOfApartments: typeof project.numberOfApartments === 'number' ? project.numberOfApartments : null,
          features: project.features || null,
        },
      });

      // 2. Create highlights
      if (Array.isArray(highlights) && highlights.length > 0) {
        await tx.highlight.createMany({
          data: highlights.map((h: any, index: number) => ({
            projectId: createdProject.id,
            label: h.label,
            icon: h.icon || null,
            sortOrder: h.sortOrder !== undefined ? h.sortOrder : index,
          })),
        });
      }

      // 3. Create amenities
      if (Array.isArray(amenities) && amenities.length > 0) {
        await tx.amenity.createMany({
          data: amenities.map((a: any, index: number) => ({
            projectId: createdProject.id,
            category: a.category || 'General',
            name: a.name,
            details: a.details || null,
            sortOrder: a.sortOrder !== undefined ? a.sortOrder : index,
          })),
        });
      }

      // 4. Create FAQs
      if (Array.isArray(faqs) && faqs.length > 0) {
        await tx.faq.createMany({
          data: faqs.map((f: any, index: number) => ({
            projectId: createdProject.id,
            question: f.question,
            answer: f.answer,
            sortOrder: f.sortOrder !== undefined ? f.sortOrder : index,
          })),
        });
      }

      // 5. Create media
      if (Array.isArray(media) && media.length > 0) {
        await tx.media.createMany({
          data: media.map((m: any, index: number) => ({
            projectId: createdProject.id,
            type: m.type || 'IMAGE',
            url: m.url,
            caption: m.caption || null,
            tags: Array.isArray(m.tags) ? m.tags : [],
            floor: m.floor || null,
            sortOrder: m.sortOrder !== undefined ? m.sortOrder : index,
          })),
        });
      }

      // 6. Create floor plans
      if (Array.isArray(floorPlans) && floorPlans.length > 0) {
        await tx.floorPlan.createMany({
          data: floorPlans.map((fp: any, index: number) => ({
            projectId: createdProject.id,
            level: fp.level,
            title: fp.title || null,
            imageUrl: fp.imageUrl,
            details: fp.details || null,
            sortOrder: fp.sortOrder !== undefined ? fp.sortOrder : index,
          })),
        });
      }

      // 7. Create documents
      if (Array.isArray(documents) && documents.length > 0) {
        await tx.document.createMany({
          data: documents.map((d: any) => ({
            projectId: createdProject.id,
            docType: d.docType || 'OTHER',
            title: d.title,
            fileUrl: d.fileUrl || '',
            number: d.number || null,
            issueDate: d.issueDate ? new Date(d.issueDate) : null,
            expiryDate: d.expiryDate ? new Date(d.expiryDate) : null,
          })),
        });
      }

      // 8. Create configurations
      if (Array.isArray(configurations) && configurations.length > 0) {
        await tx.configurationType.createMany({
          data: configurations.map((c: any, index: number) => ({
            projectId: createdProject.id,
            type: c.type || 'RETAIL',
            level: c.level || null,
            areaRangeMin: typeof c.areaRangeMin === 'number' ? c.areaRangeMin : null,
            areaRangeMax: typeof c.areaRangeMax === 'number' ? c.areaRangeMax : null,
            notes: c.notes || null,
            sortOrder: c.sortOrder !== undefined ? c.sortOrder : index,
          })),
        });
      }

      // 9. Create anchors
      if (Array.isArray(anchors) && anchors.length > 0) {
        await tx.anchorTenant.createMany({
          data: anchors.map((a: any) => ({
            projectId: createdProject.id,
            name: a.name,
            category: a.category || 'Retail',
            status: a.status || 'PLANNED',
            floor: a.floor || null,
            areaSqFt: typeof a.areaSqFt === 'number' ? a.areaSqFt : null,
          })),
        });
      }

      // 10. Create pricing plans
      if (Array.isArray(pricingPlans) && pricingPlans.length > 0) {
        await tx.pricingPlan.createMany({
          data: pricingPlans.map((p: any) => ({
            projectId: createdProject.id,
            name: p.name,
            planType: p.planType || 'BASE',
            schedule: p.schedule || null,
            taxes: p.taxes || [],
            charges: p.charges || [],
            notes: p.notes || null,
          })),
        });
      }

      // 11. Create construction milestones
      if (Array.isArray(construction) && construction.length > 0) {
        await tx.constructionMilestone.createMany({
          data: construction.map((c: any) => ({
            projectId: createdProject.id,
            name: c.name,
            status: c.status || 'Pending',
            date: c.date ? new Date(c.date) : null,
            images: Array.isArray(c.images) ? c.images : [],
          })),
        });
      }

      // 12. Create nearby points
      if (Array.isArray(nearbyPoints) && nearbyPoints.length > 0) {
        await tx.nearbyPoint.createMany({
          data: nearbyPoints.map((np: any) => ({
            projectId: createdProject.id,
            type: np.type || 'OTHER',
            name: np.name,
            distanceKm: typeof np.distanceKm === 'number' ? np.distanceKm : null,
            travelTimeMin: typeof np.travelTimeMin === 'number' ? np.travelTimeMin : null,
          })),
        });
      }

      // 13. Create units (if provided)
      if (Array.isArray(units) && units.length > 0) {
        await tx.unit.createMany({
          data: units.map((u: any) => ({
            projectId: createdProject.id,
            configurationId: u.configurationId || null,
            unitNumber: u.unitNumber,
            type: u.type || 'RETAIL',
            floor: u.floor,
            areaSqFt: u.areaSqFt,
            frontageFt: typeof u.frontageFt === 'number' ? u.frontageFt : null,
            ceilingHeightFt: typeof u.ceilingHeightFt === 'number' ? u.ceilingHeightFt : null,
            fitOutStatus: u.fitOutStatus || null,
            nearAnchor: u.nearAnchor || false,
            isCorner: u.isCorner || false,
            visibilityScore: typeof u.visibilityScore === 'number' ? u.visibilityScore : null,
            ventilationReady: typeof u.ventilationReady === 'boolean' ? u.ventilationReady : null,
            priceTotal: typeof u.priceTotal === 'number' ? u.priceTotal : null,
            ratePsf: typeof u.ratePsf === 'number' ? u.ratePsf : null,
            leaseModel: u.leaseModel || null,
            lockInMonths: typeof u.lockInMonths === 'number' ? u.lockInMonths : null,
            escalationPct: typeof u.escalationPct === 'number' ? u.escalationPct : null,
            availability: u.availability || 'AVAILABLE',
            notes: u.notes || null,
          })),
        });
      }

      return createdProject;
    });

    // Trigger revalidation for the new project page
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: `/projects/${result.slug}` })
      });
      console.log(`Triggered revalidation for new project: /projects/${result.slug}`);
    } catch (revalidateError) {
      console.warn('Failed to trigger revalidation for new project:', revalidateError);
    }

    return NextResponse.json({ 
      success: true, 
      project: result,
      message: 'Project imported successfully with all related data'
    }, { status: 201 });

  } catch (error) {
    console.error('Import project error:', error);
    return NextResponse.json({ 
      error: 'Failed to import project', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
