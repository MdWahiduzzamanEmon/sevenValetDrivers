import {
  LOGIN_PUBLIC_KEY,
  LOGOUT_PUBLIC_KEY,
  UPDATE_PROFILE_PUBLIC_KEY,
} from '../../../Base';
import {apiSlice} from '../../api/apiSlice';
import type {EndpointBuilder} from '@reduxjs/toolkit/query';

interface LoginRequest {
  driverId: string;
  passcode: string;
}

interface UpdateProfileRequest {
  recId: number;
  language: string;
  newPasscode: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    login: builder.mutation({
      query: (data: LoginRequest) => ({
        url: `/authenticateDriver?publickey=${LOGIN_PUBLIC_KEY}`,
        method: 'POST',
        body: {
          driverId: data.driverId,
          passcode: data.passcode?.toString(),
        },
      }),
    }),

    //profile update
    updateProfile: builder.mutation({
      query: (data: UpdateProfileRequest) => ({
        url: `/updateProfile?publickey=${UPDATE_PROFILE_PUBLIC_KEY}`,
        method: 'POST',
        body: {
          recId: data.recId,
          language: data.language,
          newPasscode: data.newPasscode,
        },
      }),
      invalidatesTags: ['UserProfile'], // Invalidate the UserProfile cache tag
    }),

    //logout
    logoutApi: builder.mutation({
      query: (data: any) => ({
        url: `/driver_log_out?publickey=${LOGOUT_PUBLIC_KEY}`,
        method: 'POST',
        body: {
          driverId: data.driverId,
        },
      }),
    }),
  }),
});
export const {useLoginMutation, useUpdateProfileMutation, useLogoutApiMutation} =
  authApiSlice;
