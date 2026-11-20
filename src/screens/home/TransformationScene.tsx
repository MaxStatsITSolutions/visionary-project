import { useEffect, useRef, useState, type RefObject } from 'react';
import { Box, Typography } from '@mui/material';
import { beforeImage, stylesWithImages } from '../../content/styles';
import { colors, layout } from '../../theme/tokens';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { InteriorImage } from '../../components/common/InteriorImage';
import { SectionLabel } from '../../components/common/SectionLabel';
import { Section } from '../../components/layout/Section';
import { gridSx } from '../../components/layout/grid';
import { useScramble } from '../../motion/useScramble';

// The window is the one element that never moves between the photos
// (source 1536×1024). Each new style grows out of it.
const SRC = { w: 1536, h: 1024 };
const WINDOW = { x0: 517, y0: 293, x1: 1053, y1: 571 };

const STEPS = stylesWithImages.length;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Where the source window lands inside a cover-fitted box of size w×h. */
function windowRect(w: number, h: number) {
  const s = Math.max(w / SRC.w, h / SRC.h);
  const ox = (w - SRC.w * s) / 2;
  const oy = (h - SRC.h * s) / 2;
  return {
    left: ox + WINDOW.x0 * s,
    top: oy + WINDOW.y0 * s,
    right: w - (ox + WINDOW.x1 * s),
    bottom: h - (oy + WINDOW.y1 * s),
  };
}

/**
 * Scroll-scrubbed "renovation" (§7: IntersectionObserver-free, rAF + one
 * passive scroll listener, styles written straight to the DOM).
 * Phase 0: the empty room opens from a framed print to full bleed and is
 * annotated like a survey drawing. Phases 1..n: each direction grows out of
 * the window frame and takes over the room.
 */
export function TransformationScene() {
  const reduced = usePrefersReducedMotion();
  return reduced ? <StaticTransformation /> : <ScrubbedTransformation />;
}

