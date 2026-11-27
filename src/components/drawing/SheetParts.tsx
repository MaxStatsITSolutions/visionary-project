import { Box, ButtonBase, Typography, type SxProps, type Theme } from '@mui/material';
import { colors, fonts } from '../../theme/tokens';
import type { Revision } from '../../content/revisions';

const cell = {
  px: 1.5,
  py: 1.1,
  borderBottom: `1px solid ${colors.ink}`,
  fontFamily: fonts.mono,
  fontSize: '0.7rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  lineHeight: 1.3,
} as const;

/** Revision table: each interior direction is a selectable revision of the sheet. */
export function RevisionTable({
  revisions,
  active,
  onSelect,
  sx,
}: {
  revisions: readonly Revision[];
  active: number;
  onSelect: (index: number) => void;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box sx={[{ border: `1px solid ${colors.ink}`, bgcolor: colors.canvas }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '48px 1fr auto', bgcolor: colors.ink, color: colors.canvas }}>
        {['Rev', 'Direction', 'Status'].map((h) => (
          <Box key={h} sx={{ ...cell, borderBottom: 0, opacity: 0.85 }}>
            {h}
          </Box>
        ))}
      </Box>
      <Box role="radiogroup" aria-label="Proposal revision">
        {revisions.map((r, i) => {
          const on = i === active;
          return (
            <ButtonBase
              key={r.rev}
              role="radio"
              aria-checked={on}
              onClick={() => onSelect(i)}
              data-cursor="Select"
              sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '48px 1fr auto',
                textAlign: 'left',
                minHeight: 44,
                bgcolor: on ? colors.copper : 'transparent',
                color: colors.ink,
                transition: 'background-color 200ms',
                '&:hover': { bgcolor: on ? colors.copper : 'rgba(25,27,26,0.06)' },
                '&:last-of-type > *': { borderBottom: 0 },
              }}
            >
              <Box sx={{ ...cell, fontWeight: 500 }}>{r.rev}</Box>
              <Box sx={{ ...cell, textTransform: 'none', fontFamily: fonts.body, fontSize: '0.85rem', letterSpacing: 0 }}>
                <Box component="span" sx={{ fontWeight: 600 }}>
                  {r.name}
                </Box>
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, opacity: 0.7 }}>
                  {' '}
                  — {r.descriptor}
                </Box>
              </Box>
              <Box sx={{ ...cell, opacity: on ? 1 : 0.55 }}>{on ? 'Shown' : 'Issued'}</Box>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}

/** Title block, bottom-right of every architectural sheet. */
export function TitleBlock({ revision, sx }: { revision: Revision; sx?: SxProps<Theme> }) {
  const rows: [string, string][] = [
    ['Project', 'VISIONARY'],
    ['Drawing', 'Living room — proposal'],
    ['Sheet', 'A-101'],
    ['Scale', '1:50'],
    ['Revision', `${revision.rev} · ${revision.name}`],
    ['Status', 'Demo preview · AI concept'],
  ];
  return (
    <Box
      component="dl"
      sx={[
        { m: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', border: `1px solid ${colors.ink}`, bgcolor: colors.canvas },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {rows.map(([k, v], i) => (
        <Box key={k} sx={{ display: 'contents' }}>
          <Box component="dt" sx={{ ...cell, borderRight: `1px solid ${colors.ink}`, opacity: 0.6, ...(i === rows.length - 1 && { borderBottom: 0 }) }}>
            {k}
          </Box>
          <Box component="dd" sx={{ ...cell, m: 0, ...(i === rows.length - 1 && { borderBottom: 0 }) }}>
            {v}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export function NorthArrow({ label = 'North · scale 1:50' }: { label?: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <svg width="36" height="36" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="none" stroke={colors.ink} />
        <path d="M20 6 L26 28 L20 23 L14 28 Z" fill={colors.ink} />
      </svg>
      <Typography variant="overline" component="span">
        {label}
      </Typography>
    </Box>
  );
}
