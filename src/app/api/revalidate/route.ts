import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, tag } = body;

    // Validate the request
    if (!path && !tag) {
      return NextResponse.json(
        { error: 'Either path or tag is required' },
        { status: 400 }
      );
    }

    // Revalidate by path (for specific pages)
    if (path) {
      revalidatePath(path);
      console.log(`Revalidated path: ${path}`);
    }

    // Revalidate by tag (for tagged data)
    if (tag) {
      revalidateTag(tag, "max");
      console.log(`Revalidated tag: ${tag}`);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path,
      tag
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}