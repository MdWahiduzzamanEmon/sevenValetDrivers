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
  newPasscode?: string;
  curLocation?: string;
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
          ...(data.newPasscode && {newPasscode: data.newPasscode}),
          ...(data.curLocation && {curLocation: data.curLocation}),
        },
      }),
      transformErrorResponse: (response: any) => {
        // Safely transform error response to prevent crashes
        return {
          status: response.status || 'UNKNOWN_ERROR',
          error: response.data || response.error || 'Unknown error occurred',
          message:
            response.data?.message ||
            response.error?.message ||
            'Update failed',
        };
      },
      invalidatesTags: ['UserProfile', 'DriverLocationArea'], // Invalidate the UserProfile cache tag
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
export const {
  useLoginMutation,
  useUpdateProfileMutation,
  useLogoutApiMutation,
} = authApiSlice;
