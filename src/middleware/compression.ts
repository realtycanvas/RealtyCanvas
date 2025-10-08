import { NextRequest, NextResponse } from 'next/server';
import { gzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);

/**
 * Compression middleware for API responses
 * Compresses responses larger than 1KB to improve performance
 */
export async function withCompression<T extends any[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    const response = await handler(req, ...args);
    
    // Only compress if client accepts gzip
    const acceptEncoding = req.headers.get('accept-encoding') || '';
    if (!acceptEncoding.includes('gzip')) {
      return response;
    }
    
    // Only compress JSON responses
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return response;
    }
    
    try {
      const originalBody = await response.text();
      
      // Only compress if response is larger than 1KB
      if (originalBody.length < 1024) {
        return new NextResponse(originalBody, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      }
      
      // Compress the response
      const compressedBody = await gzipAsync(Buffer.from(originalBody, 'utf-8'));
      
      // Create new response with compressed body
      const compressedResponse = new NextResponse(compressedBody, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      
      // Set compression headers
      compressedResponse.headers.set('Content-Encoding', 'gzip');
      compressedResponse.headers.set('Content-Length', compressedBody.length.toString());
      compressedResponse.headers.set('Vary', 'Accept-Encoding');
      
      // Add compression ratio for monitoring
      const compressionRatio = ((originalBody.length - compressedBody.length) / originalBody.length * 100).toFixed(1);
      compressedResponse.headers.set('X-Compression-Ratio', `${compressionRatio}%`);
      compressedResponse.headers.set('X-Original-Size', originalBody.length.toString());
      compressedResponse.headers.set('X-Compressed-Size', compressedBody.length.toString());
      
      return compressedResponse;
    } catch (error) {
      console.error('Compression error:', error);
      // Return original response if compression fails
      return response;
    }
  };
}

/**
 * Simple compression utility for manual use
 */
export async function compressResponse(data: any): Promise<{
  compressed: Buffer;
  originalSize: number;
  compressedSize: number;
  ratio: number;
}> {
  const originalData = JSON.stringify(data);
  const originalSize = Buffer.byteLength(originalData, 'utf-8');
  
  const compressed = await gzipAsync(Buffer.from(originalData, 'utf-8'));
  const compressedSize = compressed.length;
  const ratio = ((originalSize - compressedSize) / originalSize * 100);
  
  return {
    compressed,
    originalSize,
    compressedSize,
    ratio
  };
}

/**
 * Check if request supports compression
 */
export function supportsCompression(req: NextRequest): boolean {
  const acceptEncoding = req.headers.get('accept-encoding') || '';
  return acceptEncoding.includes('gzip') || acceptEncoding.includes('deflate');
}