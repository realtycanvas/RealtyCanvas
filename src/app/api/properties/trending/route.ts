import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const days = parseInt(searchParams.get('days') || '7'); // Default to last 7 days

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get trending properties based on clicks in the specified time period
    const trendingProperties = await prisma.property.findMany({
      where: {
        OR: [
          {
            // Properties with recent clicks
            propertyClicks: {
              some: {
                clickDate: {
                  gte: startDate,
                  lte: endDate
                }
              }
            }
          },
          {
            // Properties manually marked as trending
            isTrending: true
          }
        ]
      },
      include: {
        propertyClicks: {
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
          isTrending: 'desc' // Manually trending properties first
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

    // Calculate trending score for each property
    const propertiesWithScore = trendingProperties.map(property => {
      const recentClicks = property.propertyClicks.reduce(
        (sum, click) => sum + click.clickCount, 
        0
      );
      
      // Calculate trending score (recent clicks + manual trending boost)
      const trendingScore = recentClicks + (property.isTrending ? 1000 : 0);
      
      return {
        ...property,
        recentClicks,
        trendingScore,
        // Remove the clicks data from response
        propertyClicks: undefined
      };
    });

    // Sort by trending score
    propertiesWithScore.sort((a, b) => b.trendingScore - a.trendingScore);

    return NextResponse.json(propertiesWithScore);
  } catch (error) {
    console.error('Error fetching trending properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}