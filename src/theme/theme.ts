import { createTheme } from '@mui/material/styles';
import { colors, fonts, motion, width } from './tokens';

// Drawing-set type: condensed, heavy capitals for titles (like sheet titles),
// a regular-width grotesk for text, and mono for every label and annotation.
const condensed = {
  fontFamily: fonts.display,
  fontVariationSettings: width(62),
  textTransform: 'uppercase',
  letterSpacing: '-0.005em',
} as const;
const mono = { fontFamily: fonts.mono, textTransform: 'uppercase' } as const;

export const theme = createTheme({
  palette: {
    mode: 'light',
    background: { default: colors.canvas, paper: colors.white },
    primary: { main: colors.ink, contrastText: colors.canvas },
    secondary: { main: colors.copper, dark: colors.copperDeep, contrastText: colors.white },
    success: { main: '#4F6B4A' },
    error: { main: '#A4372A' },
    text: { primary: colors.ink, secondary: colors.inkSoft },
    divider: colors.line,
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  shape: { borderRadius: 0 },
  spacing: 8,
  typography: {
    fontFamily: fonts.body,
    htmlFontSize: 16,
    fontSize: 15,
    h1: { ...condensed, fontWeight: 650, fontSize: 'clamp(3.5rem, 9.4vw, 10.5rem)', lineHeight: 0.83 },
    h2: { ...condensed, fontWeight: 620, fontSize: 'clamp(2.75rem, 6.4vw, 6.25rem)', lineHeight: 0.86 },
    h3: { fontFamily: fonts.display, fontWeight: 500, fontSize: 'clamp(1.6rem, 2.6vw, 2.4rem)', lineHeight: 1.06, letterSpacing: '-0.02em' },
    h4: { fontFamily: fonts.display, fontWeight: 500, fontSize: 'clamp(1.3rem, 1.8vw, 1.6rem)', lineHeight: 1.2, letterSpacing: '-0.01em' },
    h5: { fontFamily: fonts.body, fontSize: '1.125rem', fontWeight: 500, lineHeight: 1.4 },
    h6: { fontFamily: fonts.body, fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 },
    subtitle1: { fontSize: 'clamp(1.05rem, 1.3vw, 1.25rem)', lineHeight: 1.55, fontWeight: 400 },
    body1: { fontSize: '1rem', lineHeight: 1.65 },
    body2: { fontSize: '0.9rem', lineHeight: 1.6 },
    // "Overline" is the annotation style of the drawing set.
    overline: { ...mono, fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.12em', lineHeight: 1.6 },
    caption: { fontFamily: fonts.mono, fontSize: '0.74rem', lineHeight: 1.5, letterSpacing: '0.02em' },
    button: { ...mono, fontWeight: 500, letterSpacing: '0.1em', fontSize: '0.78rem' },
  },
  transitions: {
    easing: {
      easeOut: motion.ease,
      easeInOut: motion.easeInOut,
      easeIn: 'cubic-bezier(0.64, 0, 0.78, 0)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: colors.canvas, color: colors.ink },
        '::selection': { background: colors.ink, color: colors.canvas },
      },
    },
    MuiButtonBase: {
      defaultProps: { disableRipple: true },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 48,
          borderRadius: 0,
          paddingInline: 22,
          transition: `background-color ${motion.fast}ms ${motion.ease}, color ${motion.fast}ms ${motion.ease}, border-color ${motion.fast}ms ${motion.ease}, transform ${motion.fast}ms ${motion.ease}`,
          '&:active': { transform: 'scale(0.98)' },
        },
        sizeLarge: { minHeight: 52, paddingInline: 26, fontSize: '0.8rem' },
        sizeSmall: { minHeight: 44, paddingInline: 18 },
        contained: {
          '&:hover': { backgroundColor: colors.copperDeep },
        },
        outlined: {
          borderColor: 'currentColor',
          '&:hover': { backgroundColor: colors.ink, color: colors.canvas, borderColor: colors.ink },
        },
        text: {
          paddingInline: 14,
          '&:hover': { backgroundColor: 'transparent', color: colors.copperDeep },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          minHeight: 44,
          paddingInline: 14,
          borderColor: colors.ink,
          color: colors.ink,
          fontFamily: fonts.mono,
          fontSize: '0.72rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: colors.ink, color: colors.canvas },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { width: 48, height: 48 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: colors.white,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.limestone },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.inkSoft },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.ink, borderWidth: 1.5 },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { borderRadius: 4, border: `1px solid ${colors.line}`, backgroundColor: colors.white },
      },
    },
    MuiPaper: {
      styleOverrides: { rounded: { borderRadius: 4 } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: colors.line } },
    },
    MuiLink: {
      defaultProps: { underline: 'none' },
      styleOverrides: {
        root: { color: 'inherit', '&:hover': { color: colors.copperDeep } },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 500 },
        outlined: { borderColor: colors.line },
      },
    },
    MuiDrawer: {
      styleOverrides: { paper: { backgroundColor: colors.canvas } },
    },
  },
});