function ScrubbedTransformation() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const surveyRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1); // -1 = before
  const activeRef = useRef(-1);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = rect.height - vh;
      const p = clamp01(-rect.top / scrollable);
      const t = p * (STEPS + 1); // 0..1 intro, then one unit per style
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const win = windowRect(w, h);

      // Phase 0: framed print -> full bleed.
      const open = easeInOut(clamp01(t / 0.7));
      const insetX = lerp(Math.min(w * 0.12, 180), 0, open);
      const insetY = lerp(Math.min(h * 0.1, 90), 0, open);
      stage.style.clipPath = `inset(${insetY}px ${insetX}px)`;

      // Survey annotations: in during the intro, out as the first style arrives.
      const surveyIn = clamp01((t - 0.45) / 0.35);
      const surveyOut = clamp01((t - 1) / 0.35);
      const survey = surveyRef.current;
      if (survey) {
        survey.style.opacity = String(surveyIn * (1 - surveyOut));
        survey.style.setProperty('--draw', String(surveyIn));
      }
      // Copy waits until the frame is (almost) full bleed, so it is never clipped.
      if (copyRef.current) copyRef.current.style.opacity = String(clamp01((open - 0.6) / 0.4));
      const intro = introRef.current;
      if (intro) intro.style.opacity = String(1 - clamp01((t - 0.85) / 0.25));

      // The window portal outline tracks the window at all times.
      const portal = portalRef.current;
      if (portal) {
        portal.style.transform = `translate(${win.left}px, ${win.top}px)`;
        portal.style.width = `${w - win.left - win.right}px`;
        portal.style.height = `${h - win.top - win.bottom}px`;
      }

      let current = -1;
      for (let i = 0; i < STEPS; i++) {
        const u = easeInOut(clamp01(t - 1 - i));
        const layer = layerRefs.current[i];
        const img = imageRefs.current[i];
        if (!layer) continue;
        if (u <= 0) {
          layer.style.visibility = 'hidden';
          continue;
        }
        layer.style.visibility = 'visible';
        layer.style.clipPath = `inset(${lerp(win.top, 0, u)}px ${lerp(win.right, 0, u)}px ${lerp(win.bottom, 0, u)}px ${lerp(win.left, 0, u)}px)`;
        if (img) img.style.transform = `scale(${lerp(1.12, 1, u)})`;
        if (u > 0.5) current = i;
      }
      if (portal) {
        // Portal glows while a style is mid-transition.
        const local = t - 1 - Math.floor(Math.max(0, t - 1));
        const mid = t > 1 && t < STEPS + 1 ? Math.sin(Math.PI * clamp01(local / 0.6)) : 0;
        portal.style.opacity = String(Math.max(surveyIn * (1 - surveyOut), mid * 0.9));
      }
      if (progressRef.current) progressRef.current.style.transform = `scaleY(${clamp01((t - 1) / STEPS)})`;
      if (current !== activeRef.current) {
        activeRef.current = current;
        setActive(current);
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const style = active >= 0 ? stylesWithImages[active]! : null;

  return (
    <Box
      component="section"
      aria-labelledby="transformation-title"
      ref={trackRef}
      sx={{ position: 'relative', height: `${(STEPS + 1) * 85 + 100}svh` }}
    >
      <Box
        data-cursor="Scroll"
        sx={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          overflow: 'hidden',
        }}
      >
        <Box ref={stageRef} sx={{ position: 'absolute', inset: 0, bgcolor: colors.ink, willChange: 'clip-path' }}>
          <Box sx={{ position: 'absolute', inset: 0 }}>
            <InteriorImage
              name={beforeImage}
              sizes="100vw"
              alt="An empty living room before renovation: white walls, worn laminate floor, a large window and an arched doorway"
            />
          </Box>

          {stylesWithImages.map((s, i) => (
            <Box
              key={s.id}
              ref={(el: HTMLDivElement | null) => {
                layerRefs.current[i] = el;
              }}
              aria-hidden={active !== i}
              sx={{ position: 'absolute', inset: 0, overflow: 'hidden', visibility: 'hidden', willChange: 'clip-path' }}
            >
              <Box
                ref={(el: HTMLDivElement | null) => {
                  imageRefs.current[i] = el;
                }}
                sx={{ position: 'absolute', inset: 0, transformOrigin: '50% 42%' }}
              >
                <InteriorImage name={s.image} sizes="100vw" alt={`The same room as a ${s.name} concept: ${s.descriptor}`} />
              </Box>
            </Box>
          ))}

          {/* Portal outline around the window */}
          <Box
            ref={portalRef}
            aria-hidden
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: 0,
              outline: `1.5px solid ${colors.copper}`,
              boxShadow: `0 0 0 1px rgba(184,121,87,0.25), 0 0 60px rgba(184,121,87,0.35)`,
              pointerEvents: 'none',
            }}
          >
            <Typography
              variant="overline"
              sx={{ position: 'absolute', top: -26, left: 0, color: colors.canvas, whiteSpace: 'nowrap', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
            >
              W1 — the one thing we keep
            </Typography>
          </Box>

          <SurveyOverlay refEl={surveyRef} />

          {/* Legibility scrim */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(25,27,26,0) 45%, rgba(25,27,26,0.62) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Copy */}
          <Box
            ref={copyRef}
            sx={{
              opacity: 0,
              position: 'absolute',
              insetInline: 0,
              bottom: 0,
              color: colors.canvas,
              pb: { xs: 4, md: 6 },
              px: { xs: `${layout.gutter.xs}px`, sm: `${layout.gutter.sm}px`, md: `${layout.gutter.md}px` },
              maxWidth: layout.maxWidth,
              mx: 'auto',
            }}
          >
            <Box sx={{ ...gridSx, alignItems: 'end', rowGap: 2 }}>
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 8' }, position: 'relative', minHeight: { xs: 120, md: 180 } }}>
                <Box ref={introRef} sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                  <SectionLabel index="02" label="Transformation" tone="light" sx={{ mb: 2 }} />
                  <Typography id="transformation-title" variant="h2" component="h2">
                    Same window. <Box component="span" sx={{ color: colors.copper }}>Six rooms.</Box>
                  </Typography>
                </Box>
                <SceneCaption active={active} />
              </Box>
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '9 / -1' }, minHeight: 48 }} aria-live="polite">
                {style ? (
                  <Box key={style.id} sx={{ display: 'grid', gap: 1, animation: 'vz-fade 600ms var(--ease) both' }}>
                    <Typography sx={{ opacity: 0.85 }}>{style.descriptor}</Typography>
                    <Typography variant="overline" sx={{ opacity: 0.65 }}>
                      {style.materials.join(' · ')}
                    </Typography>
                  </Box>
                ) : (
                  <Typography sx={{ opacity: 0.85, maxWidth: 360 }}>
                    Scroll to renovate. Every direction grows out of the same window, the same light, the same walls.
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Progress rail */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              right: { xs: 12, md: 28 },
              top: '50%',
              height: 160,
              mt: '-80px',
              width: '1px',
              bgcolor: 'rgba(244,241,234,0.25)',
            }}
          >
            <Box ref={progressRef} sx={{ position: 'absolute', inset: 0, bgcolor: colors.canvas, transformOrigin: 'top', transform: 'scaleY(0)' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/** Counter + style name; the name decodes CAD-style when the style changes. */
function SceneCaption({ active }: { active: number }) {
  const name = active >= 0 ? stylesWithImages[active]!.name : stylesWithImages[0]!.name;
  const count = `${String(Math.max(active, 0) + 1).padStart(2, '0')} / ${String(STEPS).padStart(2, '0')}`;
  const nameRef = useScramble<HTMLParagraphElement>(name, { duration: 600 });
  const countRef = useScramble<HTMLSpanElement>(count, { duration: 400 });
  return (
    <Box
      aria-hidden={active < 0}
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        opacity: active >= 0 ? 1 : 0,
        transform: active >= 0 ? 'none' : 'translateY(16px)',
        transition: 'opacity 500ms var(--ease), transform 700ms var(--ease)',
      }}
    >
      <Typography variant="overline" sx={{ opacity: 0.75, fontVariantNumeric: 'tabular-nums' }}>
        <span ref={countRef} />
      </Typography>
      <Typography ref={nameRef} variant="h1" component="p" sx={{ fontSize: 'clamp(3.5rem, 10vw, 10rem)', whiteSpace: 'nowrap' }} />
    </Box>
  );
}

