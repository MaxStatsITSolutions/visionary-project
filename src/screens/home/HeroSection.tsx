import { useRef, type CSSProperties } from 'react';
import { Box, Button, Typography } from '@mui/material';
import type { Navigate } from '../../types/navigation';
import { colors, layout } from '../../theme/tokens';
import { interiorSrc } from '../../content/media';
import { Reveal } from '../../components/common/Reveal';
import { Section } from '../../components/layout/Section';
import { gridSx } from '../../components/layout/grid';
import { Parallax } from '../../motion/Parallax';
import { useFrame } from '../../motion/useFrame';
import { useIntroDone } from '../../motion/IntroContext';
import { clamp, damp } from '../../motion/engine';

/** Cropped "material samples" cut from our own concept photos (source 1536×1024). */
const SAMPLES = [
  { image: 'industrial', label: 'Brick', style: 'Industrial', crop: [1240, 280, 230, 300], w: 156, pos: { top: '-2%', right: '1%' }, speed: -0.12, pointer: 10, tilt: 0.8 },
  { image: 'japandi', label: 'Washi paper', style: 'Japandi', crop: [318, 450, 86, 300], w: 74, pos: { top: '-8%', left: '50%' }, speed: 0.22, pointer: 16, tilt: -1 },
  { image: 'mid-century', label: 'Velvet', style: 'Mid-century', crop: [560, 610, 300, 170], w: 190, pos: { top: '30%', left: '58%' }, speed: -0.28, pointer: 20, tilt: 1.2 },
  { image: 'mediterranean', label: 'Terracotta', style: 'Mediterranean', crop: [1120, 860, 300, 160], w: 170, pos: { bottom: '-12%', left: '49%' }, speed: 0.35, pointer: 12, tilt: -0.6 },
  { image: 'wabi-sabi', label: 'Lime plaster', style: 'Wabi-sabi', crop: [20, 90, 220, 220], w: 118, pos: { top: '-6%', left: '69%' }, speed: -0.45, pointer: 24, tilt: 1 },
] as const;

function sampleBackground([x, y, w, h]: readonly number[]) {
  return {
    backgroundSize: `${(1536 / w!) * 100}% auto`,
    backgroundPosition: `${(x! / (1536 - w!)) * 100}% ${(y! / (1024 - h!)) * 100}%`,
    aspectRatio: `${w} / ${h}`,
  };
}

function Chars({ text, start, play }: { text: string; start: number; play: boolean }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          aria-hidden
          style={
            {
              display: 'inline-block',
              whiteSpace: 'pre',
              transform: play ? 'none' : 'translateY(115%) rotate(7deg)',
              transformOrigin: '0 100%',
              transition: `transform 1.1s var(--ease) ${start + i * 32}ms`,
            } as CSSProperties
          }
        >
          {ch}
        </span>
      ))}
    </>
  );
}

