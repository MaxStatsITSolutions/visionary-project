import { useState } from 'react';
import { Box, Button, Dialog, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { colors, fonts, layout, width } from '../../theme/tokens';
import { revisions } from '../../content/revisions';
import { DrawingPlate } from './DrawingPlate';
import { ALL_LAYERS, type Layers } from './layers';
import { exitBrowserFullscreen } from './fullscreen';

const LAYER_LABELS: { key: keyof Layers; label: string }[] = [
  { key: 'construction', label: 'Construction' },
  { key: 'linework', label: 'Linework' },
  { key: 'photo', label: 'Photo' },
  { key: 'notes', label: 'Notes' },
  { key: 'proposal', label: 'Proposal' },
];

type SheetViewerProps = {
  open: boolean;
  onClose: () => void;
  revIndex: number;
  onRevChange: (index: number) => void;
};

/**
 * Full-sheet view of A-101: the drawing as large as the screen allows, with
 * CAD-style layer toggles, lens / full proposal, and revision switching.
 * MUI Dialog provides the focus trap, Escape to close and aria wiring.
 */
export function SheetViewer({ open, onClose, revIndex, onRevChange }: SheetViewerProps) {
  const [layers, setLayers] = useState<Layers>(ALL_LAYERS);
  const [mode, setMode] = useState<'lens' | 'full'>('lens');
  const [plotKey, setPlotKey] = useState(0);
  const revision = revisions[revIndex]!;

  const close = () => {
    exitBrowserFullscreen();
    onClose();
  };

  const groupSx = { display: 'grid', gap: 1 } as const;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={close}
      aria-labelledby="sheet-title"
      slotProps={{ paper: { className: 'vz-paper', sx: { color: colors.ink } } }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto minmax(0, 1fr) auto',
          height: '100%',
          px: { xs: `${layout.gutter.xs}px`, md: `${layout.gutter.md}px` },
          pb: 2,
          gap: 2,
        }}
      >
        <Box
          component="header"
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            gap: 2,
            minHeight: 68,
            borderBottom: `1px solid ${colors.ink}`,
          }}
        >
          <Typography id="sheet-title" variant="overline" component="h2" sx={{ m: 0 }}>
            <Box component="span" sx={{ fontFamily: fonts.display, fontVariationSettings: width(100), fontWeight: 700, letterSpacing: '0.3em', mr: 2 }}>
              VISIONARY
            </Box>
            A-101 · Living room — proposal · Rev {revision.rev} {revision.name}
          </Typography>
          <Button variant="outlined" color="inherit" onClick={close} data-cursor="Close">
            Close ✕
          </Button>
        </Box>

        {/* Size the 3:2 plate to whatever space this row really has (container query units). */}
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 0, containerType: 'size' }}>
          <Box sx={{ width: 'min(100cqw, 150cqh)' }}>
            <DrawingPlate
              key={plotKey}
              play={open}
              proposal={{ image: revision.image, name: revision.name, rev: revision.rev }}
              notes={revision.notes}
              layers={layers}
              lens={mode === 'lens'}
              sizes="100vw"
            />
          </Box>
        </Box>

        <Box
          component="footer"
          sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 4 }, alignItems: 'flex-end', justifyContent: 'space-between' }}
        >
          <Box sx={groupSx}>
            <Typography variant="overline" component="p" sx={{ m: 0, opacity: 0.6 }}>
              Layers
            </Typography>
            <ToggleButtonGroup
              size="small"
              aria-label="Visible layers"
              value={LAYER_LABELS.filter((l) => layers[l.key]).map((l) => l.key)}
              onChange={(_, keys: (keyof Layers)[]) =>
                setLayers(Object.fromEntries(LAYER_LABELS.map((l) => [l.key, keys.includes(l.key)])) as Layers)
              }
              sx={{ flexWrap: 'wrap' }}
            >
              {LAYER_LABELS.map((l) => (
                <ToggleButton key={l.key} value={l.key}>
                  {l.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Box sx={groupSx}>
            <Typography variant="overline" component="p" sx={{ m: 0, opacity: 0.6 }}>
              Proposal
            </Typography>
            <ToggleButtonGroup size="small" exclusive aria-label="Proposal view" value={mode} onChange={(_, v) => v && setMode(v)}>
              <ToggleButton value="lens">Lens</ToggleButton>
              <ToggleButton value="full">Full</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={groupSx}>
            <Typography variant="overline" component="p" sx={{ m: 0, opacity: 0.6 }}>
              Revision
            </Typography>
            <ToggleButtonGroup
              size="small"
              exclusive
              aria-label="Revision"
              value={revIndex}
              onChange={(_, v: number | null) => v !== null && onRevChange(v)}
              sx={{ flexWrap: 'wrap' }}
            >
              {revisions.map((r, i) => (
                <ToggleButton key={r.rev} value={i} aria-label={`Revision ${r.rev}: ${r.name}`}>
                  {r.rev}
                  <Box component="span" sx={{ display: { xs: 'none', lg: 'inline' }, ml: 1, opacity: 0.7 }}>
                    {r.name}
                  </Box>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Button variant="contained" onClick={() => setPlotKey((k) => k + 1)}>
            ↺ Replot
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
