import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const debugInfo: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercel: {
        region: process.env.VERCEL_REGION || 'unknown',
        url: process.env.VERCEL_URL || 'unknown',
        deployment_id: process.env.VERCEL_DEPLOYMENT_ID || 'unknown'
      },
      environment_variables: {
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
        supabase_anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
        supabase_service_key: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
        database_url: process.env.DATABASE_URL ? 'SET' : 'MISSING'
      },
      tests: {}
    };

    // Test 1: Database Connection
    try {
      const projectCount = await prisma.project.count();
      debugInfo.tests.database = {
        status: 'SUCCESS',
        project_count: projectCount
      };
    } catch (error: any) {
      debugInfo.tests.database = {
        status: 'ERROR',
        error: error.message
      };
    }

    // Test 2: Supabase Connection
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        
        const { data, error } = await supabase.storage.listBuckets();
        
        if (error) {
          debugInfo.tests.supabase = {
            status: 'ERROR',
            error: error.message
          };
        } else {
          debugInfo.tests.supabase = {
            status: 'SUCCESS',
            buckets: data?.map(bucket => bucket.name) || []
          };
        }
      } else {
        debugInfo.tests.supabase = {
          status: 'ERROR',
          error: 'Missing Supabase environment variables'
        };
      }
    } catch (error: any) {
      debugInfo.tests.supabase = {
        status: 'ERROR',
        error: error.message
      };
    }

    // Test 3: Get a sample project with images
    try {
      const sampleProject = await prisma.project.findFirst({
        where: {
          OR: [
            { featuredImage: { not: null } },
            { galleryImages: { not: null } },
            { sitePlanImage: { not: null } }
          ]
        },
        select: {
          id: true,
          title: true,
          featuredImage: true,
          galleryImages: true,
          sitePlanImage: true
        }
      });

      if (sampleProject) {
        debugInfo.tests.sample_project = {
          status: 'SUCCESS',
          project: {
            id: sampleProject.id,
            title: sampleProject.title,
            has_featured_image: !!sampleProject.featuredImage,
            has_gallery_images: !!sampleProject.galleryImages,
            has_site_plan: !!sampleProject.sitePlanImage,
            featured_image_url: sampleProject.featuredImage,
            gallery_count: sampleProject.galleryImages ? JSON.parse(sampleProject.galleryImages).length : 0
          }
        };

        // Test 4: Image URL accessibility
        if (sampleProject.featuredImage) {
          try {
            const response = await fetch(sampleProject.featuredImage, { method: 'HEAD' });
            debugInfo.tests.image_accessibility = {
              status: response.ok ? 'SUCCESS' : 'ERROR',
              http_status: response.status,
              headers: Object.fromEntries(response.headers.entries()),
              url_tested: sampleProject.featuredImage
            };
          } catch (error: any) {
            debugInfo.tests.image_accessibility = {
              status: 'ERROR',
              error: error.message,
              url_tested: sampleProject.featuredImage
            };
          }
        }
      } else {
        debugInfo.tests.sample_project = {
          status: 'ERROR',
          error: 'No projects with images found'
        };
      }
    } catch (error: any) {
      debugInfo.tests.sample_project = {
        status: 'ERROR',
        error: error.message
      };
    }

    // Test 5: Supabase Storage Bucket Access
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        
        // Try to list files in the property-images bucket
        const { data, error } = await supabase.storage
          .from('property-images')
          .list('', { limit: 5 });
        
        if (error) {
          debugInfo.tests.storage_bucket = {
            status: 'ERROR',
            error: error.message
          };
        } else {
          debugInfo.tests.storage_bucket = {
            status: 'SUCCESS',
            file_count: data?.length || 0,
            sample_files: data?.slice(0, 3).map(file => file.name) || []
          };
        }
      }
    } catch (error: any) {
      debugInfo.tests.storage_bucket = {
        status: 'ERROR',
        error: error.message
      };
    }

    // Test 6: Network and DNS
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) {
        const response = await fetch(supabaseUrl + '/rest/v1/', { method: 'HEAD' });
        debugInfo.tests.network = {
          status: response.ok ? 'SUCCESS' : 'ERROR',
          http_status: response.status,
          supabase_reachable: response.ok
        };
      }
    } catch (error: any) {
      debugInfo.tests.network = {
        status: 'ERROR',
        error: error.message
      };
    }

    return NextResponse.json(debugInfo, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Debug API failed',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}