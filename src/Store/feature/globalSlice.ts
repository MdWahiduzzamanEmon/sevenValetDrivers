import {createSlice} from '@reduxjs/toolkit';
import {TaskData} from '../../components/TaskCard/TaskCard';

interface GlobalState {
  ipLocation: string | null;
  apkInfo: any | null;
  userAllPermissionSuccess: boolean;
  userAllPermissionData: any;
  newTaskData: TaskData | null;
  newTaskNotification: boolean;
  taskToShow: null;
  isLoadingTask: boolean;
}

export const globalSlice = createSlice({
  name: 'globalSlice',
  initialState: {
    ipLocation: null,

    apkInfo: null,
    userAllPermissionSuccess: false,
    userAllPermissionData: {},

    newTaskData: null,
    newTaskNotification: false,
    taskToShow: null,
    taskPrgressingTimer: 0,
    isLoadingTask: false,
  } as GlobalState,
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

    setNewTaskData: (state, action) => {
      state.newTaskData = action.payload;
    },
    setNewTaskNotification: (state, action) => {
      state.newTaskNotification = action.payload;
    },

    setTaskToShow: (state, action) => {
      state.taskToShow = action.payload;
    },

    setClearTask: state => {
      state.newTaskData = null;
      state.newTaskNotification = false;
      state.taskToShow = null;
    },

    setLoadingTask: (state, action) => {
      state.isLoadingTask = action.payload;
    },
  },
});

export const {
  setIpLocation,
  setApkInfo,
  setUserAllPermissionSuccess,
  setUserAllPermissionData,
  setNewTaskData,
  setNewTaskNotification,
  setTaskToShow,
  setClearTask,
  setLoadingTask,
} = globalSlice.actions;

export default globalSlice.reducer;
