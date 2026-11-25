import { createSlice, type PayloadAction} from '@reduxjs/toolkit';

export type AuthUser = {
  id: string;
  email: string | null;
};

type AuthState = {
  status: 'loading' | 'signedIn' | 'signedOut';
  user: AuthUser | null;
};

const initialState: AuthState = {
  status: 'loading',
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signedIn(state, action: PayloadAction<AuthUser>) {
      state.status = 'signedIn';
      state.user = action.payload;
    },
    signedOut(state) {
      state.status = 'signedOut';
      state.user = null;
    },
  },
});

export const { signedIn, signedOut } = authSlice.actions;
export default authSlice.reducer;
