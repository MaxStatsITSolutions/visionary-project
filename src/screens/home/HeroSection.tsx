import { useRef, useState, type CSSProperties } from 'react';
import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import type { Navigate } from '../../types/navigation';
import { colors, layout } from '../../theme/tokens';
import { revisions } from '../../content/revisions';
import { gridSx } from '../../components/layout/grid';
import { DrawingPlate } from '../../components/drawing/DrawingPlate';
import { NorthArrow, RevisionTable, TitleBlock } from '../../components/drawing/SheetParts';
import { SheetViewer } from '../../components/drawing/SheetViewer';
import { enterBrowserFullscreen } from '../../components/drawing/fullscreen';
import { useIntroDone } from '../../motion/IntroContext';
import { useFrame } from '../../motion/useFrame';
import { useFitText } from '../../motion/useFitText';
import { clamp, lerp } from '../../motion/engine';

const PLATE_SIZES = '(min-width: 900px) 58vw, 100vw';
const TITLE = ['See the room', 'before it', 'exists.'];

/**
 * Hero = sheet A-101. The room is plotted as a survey drawing, the photo
 * develops underneath, renovation notes are added, and a lens shows the
 * selected revision (interior direction). "View full sheet" opens it large.
 */
export function HeroSection({ onNavigate }: { onNavigate: Navigate }) {
  const play = useIntroDone();
  const [revIndex, setRevIndex] = useState(0);
  const [plotKey, setPlotKey] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mode, setMode] = useState<'lens' | 'full'>('lens');
  const revision = revisions[revIndex]!;
  const titleLines = useRef<(HTMLSpanElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useFitText(titleRef, TITLE);

  // Leaving the hero: each title line stretches out along Archivo's width
  // axis (62 → 125) and slides away, one after another.
  useFrame(({ scrollY, viewport }) => {
    if (scrollY > viewport.h * 1.6) return;
    const p = scrollY / (viewport.h * 0.75);
    titleLines.current.forEach((el, i) => {
      if (!el) return;
      const li = clamp(p * 1.25 - i * 0.14);
      const e = li * li * (3 - 2 * li);
      el.style.fontVariationSettings = `"wdth" ${lerp(62, 125, e).toFixed(1)}`;
      el.style.translate = `${(i % 2 ? 1 : -1) * e * 6}vw 0`;
    });
  });

  const openSheet = () => {
    enterBrowserFullscreen();
    setSheetOpen(true);
  };

  return (
    <Box
      component="section"
      aria-labelledby="hero-title"
      className="vz-paper"
      sx={{ pt: `${layout.headerHeight + 32}px`, pb: { xs: 8, md: 12 } }}
    >
      <Box sx={{ maxWidth: layout.maxWidth, mx: 'auto', px: { xs: `${layout.gutter.xs}px`, sm: `${layout.gutter.sm}px`, md: `${layout.gutter.md}px` } }}>
        <Box sx={{ ...gridSx, rowGap: { xs: 4, md: 5 } }}>
          {/* Left: title, lede, actions */}
          <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 5' }, display: 'grid', gap: { xs: 3, md: 4 }, alignContent: 'start', minWidth: 0 }}>
            <Typography variant="overline" color="text.secondary">
              Sheet A-101 · Living room · Proposal
            </Typography>
            <Typography
              ref={titleRef}
              id="hero-title"
              variant="h1"
              component="h1"
              className={play ? 'is-in' : undefined}
              sx={{ m: 0, contain: 'inline-size', minWidth: 0 }}
            >
              {TITLE.map((line, i) => (
                <span className="vz-line" key={line}>
                  <span
                    ref={(el) => {
                      titleLines.current[i] = el;
                    }}
                    style={{ '--d': `${i * 110}ms`, whiteSpace: 'nowrap' } as CSSProperties}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                opacity: play ? 1 : 0,
                transform: play ? 'none' : 'translateY(16px)',
                transition: 'opacity 900ms var(--ease) 500ms, transform 1100ms var(--ease) 500ms',
              }}
            >
              <Typography sx={{ maxWidth: '40ch', fontSize: '1.05rem' }}>
                A digital interior studio. We survey the room you have, then show it in the direction you choose, before anything is
                bought or built.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Button variant="contained" size="large" onClick={() => onNavigate('studio')} data-cursor="Start">
                  Start a project →
                </Button>
                <Button variant="outlined" size="large" color="inherit" onClick={() => onNavigate('explore')} data-cursor="Explore">
                  Explore
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Right: the plate */}
          <Box component="figure" sx={{ gridColumn: { xs: '1 / -1', md: '6 / -1' }, m: 0, display: 'grid', gap: 1.5, alignContent: 'start' }}>
            <DrawingPlate
              key={plotKey}
              play={play}
              proposal={{ image: revision.image, name: revision.name, rev: revision.rev }}
              notes={revision.notes}
              lens={mode === 'lens'}
              sizes={PLATE_SIZES}
              priority
            />
            <Box component="figcaption" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <ToggleButtonGroup size="small" exclusive aria-label="Proposal view" value={mode} onChange={(_, v) => v && setMode(v)}>
                  <ToggleButton value="lens">◐ Lens</ToggleButton>
                  <ToggleButton value="full">● Full</ToggleButton>
                </ToggleButtonGroup>
                <Button variant="contained" size="small" onClick={openSheet} data-cursor="Open">
                  ⤢ Full sheet
                </Button>
                <Button variant="outlined" size="small" color="inherit" onClick={() => setPlotKey((k) => k + 1)}>
                  ↺ Replot
                </Button>
              </Box>
              <Typography variant="overline" color="text.secondary">
                Move to look · hold to open
              </Typography>
            </Box>
          </Box>

          {/* Bottom: revisions + title block */}
          <RevisionTable
            revisions={revisions}
            active={revIndex}
            onSelect={setRevIndex}
            sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 6' }, alignSelf: 'start' }}
          />
          <Box sx={{ gridColumn: { xs: '1 / -1', md: '8 / -1' }, display: 'grid', gap: 2, alignContent: 'start' }}>
            <TitleBlock revision={revision} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, color: colors.ink }}>
              <NorthArrow />
              <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 260, textAlign: 'right' }}>
                Illustrative AI concepts, not generated from your upload.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <SheetViewer open={sheetOpen} onClose={() => setSheetOpen(false)} revIndex={revIndex} onRevChange={setRevIndex} />
    </Box>
  );
}
