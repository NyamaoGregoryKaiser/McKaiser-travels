'use client';

import React from 'react';
import Image from 'next/image';

// Use destination images that are already available in our project
export const getPlaceholderImage = (category: string = 'general') => {
  switch (category) {
    case 'tour':
      return '/images/destination3.png';
    case 'hotel':
      return '/images/destination2.png';
    case 'flight':
      return '/images/destination1.png';
    case 'person':
      return '/images/Rectangle5.png';
    default:
      return '/images/destination4.png';
  }
};

interface FallbackImageProps {
  src: string;
  alt: string;
  category?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export const FallbackImage = ({ 
  src, 
  alt, 
  category = 'general',
  fill = false,
  width, 
  height,
  className = ''
}: FallbackImageProps) => {
  const placeholderSrc = getPlaceholderImage(category);
  
  return (
    <Image
      src={src || placeholderSrc}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      onError={(e) => {
        // If the image fails to load, replace with placeholder
        const target = e.target as HTMLImageElement;
        target.src = placeholderSrc;
      }}
    />
  );
};

export default FallbackImage; 