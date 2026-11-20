import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../features/navigation/navigationSlice';

// Add each new feature slice here (one line per slice).
export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
