import { useCallback } from 'react';
import { Box } from '@mui/material';
import type { NavigableScreen, Screen } from './types/navigation';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { navigateTo } from './features/navigation/navigationSlice';
import { AppHeader } from './components/layout/AppHeader';
import { AppFooter } from './components/layout/AppFooter';
import { SkipLink } from './components/layout/SkipLink';
import { HomeScreen } from './screens/HomeScreen';
import { PlaceholderScreen } from './screens/PlaceholderScreen';

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

  const navigate = useCallback(
    (screen: NavigableScreen) => {
      dispatch(navigateTo(screen));
      window.scrollTo({ top: 0 });
      document.title = screen === 'home' ? 'VISIONARY — AI Home Transformation' : `${TITLES[screen]} — VISIONARY`;
    },
    [dispatch],
  );

  return (
    <>
      <SkipLink />
      <AppHeader current={current} onNavigate={navigate} />
      <Box component="main" id="main" tabIndex={-1} sx={{ outline: 'none' }}>
        {current === 'home' ? (
          <HomeScreen onNavigate={navigate} />
        ) : (
          <PlaceholderScreen title={TITLES[current]} onNavigate={navigate} />
        )}
      </Box>
      <AppFooter onNavigate={navigate} />
    </>
  );
}
