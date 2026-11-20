import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { colors, motion } from '../../theme/tokens';

type BeforeAfterSliderProps = {
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  /** Accessible name of the comparison handle. */
  label: string;
  initial?: number;
  aspectRatio?: string;
};

const clamp = (v: number) => Math.min(100, Math.max(0, v));

/**
 * Before/after comparison (§7, §15). Pointer drag anywhere on the frame,
 * touch-friendly, and a real `role="slider"` handle with arrow / Home / End /
 * PageUp / PageDown keys and aria values.
 */
export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  label,
  initial = 50,
  aspectRatio = '16 / 10',
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPos(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setFromClientX(e.clientX);
    handleRef.current?.focus({ preventScroll: true });
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) setFromClientX(e.clientX);
  };
  const endDrag = () => setDragging(false);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    const next: Record<string, number> = {
      ArrowLeft: pos - step,
      ArrowDown: pos - step,
      ArrowRight: pos + step,
      ArrowUp: pos + step,
      PageDown: pos - 10,
      PageUp: pos + 10,
      Home: 0,
      End: 100,
    };
    if (e.key in next) {
      e.preventDefault();
      setPos(clamp(next[e.key]!));
    }
  };

  const tag = {
    position: 'absolute',
    top: { xs: 12, md: 20 },
    px: 1.5,
    py: 0.5,
    borderRadius: 0,
    bgcolor: 'rgba(244, 241, 234, 0.86)',
    backdropFilter: 'blur(6px)',
    color: colors.ink,
    pointerEvents: 'none',
    transition: `opacity ${motion.fast}ms ${motion.ease}`,
  } as const;

  return (
    <Box
      ref={frameRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      sx={{
        position: 'relative',
        aspectRatio,
        overflow: 'hidden',
        borderRadius: 1,
        bgcolor: colors.limestone,
        cursor: dragging ? 'grabbing' : 'ew-resize',
        touchAction: 'pan-y',
        userSelect: 'none',
        isolation: 'isolate',
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0 }}>{before}</Box>
      <Box
        sx={{ position: 'absolute', inset: 0, willChange: 'clip-path' }}
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      >
        {after}
      </Box>

      <Typography variant="overline" sx={{ ...tag, left: { xs: 12, md: 20 }, opacity: pos < 12 ? 0 : 1 }} aria-hidden>
        {beforeLabel}
      </Typography>
      <Typography variant="overline" sx={{ ...tag, right: { xs: 12, md: 20 }, opacity: pos > 88 ? 0 : 1 }} aria-hidden>
        {afterLabel}
      </Typography>

      {/* Divider line + handle */}
      <Box
        aria-hidden
        sx={{ position: 'absolute', top: 0, bottom: 0, width: '1px', bgcolor: colors.canvas, boxShadow: '0 0 0 0.5px rgba(25,27,26,0.25)' }}
        style={{ left: `${pos}%` }}
      />
      <Box
        ref={handleRef}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% ${beforeLabel.toLowerCase()}, ${100 - Math.round(pos)}% ${afterLabel.toLowerCase()}`}
        onKeyDown={onKeyDown}
        sx={{
          position: 'absolute',
          top: '50%',
          width: { xs: 52, md: 64 },
          height: { xs: 52, md: 64 },
          ml: { xs: '-26px', md: '-32px' },
          mt: { xs: '-26px', md: '-32px' },
          borderRadius: 0,
          border: `1px solid ${colors.ink}`,
          bgcolor: colors.canvas,
          color: colors.ink,
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 10px 30px -10px rgba(25,27,26,0.45)',
          transition: `transform ${motion.fast}ms ${motion.ease}, background-color ${motion.fast}ms ${motion.ease}`,
          transform: dragging ? 'scale(0.92)' : 'none',
          '&:hover': { transform: 'scale(1.06)' },
          '&:focus-visible': { outline: `2px solid ${colors.copper}`, outlineOffset: 4 },
        }}
        style={{ left: `${pos}%` }}
      >
        <svg width="26" height="14" viewBox="0 0 26 14" aria-hidden>
          <path d="M7 1 1 7l6 6M19 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Box>
    </Box>
  );
}