export function HeroSection({ onNavigate }: { onNavigate: Navigate }) {
  const play = useIntroDone();
  const line1 = useRef<HTMLSpanElement>(null);
  const line2 = useRef<HTMLSpanElement>(null);
  const before = useRef<HTMLSpanElement>(null);
  const weight = useRef(300);

  // Lines drift apart as you leave the hero; "before" gains weight.
  useFrame(({ scrollY, viewport, dt }) => {
    if (scrollY > viewport.h * 1.5) return;
    const p = clamp(scrollY / (viewport.h * 0.9));
    if (line1.current) line1.current.style.transform = `translate3d(${-p * 8}vw, 0, 0)`;
    if (line2.current) line2.current.style.transform = `translate3d(${p * 5}vw, 0, 0)`;
    weight.current += (300 + p * 300 - weight.current) * damp(8, dt);
    if (before.current) before.current.style.fontVariationSettings = `'wght' ${weight.current.toFixed(1)}`;
  });

  return (
    <Section
      labelledBy="hero-title"
      sx={{ position: 'relative', pt: `${layout.headerHeight + 40}px`, pb: { xs: 6, md: 8 }, overflow: 'clip' }}
    >
      <Reveal sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: { xs: 4, md: 6 } }}>
        <Typography variant="overline" color="text.secondary">
          (01) AI home transformation
        </Typography>
        <Typography variant="overline" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Architectural calm × computational imagination
        </Typography>
      </Reveal>

      <Box sx={{ ...gridSx, alignItems: 'end', rowGap: 4, position: 'relative', minHeight: { md: 'min(58vh, 560px)' } }}>
        {/* Material samples, behind the type */}
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, display: { xs: 'none', md: 'block' }, pointerEvents: 'none' }}>
          {SAMPLES.map((s, i) => (
            <Parallax key={s.label} anchor="top" speed={s.speed} pointer={s.pointer} tilt={s.tilt} sx={{ position: 'absolute', width: s.w, ...s.pos }}>
              <Box
                sx={{
                  transform: play ? 'none' : 'translateY(40px) scale(0.85)',
                  opacity: play ? 1 : 0,
                  transition: `transform 1.4s var(--ease) ${600 + i * 120}ms, opacity 1s ${600 + i * 120}ms`,
                }}
              >
                <Box
                  sx={{
                    ...sampleBackground(s.crop),
                    backgroundImage: play ? `url(${interiorSrc(s.image, 1600)})` : 'none',
                    backgroundColor: colors.limestone,
                    borderRadius: '2px',
                    boxShadow: '0 24px 50px -24px rgba(25,27,26,0.45)',
                    clipPath: play ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
                    transition: `clip-path 1.2s var(--ease) ${700 + i * 120}ms`,
                  }}
                />
                <Typography variant="overline" sx={{ display: 'block', mt: 1, fontSize: '0.62rem', color: colors.inkSoft, lineHeight: 1.3 }}>
                  {s.label}
                  <Box component="span" sx={{ display: 'block', opacity: 0.6 }}>
                    {s.style}
                  </Box>
                </Typography>
              </Box>
            </Parallax>
          ))}
        </Box>

        <Box
          component="h1"
          id="hero-title"
          aria-label="See the room before it exists."
          className="is-in"
          sx={(theme) => ({ ...theme.typography.h1, m: 0, position: 'relative', gridColumn: { xs: '1 / -1', md: '1 / span 9' } })}
        >
          <span className="vz-line">
            <span ref={line1} style={{ display: 'inline-block', willChange: 'transform' }}>
              <Chars text="See the room" start={0} play={play} />
            </span>
          </span>
          <span className="vz-line">
            <span ref={line2} style={{ display: 'inline-block', willChange: 'transform' }}>
              <Box component="em" ref={before} sx={{ fontStyle: 'italic', fontWeight: 300, color: colors.copper }}>
                <Chars text="before" start={380} play={play} />
              </Box>
              <Chars text=" it exists." start={570} play={play} />
            </span>
          </span>
        </Box>

        <Box
          sx={{
            gridColumn: { xs: '1 / -1', md: '10 / -1' },
            display: 'grid',
            gap: 3,
            pb: { md: 1.5 },
            position: 'relative',
            opacity: play ? 1 : 0,
            transform: play ? 'none' : 'translateY(24px)',
            transition: 'opacity 1s var(--ease) 900ms, transform 1.2s var(--ease) 900ms',
          }}
        >
          <Typography variant="subtitle1" color="text.secondary">
            A digital interior studio. Pick a direction, compare before and after, and shape a private project around your own room.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Button variant="contained" size="large" onClick={() => onNavigate('studio')} data-cursor="Start">
              Start a project
            </Button>
            <Button variant="outlined" size="large" color="inherit" onClick={() => onNavigate('explore')} data-cursor="Explore">
              Explore
            </Button>
          </Box>
        </Box>
      </Box>
    </Section>
  );
}
