import { useCallback, useState } from 'react';
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
      <Preloader onDone={finishIntro} />
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
    </IntroContext.Provider>
  );
}
