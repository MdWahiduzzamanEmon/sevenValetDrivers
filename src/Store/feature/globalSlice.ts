import {createSlice} from '@reduxjs/toolkit';

export const globalSlice = createSlice({
  name: 'globalSlice',
  initialState: {
    ipLocation: null,

    apkInfo: null,
    userAllPermissionSuccess: false,
    userAllPermissionData: {},
  },
  reducers: {
    setIpLocation: (state, action) => {
      state.ipLocation = action.payload;
    },

    setApkInfo: (state, action) => {
      state.apkInfo = action.payload;
    },

    setUserAllPermissionSuccess: (state, action) => {
      state.userAllPermissionSuccess = action.payload;
      if (!action.payload) {
        state.userAllPermissionData = {};
      }
    },

    setUserAllPermissionData: (state, action) => {
      state.userAllPermissionData = action.payload;
    },
  },
});

export const {
  setIpLocation,
  setApkInfo,
  setUserAllPermissionSuccess,
  setUserAllPermissionData,
} = globalSlice.actions;

export default globalSlice.reducer;
