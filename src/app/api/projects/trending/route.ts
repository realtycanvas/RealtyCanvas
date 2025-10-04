import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureDatabaseConnection } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Ensure database connection is available
    const isConnected = await ensureDatabaseConnection(3);
    if (!isConnected) {
      console.error('Database connection failed for trending projects');
      // Return fallback data when database is unavailable
      return NextResponse.json([]);
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const days = parseInt(searchParams.get('days') || '7'); // Default to last 7 days

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get trending projects based on clicks in the specified time period
    const trendingProjects = await prisma.project.findMany({
      where: {
        OR: [
          {
            // Projects with recent clicks
            projectClicks: {
              some: {
                clickDate: {
                  gte: startDate,
                  lte: endDate
                }
              }
            }
          },
          {
            // Projects manually marked as trending
            isTrending: true
          }
        ]
      },
      include: {
        projectClicks: {
          where: {
            clickDate: {
              gte: startDate,
              lte: endDate
            }
          }
        }
      },
      orderBy: [
        {
          isTrending: 'desc' // Manually trending projects first
        },
        {
          totalClicks: 'desc' // Then by total clicks
        },
        {
          createdAt: 'desc' // Then by newest
        }
      ],
      take: limit
    });

    // Calculate trending score for each project
    const projectsWithScore = trendingProjects.map(project => {
      const recentClicks = project.projectClicks.reduce(
        (sum, click) => sum + click.clickCount, 
        0
      );
      
      // Calculate trending score (recent clicks + manual trending boost)
      const trendingScore = recentClicks + (project.isTrending ? 1000 : 0);
      
      return {
        ...project,
        recentClicks,
        trendingScore,
        // Remove the clicks data from response
        projectClicks: undefined
      };
    });

    // Sort by trending score
    projectsWithScore.sort((a, b) => b.trendingScore - a.trendingScore);

    return NextResponse.json(projectsWithScore);
  } catch (error) {
    console.error('Error fetching trending projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}