/** Survey-drawing annotations over the empty room, drawn in as you scroll. */
function SurveyOverlay({ refEl }: { refEl: RefObject<HTMLDivElement | null> }) {
  const line = { stroke: colors.canvas, strokeWidth: 1.2, vectorEffect: 'non-scaling-stroke' as const };
  const dash = { pathLength: 1, style: { strokeDasharray: 1, strokeDashoffset: 'calc(1 - var(--draw, 0))' } };
  return (
    <Box ref={refEl} aria-hidden sx={{ position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none' }}>
      <svg viewBox={`0 0 ${SRC.w} ${SRC.h}`} preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
        <g fill="none" {...line}>
          {/* back wall width */}
          <path d="M365 215 H1195" {...dash} />
          <path d="M365 205 V225 M1195 205 V225" />
          {/* ceiling height on the right */}
          <path d="M1235 255 V700" {...dash} />
          <path d="M1225 255 H1245 M1225 700 H1245" />
          {/* doorway */}
          <path d="M120 760 V265 Q190 225 262 265 V760" strokeDasharray="6 6" />
        </g>
        <g fill={colors.canvas} fontFamily="Inter, sans-serif" fontSize="17" letterSpacing="2">
          <text x="1010" y="198" textAnchor="middle">4.80 M</text>
          <text x="1255" y="482">2.60 M</text>
          <text x="135" y="250">D1 · ARCH</text>
        </g>
      </svg>
    </Box>
  );
}

/** Reduced-motion version: the same story as a still sequence. */
function StaticTransformation() {
  return (
    <Section labelledBy="transformation-title" sx={{ py: { xs: 12, md: 18 } }}>
      <SectionLabel index="02" label="Transformation" sx={{ mb: 3 }} />
      <Typography id="transformation-title" variant="h2" component="h2" sx={{ mb: { xs: 4, md: 6 } }}>
        Same window. Six rooms.
      </Typography>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
        {[{ id: 'before', name: 'Before', image: beforeImage }, ...stylesWithImages].map((s) => (
          <Box key={s.id} component="figure" sx={{ m: 0, display: 'grid', gap: 1 }}>
            <Box sx={{ aspectRatio: '3 / 2', overflow: 'hidden', borderRadius: 1 }}>
              <InteriorImage name={s.image} sizes="(min-width: 900px) 33vw, 100vw" alt={`${s.name} version of the living room`} />
            </Box>
            <Typography component="figcaption" variant="overline" color="text.secondary">
              {s.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
