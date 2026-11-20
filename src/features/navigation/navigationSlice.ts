import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Every screen from §4 of the project spec. Navigation lives in Redux state
// (no React Router) until the mentor approves a routing library.
export type Screen =
  | 'home'
  | 'explore'
  | 'how-it-works'
  | 'studio'
  | 'projects'
  | 'project-details'
  | 'auth'
  | 'profile'
  | 'privacy';

type NavigationState = {
  currentScreen: Screen;
  // Set when currentScreen is 'project-details'.
  selectedProjectId: string | null;
};

const initialState: NavigationState = {
  currentScreen: 'home',
  selectedProjectId: null,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    navigateTo(state, action: PayloadAction<Exclude<Screen, 'project-details'>>) {
      state.currentScreen = action.payload;
      state.selectedProjectId = null;
    },
    openProject(state, action: PayloadAction<string>) {
      state.currentScreen = 'project-details';
      state.selectedProjectId = action.payload;
    },
  },
});

export const { navigateTo, openProject } = navigationSlice.actions;
export default navigationSlice.reducer;
