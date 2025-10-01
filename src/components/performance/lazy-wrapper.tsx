'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  id?: string;
  priority?: boolean; // Pour le above-the-fold content
}

export function LazyWrapper({
  children,
  fallback,
  rootMargin = '50px',
  threshold = 0.1,
  className,
  id,
  priority = false,
}: LazyWrapperProps) {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || inView) {
      setIsLoaded(true);
    }
  }, [priority, inView]);

  const handleError = () => {
    setHasError(true);
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoaded(true);
  };

  return (
    <div ref={ref} className={className} id={id}>
      {isLoaded && !hasError ? (
        <div ref={contentRef} onError={handleError}>
          {children}
        </div>
      ) : hasError ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-muted-foreground mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm">Erreur lors du chargement du contenu</p>
          </div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      ) : (
        fallback || (
          <div className="animate-pulse">
            <div className="bg-muted rounded-lg p-4">
              <div className="space-y-3">
                <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
                <div className="h-32 bg-muted-foreground/20 rounded"></div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

// Hook pour le lazy loading avec prefetch
export function useLazyLoad(options: {
  distance?: number;
  triggerOnce?: boolean;
  onLoad?: () => void;
} = {}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: `${options.distance || 100}px`,
    triggerOnce: options.triggerOnce ?? true,
  });

  useEffect(() => {
    if (inView && !isLoaded) {
      setIsLoaded(true);
      options.onLoad?.();
    }
  }, [inView, isLoaded, options]);

  return { ref, isLoaded, inView };
}

// Composant pour les images lazy loading
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  blurDataURL?: string;
}

export function LazyImage({
  src,
  alt,
  placeholder,
  blurDataURL,
  className,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {inView && (
        <>
          {/* Placeholder avec blur */}
          {!isLoaded && !hasError && (
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
              style={{
                backgroundImage: blurDataURL ? `url(${blurDataURL})` : placeholder ? `url(${placeholder})` : undefined,
              }}
            />
          )}

          {/* Image principale */}
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            {...props}
          />

          {/* Image de secours en cas d'erreur */}
          {hasError && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </>
      )}
    </div>
  );
}