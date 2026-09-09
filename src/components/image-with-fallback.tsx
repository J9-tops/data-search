import { useState, ImgHTMLAttributes, useEffect } from 'react';
import { appendImageDimensions } from '../utils/image';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export default function ImageWithFallback({ src, alt, ...props }: Props) {
  const [error, setError] = useState(false);

  // Reset error state if the src changes
  useEffect(() => {
    setError(false);
  }, [src]);

  // Try the 900x500 dimension first. If that fails, fallback to the original.
  const currentSrc = error ? src : appendImageDimensions(src);

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (!error) {
          setError(true);
        }
      }}
      {...props}
    />
  );
}
