import { useEffect, useRef } from 'react';
import { subscribe, type FrameState } from './engine';

/** Subscribe a component to the shared animation loop. */
export function useFrame(callback: (state: FrameState) => void) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  });
  useEffect(() => subscribe((s) => saved.current(s)), []);
}
