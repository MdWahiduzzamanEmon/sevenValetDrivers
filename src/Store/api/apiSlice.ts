/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import apiUrl from '../../Base';
import {Alert} from 'react-native';
// import {
//   logOut,
//   setLoginDataFromAfterRefreshToken,
// } from '../feature/Auth_slice/Auth_slice';

import {
  setUserAllPermissionData,
  setUserAllPermissionSuccess,
} from '../feature/globalSlice';
// import {loginUserData} from '../feature/Auth_slice/Auth_slice';

let REFRESH_TOKEN = '';

const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl?.master,
  // credentials: "include",
  prepareHeaders: async (headers, {getState}: any) => {
    const token = getState()?.authSlice?.loginUserData?.access_token;
    REFRESH_TOKEN = getState()?.authSlice?.loginUserData?.refresh_token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
  // credentials: 'include', // include, same-origin, omit
});

const baseQueryWithRetry = async (args: any, api: any, extraOptions: any) => {
  let result = (await baseQuery(args, api, extraOptions)) as any;

  if (result?.error?.status === 403) {
    // return cToastify({
    //   type: 'error',
    //   message: result?.error?.data?.message || 'Forbidden',
    // });

    Alert.alert(
      'Forbidden',
      result?.error?.data?.message || 'Forbidden',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
    return;
  } else if (result?.error?.status === 500) {
    // return errorAlert({
    //   text: 'Internal Server Error',
    // });

    Alert.alert(
      'Internal Server Error',
      'Internal Server Error',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );

    return;
  } else if (result.error?.originalStatus === 429) {
    // return cToastify({
    //   type: 'error',
    //   message: result?.error?.data || 'Too Many Requests',
    // });

    Alert.alert(
      'Too Many Requests',
      result?.error?.data || 'Too Many Requests',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );

    return;
  }

  // const dispatch = api.dispatch;
  // console.log(api);
  // console.log('result', result?.meta?.response?.status);
  if (result?.meta?.response?.status === 401) {
    // const token = REFRESH_TOKEN;
    const refreshResult = (await baseQuery(
      {
        url: '/token-refresh/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${REFRESH_TOKEN}`,
        },
        credentials: 'include',
        body: {
          refresh: REFRESH_TOKEN,
        },
      },
      api,
      extraOptions,
    )) as any;
    // console.log('token', REFRESH_TOKEN);
    // console.log('refreshResult', refreshResult);
    if (refreshResult?.data) {
      // api?.dispatch(setLoginDataFromAfterRefreshToken(refreshResult?.data));
      // result = await baseQuery(args, api, extraOptions);
    }

    let showCount = 0;
    if (refreshResult?.error?.status === 401) {
      // api?.dispatch(logOut());
      api?.dispatch(setUserAllPermissionSuccess(false));
      api?.dispatch(setUserAllPermissionData({}));
      showCount++;
      if (showCount === 1) {
        Alert.alert(
          refreshResult?.error?.data?.error || 'Session Expired',
          refreshResult?.error?.data?.message ||
            'Your session has expired. Please login again',
          [
            {
              text: 'Ok',
              onPress: () => {
                showCount = 0;
              },
            },
          ],
        );
      } else {
        showCount = 0;
      }
    }
  } else {
    return result;
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry as unknown as BaseQueryFn<unknown, unknown, {}>,

  endpoints: () => ({}),
  tagTypes: [
    'UNAUTHORIZED',
    'UNKNOWN_ERROR',
    'currentUser',
    'getWithdrawalMethodsBank',
    'depositDetails',
    'withdrawDetailsList',
    'projectsDetails',
    'myInvestedProjects',
    'singleProjectsDetails',
    'userInformationImage',
    'investorWithdrawLog',
    'userInvestedProjects',
    'userPermissionData',
  ],
  refetchOnReconnect: true,
}) as any;
