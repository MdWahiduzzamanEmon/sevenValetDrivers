import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type userType = {
  driverId: string;
  driverName: string;
  id: string;
  language?: string;
};
interface AuthState {
  isAuthenticated: boolean;
  user: userType | null;
  rememberMe: boolean;
  savedCredentials: {
    driverId: string;
    passcode: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  rememberMe: false,
  savedCredentials: null,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setLogout: state => {
      state.user = null;
      state.isAuthenticated = false;
      if (!state.rememberMe) {
        state.savedCredentials = null;
      }
    },
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
    setSavedCredentials: (
      state,
      action: PayloadAction<{driverId: string; passcode: string} | null>,
    ) => {
      state.savedCredentials = action.payload;
    },
  },
});

export const {setUser, setLogout, setRememberMe, setSavedCredentials} =
  authSlice.actions;
export default authSlice.reducer;
