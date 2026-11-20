import { createTheme } from '@mui/material/styles';
import { colors, fonts, motion } from './tokens';

const display = {
  fontFamily: fonts.display,
  fontWeight: 340,
  letterSpacing: '-0.025em',
  fontOpticalSizing: 'auto',
} as const;

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
  shape: { borderRadius: 2 },
  spacing: 8,
  typography: {
    fontFamily: fonts.body,
    htmlFontSize: 16,
    fontSize: 15,
    h1: { ...display, fontSize: 'clamp(3rem, 9.2vw, 9.5rem)', lineHeight: 0.92, fontWeight: 300 },
    h2: { ...display, fontSize: 'clamp(2.4rem, 5.6vw, 5.25rem)', lineHeight: 1 },
    h3: { ...display, fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)', lineHeight: 1.08 },
    h4: { ...display, fontSize: 'clamp(1.35rem, 2vw, 1.75rem)', lineHeight: 1.2, letterSpacing: '-0.01em' },
    h5: { fontFamily: fonts.body, fontSize: '1.125rem', fontWeight: 500, lineHeight: 1.4 },
    h6: { fontFamily: fonts.body, fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 },
    subtitle1: { fontSize: 'clamp(1.05rem, 1.3vw, 1.25rem)', lineHeight: 1.55, fontWeight: 400 },
    body1: { fontSize: '1rem', lineHeight: 1.65 },
    body2: { fontSize: '0.9rem', lineHeight: 1.6 },
    // "Overline" is our editorial label style: small caps, wide tracking.
    overline: {
      fontSize: '0.72rem',
      fontWeight: 500,
      letterSpacing: '0.16em',
      lineHeight: 1.6,
      textTransform: 'uppercase',
    },
    caption: { fontSize: '0.78rem', lineHeight: 1.5, letterSpacing: '0.01em' },
    button: { fontWeight: 500, letterSpacing: '0.01em', textTransform: 'none', fontSize: '0.95rem' },
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
          borderRadius: 999,
          paddingInline: 26,
          transition: `background-color ${motion.fast}ms ${motion.ease}, color ${motion.fast}ms ${motion.ease}, border-color ${motion.fast}ms ${motion.ease}, transform ${motion.fast}ms ${motion.ease}`,
          '&:active': { transform: 'scale(0.98)' },
        },
        sizeLarge: { minHeight: 56, paddingInline: 34, fontSize: '1rem' },
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
