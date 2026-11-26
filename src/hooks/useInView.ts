import { useEffect, useRef, useState } from 'react';

/**
 * Flags an element once it scrolls into view (one-shot).
 */
export function useInView<T extends Element>(options: { threshold?: number; rootMargin?: string } = {}) {
  const ref = useRef<T | null>(null);
  // Without IntersectionObserver support, show content immediately.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');
  const { threshold = 0.2, rootMargin = '0px 0px -8% 0px' } = options;

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}
