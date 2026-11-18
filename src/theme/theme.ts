import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#F4F1EA', paper: '#FFFFFF' },
    primary: { main: '#191B1A' },
    secondary: { main: '#B87957' },
    text: { primary: '#191B1A', secondary: '#616B63' },
  },
  typography: {
    fontFamily: '"Segoe UI", Inter, Arial, sans-serif',
    h1: { fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', fontWeight: 500, lineHeight: 1.05 },
  },
  shape: { borderRadius: 12 },
});
