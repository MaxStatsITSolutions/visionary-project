import { Fragment, useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import type { NavigableScreen, Screen } from './types/navigation';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { navigateTo } from './features/navigation/navigationSlice';
import { AppHeader } from './components/layout/AppHeader';
import { AppFooter } from './components/layout/AppFooter';
import { SkipLink } from './components/layout/SkipLink';
import { HomeScreen } from './screens/HomeScreen';
import { PlaceholderScreen } from './screens/PlaceholderScreen';
import { IntroContext } from './motion/IntroContext';
import { Preloader } from './motion/Preloader';
import { Cursor } from './motion/Cursor';
import { MotionNotice } from './motion/MotionToggle';
import { MOTION_EVENT } from './motion/preference';
import { colors } from './theme/tokens';

const TITLES: Record<Screen, string> = {
  home: 'Home',
  explore: 'Explore',
  'how-it-works': 'How it works',
  studio: 'Studio',
  projects: 'My projects',
  'project-details': 'Project',
  auth: 'Sign in',
  profile: 'Profile',
  privacy: 'Privacy',
};

export default function App() {
  const current = useAppSelector((state) => state.navigation.currentScreen);
  const dispatch = useAppDispatch();
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);

  // Motion toggled (or the OS setting changed): remount the page so every
  // effect re-reads the preference. The preloader only runs on first load.
  const [motionKey, setMotionKey] = useState(0);
  useEffect(() => {
    const onChange = () => setMotionKey((k) => k + 1);
    window.addEventListener(MOTION_EVENT, onChange);
    return () => window.removeEventListener(MOTION_EVENT, onChange);
  }, []);

  const navigate = useCallback(
    (screen: NavigableScreen) => {
      dispatch(navigateTo(screen));
      window.scrollTo({ top: 0 });
      document.title = screen === 'home' ? 'VISIONARY — AI Home Transformation' : `${TITLES[screen]} — VISIONARY`;
    },
    [dispatch],
  );

  return (
    <IntroContext.Provider value={introDone}>
      <Fragment key={motionKey}>
      {motionKey === 0 && <Preloader onDone={finishIntro} />}
      <MotionNotice />
      <Cursor />
      <SkipLink />
      <AppHeader current={current} onNavigate={navigate} />
      {/* Main slides up over the footer, which waits underneath (sticky). */}
      <Box
        component="main"
        id="main"
        tabIndex={-1}
        sx={{
          outline: 'none',
          position: 'relative',
          zIndex: 1,
          bgcolor: colors.canvas,
          boxShadow: '0 40px 80px -40px rgba(25,27,26,0.35)',
        }}
      >
        {current === 'home' ? (
          <HomeScreen onNavigate={navigate} />
        ) : (
          <PlaceholderScreen title={TITLES[current]} onNavigate={navigate} />
        )}
      </Box>
      <Box sx={{ position: { md: 'sticky' }, bottom: 0, zIndex: 0 }}>
        <AppFooter onNavigate={navigate} />
      </Box>
      </Fragment>
    </IntroContext.Provider>
  );
}
