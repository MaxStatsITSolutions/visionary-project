import { useSyncExternalStore } from 'react';
import { MOTION_EVENT, isMotionReduced } from '../motion/preference';

function subscribe(callback: () => void) {
  window.addEventListener(MOTION_EVENT, callback);
  return () => window.removeEventListener(MOTION_EVENT, callback);
}

/** Reduced motion from the OS setting or the site's Motion toggle. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, isMotionReduced, () => false);
}
