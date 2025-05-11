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
  taskStartTime: number | null;

  taskPrgressingTimer: number;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  rememberMe: false,
  savedCredentials: null,
  taskPrgressingTimer: 0,
  taskStartTime: null,
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

    setTaskPrgressingTimer: (state, action) => {
      state.taskPrgressingTimer = action.payload;
      state.taskStartTime = action.payload ? Date.now() : null;
    },
  },
});

export const {
  setUser,
  setLogout,
  setRememberMe,
  setSavedCredentials,
  setTaskPrgressingTimer,
} = authSlice.actions;
export default authSlice.reducer;
