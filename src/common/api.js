import axios from 'axios';

let store;

export const injectStore = _store => {
  store = _store;
};

// axios.interceptors.request.use(config => {
//   // const access_token = store.getState().authSlice.loginUserData.access_token;
//   // console.log('tokens', store.getState().authSlice.loginUserData.access_token);
//   // if (access_token) {
//   //   config.headers.authorization = `Bearer ${access_token}`;
//   // }
//   // return config;
// });
