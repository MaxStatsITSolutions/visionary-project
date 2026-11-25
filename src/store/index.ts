import { configureStore } from '@reduxjs/toolkit';
import connectionCheckReducer from '../features/connectionCheck/connectionCheckSlice';
import navigationReducer from '../features/navigation/navigationSlice';
import authReducer from '../features/auth/authSlice';
// Add each new feature slice here (one line per slice).

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    connectionCheck: connectionCheckReducer,
        auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
