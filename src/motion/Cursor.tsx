import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { colors } from '../theme/tokens';
import { damp, reducedMotion } from './engine';
import { useFrame } from './useFrame';

/**
 * Cursor companion for fine pointers. The native cursor stays visible
 * (accessibility); the ring trails it and grows over interactive elements.
 * Elements can name the action with `data-cursor="Drag"` etc.
 */
export function Cursor() {
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion(),
  );
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pos = useRef({ x: -100, y: -100, s: 1 });
  const target = useRef({ s: 1, text: '' });

  useEffect(() => {
    if (!enabled) return;
    const over = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.('[data-cursor], a, button, [role="slider"], [role="radio"]');
      const text = el?.getAttribute('data-cursor') ?? '';
      target.current = { s: el ? (text ? 3.4 : 1.9) : 1, text };
      if (label.current && label.current.textContent !== text) label.current.textContent = text;
    };
    window.addEventListener('pointerover', over, { passive: true });
    return () => window.removeEventListener('pointerover', over);
  }, [enabled]);

  useFrame(({ pointerPx, dt }) => {
    const el = ring.current;
    if (!el) return;
    const p = pos.current;
    const k = damp(14, dt);
    p.x += (pointerPx.x - p.x) * k;
    p.y += (pointerPx.y - p.y) * k;
    p.s += (target.current.s - p.s) * damp(10, dt);
    el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${p.s.toFixed(3)})`;
    if (label.current) label.current.style.opacity = target.current.text ? '1' : '0';
  });

  if (!enabled) return null;
  return (
    <Box
      ref={ring}
      aria-hidden
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 2500,
        width: 22,
        height: 22,
        borderRadius: '50%',
        border: `1px solid ${colors.copper}`,
        bgcolor: 'rgba(184,121,87,0.08)',
        pointerEvents: 'none',
        display: 'grid',
        placeItems: 'center',
        backdropFilter: 'blur(1px)',
      }}
    >
      <Box
        component="span"
        ref={label}
        sx={{
          fontSize: '3px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: colors.ink,
          fontWeight: 600,
          transition: 'opacity 200ms',
          opacity: 0,
        }}
      />
    </Box>
  );
}
