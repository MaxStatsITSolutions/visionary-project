import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { colors, fonts, width } from '../theme/tokens';
import { interiorSrc } from '../content/media';
import { beforeImage } from '../content/styles';
import { reducedMotion } from './engine';

const MIN_MS = 1100;
const MAX_MS = 2600;

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}

/**
 * Intro curtain. The counter follows real loading (fonts + the first room
 * photo) and is capped so a slow network never blocks the page. Skipped
 * entirely with reduced motion. Content underneath is in the DOM from the
 * start, so it is readable by assistive tech and crawlers immediately.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'gone'>(() => (reducedMotion() ? 'gone' : 'loading'));
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onDone);

  useEffect(() => {
    if (phase === 'gone') doneRef.current();
  }, [phase]);

  useEffect(() => {
    if (phase !== 'loading') return;
    const startedAt = performance.now();
    let loaded = 0;
    const tasks = [
      document.fonts?.ready.then(() => undefined) ?? Promise.resolve(),
      preload(interiorSrc(beforeImage, window.innerWidth > 900 ? 1600 : 800)),
    ];
    tasks.forEach((t) => t.then(() => (loaded += 1)));

    let shown = 0;
    let raf = 0;
    const loop = (now: number) => {
      const elapsed = now - startedAt;
      const real = loaded / tasks.length;
      // Never run ahead of real loading by more than the time budget allows.
      const time = Math.min(1, elapsed / MIN_MS);
      const target = elapsed > MAX_MS ? 1 : Math.min(time, 0.15 + real * 0.85);
      shown += (target - shown) * 0.12;
      if (target === 1 && 1 - shown < 0.004) shown = 1;
      const pct = Math.round(shown * 100);
      if (countRef.current) countRef.current.textContent = String(pct).padStart(3, '0');
      if (barRef.current) barRef.current.style.transform = `scaleX(${shown})`;
      if (shown >= 1) {
        setPhase('leaving');
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = '';
    };
  }, [phase]);

  // The page starts animating while the curtain is still lifting.
  useEffect(() => {
    if (phase !== 'leaving') return;
    const reveal = window.setTimeout(() => doneRef.current(), 250);
    const t = window.setTimeout(() => setPhase('gone'), 1000);
    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(t);
    };
  }, [phase]);

  if (phase === 'gone') return null;

  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        bgcolor: colors.ink,
        color: colors.canvas,
        display: 'grid',
        gridTemplateRows: '1fr auto',
        px: { xs: 2.5, md: 6 },
        py: { xs: 3, md: 5 },
        clipPath: phase === 'leaving' ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)',
        transition: 'clip-path 1000ms cubic-bezier(0.76, 0, 0.24, 1)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ fontFamily: fonts.display, fontVariationSettings: width(100), fontWeight: 700, letterSpacing: '0.32em', fontSize: '0.95rem' }}>VISIONARY</Box>
        <Box sx={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.6, textAlign: 'right' }}>
          Plotting sheet A-101
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gap: 2 }}>
        <Box
          component="span"
          ref={countRef}
          sx={{
            fontFamily: fonts.display,
            fontVariationSettings: width(62),
            fontWeight: 650,
            fontSize: 'clamp(5rem, 22vw, 20rem)',
            lineHeight: 0.8,
            letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums',
            transform: phase === 'leaving' ? 'translateY(-30%)' : 'none',
            opacity: phase === 'leaving' ? 0 : 1,
            transition: 'transform 900ms cubic-bezier(0.76, 0, 0.24, 1), opacity 600ms',
          }}
        >
          000
        </Box>
        <Box sx={{ height: '1px', bgcolor: 'rgba(244,241,234,0.2)', position: 'relative' }}>
          <Box ref={barRef} sx={{ position: 'absolute', inset: 0, bgcolor: colors.copper, transformOrigin: 'left', transform: 'scaleX(0)' }} />
        </Box>
      </Box>
    </Box>
  );
}
