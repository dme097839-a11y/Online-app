import React, { useState } from 'react';
import { Package } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fallbackText,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400 p-3 select-none ${className || ''}`}>
        <Package className="w-8 h-8 stroke-1 text-neutral-400 mb-1 opacity-60" />
        <span className="text-[10px] uppercase font-medium tracking-wider text-neutral-500 text-center line-clamp-1">
          {fallbackText || alt || 'Daraz Nepal'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'Product image'}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      loading="lazy"
      {...props}
    />
  );
};
