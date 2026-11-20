import { useEffect, useState } from 'react';
import { Box, Button, ButtonBase, Drawer, IconButton, Typography } from '@mui/material';
import type { Navigate, NavigableScreen, Screen } from '../../types/navigation';
import { colors, fonts, layout, motion, width } from '../../theme/tokens';
import { MotionToggle } from '../../motion/MotionToggle';

const NAV: { screen: NavigableScreen; label: string }[] = [
  { screen: 'explore', label: 'Explore' },
  { screen: 'how-it-works', label: 'How it works' },
  { screen: 'studio', label: 'Studio' },
];

type AppHeaderProps = {
  current: Screen;
  onNavigate: Navigate;
};

export function Wordmark({ onClick, tone = 'dark' }: { onClick?: () => void; tone?: 'dark' | 'light' }) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-label="VISIONARY — home"
      sx={{
        minHeight: 44,
        fontFamily: fonts.display,
        fontVariationSettings: width(100),
        fontSize: '0.95rem',
        fontWeight: 700,
        letterSpacing: '0.32em',
        color: tone === 'dark' ? colors.ink : colors.canvas,
        gap: 1,
      }}
    >
      VISIONARY
      <Box component="span" aria-hidden sx={{ width: 8, height: 8, bgcolor: colors.copper }} />
    </ButtonBase>
  );
}

export function AppHeader({ current, onNavigate }: AppHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (screen: NavigableScreen) => {
    setOpen(false);
    onNavigate(screen);
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        insetInline: 0,
        top: 0,
        zIndex: 1100,
        transition: `background-color ${motion.base}ms ${motion.ease}, box-shadow ${motion.base}ms ${motion.ease}`,
        bgcolor: scrolled ? 'rgba(244, 241, 234, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
      }}
    >
      <Box
        sx={{
          maxWidth: layout.maxWidth,
          mx: 'auto',
          px: { xs: `${layout.gutter.xs}px`, sm: `${layout.gutter.sm}px`, md: `${layout.gutter.md}px` },
          height: layout.headerHeight,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr auto', md: '1fr auto 1fr' },
          borderBottom: `1px solid ${colors.ink}`,
          alignItems: 'center',
        }}
      >
        <Box>
          <Wordmark onClick={() => go('home')} />
        </Box>

        <Box component="nav" aria-label="Primary" sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box component="ul" sx={{ display: 'flex', gap: 0.5, listStyle: 'none', m: 0, p: 0 }}>
            {NAV.map((item) => {
              const active = current === item.screen;
              return (
                <li key={item.screen}>
                  <Button
                    variant="text"
                    color="inherit"
                    onClick={() => go(item.screen)}
                    aria-current={active ? 'page' : undefined}
                    sx={{
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: 14,
                        right: 14,
                        bottom: 10,
                        height: '1px',
                        bgcolor: 'currentColor',
                        transform: active ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: `transform ${motion.base}ms ${motion.ease}`,
                      },
                      '&:hover::after, &:focus-visible::after': { transform: 'scaleX(1)' },
                    }}
                  >
                    {item.label}
                  </Button>
                </li>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
          <MotionToggle sx={{ display: { xs: 'none', lg: 'inline-flex' } }} />
          <Button variant="text" color="inherit" onClick={() => go('auth')} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
            Sign in
          </Button>
          <Button variant="contained" color="primary" onClick={() => go('studio')} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            Start a project
          </Button>
          <IconButton
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
            sx={{ display: { md: 'none' }, color: colors.ink }}
          >
            <svg width="24" height="12" viewBox="0 0 24 12" aria-hidden>
              <path d="M0 1h24M8 11h16" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </IconButton>
        </Box>
      </Box>

      <Drawer
        id="mobile-menu"
        anchor="top"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { minHeight: '100dvh' } } }}
      >
        <Box sx={{ px: `${layout.gutter.xs}px`, height: layout.headerHeight, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark onClick={() => go('home')} />
          <IconButton aria-label="Close menu" onClick={() => setOpen(false)} sx={{ color: colors.ink }}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <path d="M1 1l16 16M17 1 1 17" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </IconButton>
        </Box>
        <Box component="nav" aria-label="Mobile" sx={{ px: `${layout.gutter.xs}px`, pt: 6, pb: 4, display: 'grid', gap: 1 }}>
          {[...NAV, { screen: 'auth' as const, label: 'Sign in' }].map((item, i) => (
            <ButtonBase
              key={item.screen}
              onClick={() => go(item.screen)}
              aria-current={current === item.screen ? 'page' : undefined}
              sx={{ justifyContent: 'flex-start', gap: 2, py: 1, borderBottom: `1px solid ${colors.line}` }}
            >
              <Typography variant="overline" color="text.secondary" sx={{ width: 28 }}>
                0{i + 1}
              </Typography>
              <Typography variant="h3" component="span">
                {item.label}
              </Typography>
            </ButtonBase>
          ))}
          <Button variant="contained" size="large" onClick={() => go('studio')} sx={{ mt: 4 }}>
            Start a project
          </Button>
          <MotionToggle sx={{ justifySelf: 'start' }} />
        </Box>
      </Drawer>
    </Box>
  );
}
