'use client';

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface PreloaderProps {
  isLoading?: boolean;
  onComplete?: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ isLoading = true, onComplete }) => {
  if (!isLoading) return null;

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center relative">
        {/* Action Buttons */}
       
        
        <DotLottieReact
          src="/lottee/City Building Construction.lottie"
          loop
          autoplay
          className="w-64 h-64 md:w-80 md:h-80"
        />
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Realty Canvas
          </h2>
          <p className="text-gray-600 dark:text-gray-400 animate-pulse">
            Loading your premium projects...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;