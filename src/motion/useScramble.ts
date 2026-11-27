import { useEffect, useRef } from 'react';
import { reducedMotion } from './engine';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-+×→';

/**
 * CAD-style "decode": when `text` changes, characters cycle through glyphs
 * and settle left to right into the new text. The element's text is owned
 * by this hook (render the element empty), so React never fights over it.
 */
export function useScramble<T extends Element>(text: string, { duration = 650, delay = 0 } = {}) {
  const ref = useRef<T>(null);
  const shown = useRef<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from = shown.current;
    shown.current = text;
    if (from === null || from === text || reducedMotion()) {
      el.textContent = text;
      return;
    }
    const len = Math.max(from.length, text.length);
    const start = performance.now() + delay;
    let raf = 0;
    const tick = (now: number) => {
      const t = (now - start) / duration;
      if (t >= 1) {
        el.textContent = text;
        return;
      }
      if (t >= 0) {
        let out = '';
        for (let i = 0; i < len; i++) {
          const target = text[i] ?? '';
          const settleAt = 0.25 + (i / len) * 0.75;
          if (t >= settleAt) out += target;
          else if (target === ' ') out += ' ';
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text, duration, delay]);

  return ref;
}
