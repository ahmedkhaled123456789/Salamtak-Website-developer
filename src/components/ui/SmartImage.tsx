import { useEffect, useRef, useState } from 'react';
import { ImageOffIcon } from 'lucide-react';
import { imageWidths, SMALL_IMAGE_WIDTH } from '../../data/imageWidths';
import { cn } from '../../utils/cn';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Above-the-fold image (the page's LCP candidate): eager + high fetch priority. Use once per page. */
  priority?: boolean;
  position?: string;
  /** Rendered width hint for the responsive variants, e.g. "(min-width: 1024px) 33vw, 100vw". */
  sizes?: string;
}

/** `/<name>.jpg` photos from public/ have generated WebP variants (scripts/optimize-images.py). */
function webpSrcSet(src: string): string | undefined {
  const name = /^\/([\w-]+)\.jpg$/.exec(src)?.[1];
  const width = name ? imageWidths[name] : undefined;
  if (!name || !width) return undefined;
  return width > SMALL_IMAGE_WIDTH ?
  `/${name}-${SMALL_IMAGE_WIDTH}.webp ${SMALL_IMAGE_WIDTH}w, /${name}.webp ${width}w` :
  `/${name}.webp ${width}w`;
}

/** Lazy image with a soft placeholder and graceful fallback when loading fails. */
export function SmartImage({ src, alt, className, imgClassName, priority = false, position = 'center', sizes = '100vw' }: SmartImageProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const ref = useRef<HTMLImageElement>(null);
  // loaded before React attached onLoad (prerendered HTML or cache): onLoad will never fire
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setState('loaded');
  }, [src]);
  const srcSet = webpSrcSet(src);
  // React 18 only knows the lowercase attribute.
  const fetchPriority = priority ? { fetchpriority: 'high' } as Record<string, string> : undefined;
  const img =
  <img
    ref={ref}
    src={src}
    alt={alt}
    loading={priority ? 'eager' : 'lazy'}
    decoding={priority ? 'auto' : 'async'}
    {...fetchPriority}
    onLoad={() => setState('loaded')}
    onError={() => setState('error')}
    style={{ objectPosition: position }}
    className={cn(
      'h-full w-full object-cover transition-opacity duration-300 ease-out',
      // the LCP image is never hidden behind a fade-in
      state === 'loaded' || priority ? 'opacity-100' : 'opacity-0',
      imgClassName
    )} />;

  return (
    <div className={cn('relative overflow-hidden bg-mint/50', className)}>
      {state !== 'error' && (
      srcSet ?
      <picture>
            <source type="image/webp" srcSet={srcSet} sizes={sizes} />
            {img}
          </picture> :
      img)
      }
      {state === 'error' &&
      <div className="absolute inset-0 flex items-center justify-center text-brand/50" role="img" aria-label={alt}>
          <ImageOffIcon className="h-7 w-7" aria-hidden />
        </div>
      }
    </div>);

}
