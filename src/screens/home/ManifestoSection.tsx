import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../../theme/tokens';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { SectionLabel } from '../../components/common/SectionLabel';
import { Section } from '../../components/layout/Section';
import { gridSx } from '../../components/layout/grid';

const TEXT =
  'Inspiration is everywhere, yet it rarely fits the room you actually live in. VISIONARY connects a direction you love with the walls, light and proportions you already have — so decisions feel calm, not guessed.';

/**
 * Words brighten as the paragraph scrolls through the viewport. The effect is
 * driven by one passive scroll listener writing straight to the DOM (no
 * re-renders); with reduced motion, all words are simply fully visible.
 */
export function ManifestoSection() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();
  const words = TEXT.split(' ');

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const spans = Array.from(node.querySelectorAll<HTMLSpanElement>('[data-w]'));
    if (reduced) {
      spans.forEach((s) => (s.style.opacity = '1'));
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top enters at 85% of the viewport, 1 when the bottom reaches 45%.
      const start = vh * 0.85;
      const end = vh * 0.45;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end + rect.height)));
      const lit = progress * spans.length;
      spans.forEach((s, i) => {
        s.style.opacity = String(0.16 + 0.84 * Math.min(1, Math.max(0, lit - i)));
      });
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
  }, [reduced]);

  return (
    <Section labelledBy="manifesto-label" sx={{ py: { xs: 14, md: 22 } }}>
      <Box sx={gridSx}>
        <Box id="manifesto-label" sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 3' }, mb: 4 }}>
          <SectionLabel index="04" label="Manifesto" />
        </Box>
        <Typography
          ref={ref}
          variant="h3"
          component="p"
          sx={{ gridColumn: { xs: '1 / -1', md: '4 / -1' }, m: 0, fontWeight: 330, lineHeight: 1.18 }}
        >
          {words.map((w, i) => (
            <span key={i}>
              <span data-w style={{ opacity: 0.16, transition: 'opacity 120ms linear', color: w.startsWith('VISIONARY') ? colors.copperDeep : undefined }}>
                {w}
              </span>{' '}
            </span>
          ))}
        </Typography>
      </Box>
    </Section>
  );
}
