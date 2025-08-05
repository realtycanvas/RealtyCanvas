'use client';

import React from 'react';
import { ShimmerButton, ShimmerButtonProps } from '../magicui/shimmer-button';
import { cn } from '@/lib/utils';

interface BrandButtonProps extends Omit<ShimmerButtonProps, 'background' | 'shimmerColor'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const BrandButton = React.forwardRef<HTMLButtonElement, BrandButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            background: 'linear-gradient(135deg, #feb711, #feb711)',
            shimmerColor: '#ffffff',
            className: 'text-[#14314b] font-medium shadow-lg hover:shadow-xl'
          };
        case 'secondary':
          return {
            background: 'linear-gradient(135deg, #14314b, #14314b)',
            shimmerColor: '#feb711',
            className: 'text-white font-medium shadow-lg hover:shadow-xl'
          };
        case 'outline':
          return {
            background: 'transparent',
            shimmerColor: '#feb711',
            className: 'text-brand-primary border-2 border-brand-primary hover:bg-brand-primary hover:text-brand-secondary font-medium'
          };
        default:
          return {
            background: 'linear-gradient(135deg, #feb711, #feb711)',
            shimmerColor: '#ffffff',
            className: 'text-[#14314b] font-medium shadow-lg hover:shadow-xl'
          };
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return 'px-4 py-2 text-sm';
        case 'md':
          return 'px-6 py-3 text-base';
        case 'lg':
          return 'px-8 py-4 text-lg';
        default:
          return 'px-6 py-3 text-base';
      }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    return (
      <ShimmerButton
        ref={ref}
        background={variantStyles.background}
        shimmerColor={variantStyles.shimmerColor}
        borderRadius="12px"
        shimmerDuration="2s"
        className={cn(
          variantStyles.className,
          sizeStyles,
          'transition-all duration-300 transform hover:scale-105 active:scale-95',
          'no-underline hover:no-underline focus:no-underline active:no-underline',
          className
        )}
        {...props}
      >
        {children}
      </ShimmerButton>
    );
  }
);

BrandButton.displayName = 'BrandButton';