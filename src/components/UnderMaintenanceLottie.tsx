'use client';

import { useEffect, useRef } from 'react';

interface UnderMaintenanceLottieProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function UnderMaintenanceLottie({ 
  width = 200, 
  height = 200, 
  className = '' 
}: UnderMaintenanceLottieProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationInstance: any = null;

    const loadLottie = async () => {
      try {
        // Dynamically import lottie-web to avoid SSR issues
        const lottie = (await import('lottie-web')).default;
        
        if (containerRef.current) {
          animationInstance = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/lottee/Under Maintenance.lottie'
          });
        }
      } catch (error) {
        console.error('Failed to load Under Maintenance Lottie animation:', error);
      }
    };

    loadLottie();

    return () => {
      if (animationInstance) {
        animationInstance.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`inline-block ${className}`}
      style={{ width, height }}
    />
  );
}