import {LOGIN_PUBLIC_KEY, UPDATE_PROFILE_PUBLIC_KEY} from '../../../Base';
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
      query: (data: UpdateProfileRequest) => {
        console.log('data-updateProfile-slice', data);
        return {
          url: `/updateProfile?publickey=${UPDATE_PROFILE_PUBLIC_KEY}`,
          method: 'POST',
          body: {
            recId: data.recId,
            language: data.language,
            newPasscode: data.newPasscode,
          },
        };
      },
    }),
  }),
});

export const {useLoginMutation, useUpdateProfileMutation} = authApiSlice;
