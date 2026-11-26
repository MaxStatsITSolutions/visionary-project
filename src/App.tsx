import { Fragment, useCallback, useEffect, useState, type ReactNode } from 'react';
import { Box } from '@mui/material';
import type { NavigableScreen, Screen } from './types/navigation';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { navigateTo } from './features/navigation/navigationSlice';
import { AppHeader } from './components/layout/AppHeader';
import { AppFooter } from './components/layout/AppFooter';
import { SkipLink } from './components/layout/SkipLink';
import { HomeScreen } from './screens/HomeScreen';
import { PlaceholderScreen } from './screens/PlaceholderScreen';
import AuthScreen from './screens/AuthScreen';
import ConnectionCheckScreen from './screens/ConnectionCheckScreen';
import { StudioScreen } from './screens/StudioScreen';
import { layout } from './theme/tokens';
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

/** Screens built by the team sit under the fixed header. */
function ScreenFrame({ children }: { children: ReactNode }) {
  return <Box sx={{ pt: `${layout.headerHeight + 24}px`, pb: 12, minHeight: '70vh' }}>{children}</Box>;
}

function renderScreen(current: Screen, navigate: (screen: NavigableScreen) => void) {
  switch (current) {
    case 'home':
      return <HomeScreen onNavigate={navigate} />;
    case 'auth':
      // Sign-in (feature/supabase-auth) plus the Supabase connection check.
      return (
        <ScreenFrame>
          <AuthScreen />
          <ConnectionCheckScreen />
        </ScreenFrame>
      );
    case 'studio':
      // Project wizard (feature/studio-form): Formik + Supabase save.
      return (
        <ScreenFrame>
          <StudioScreen />
        </ScreenFrame>
      );
    default:
      return <PlaceholderScreen title={TITLES[current]} onNavigate={navigate} />;
  }
}

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
        {renderScreen(current, navigate)}
      </Box>
      <Box sx={{ position: { md: 'sticky' }, bottom: 0, zIndex: 0 }}>
        <AppFooter onNavigate={navigate} />
      </Box>
      </Fragment>
    </IntroContext.Provider>
  );
}
