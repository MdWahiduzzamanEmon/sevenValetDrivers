import {PUBLIC_KEY} from '../../../Base';
import {apiSlice} from '../../api/apiSlice';
import type {EndpointBuilder} from '@reduxjs/toolkit/query';

interface LoginRequest {
  driverId: string;
  passcode: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    login: builder.mutation({
      query: (data: LoginRequest) => ({
        url: `/authenticateDriver?publickey=${PUBLIC_KEY}`,
        method: 'POST',
        body: {
          driverId: data.driverId,
          passcode: data.passcode?.toString(),
        },
      }),
    }),
  }),
});

export const {useLoginMutation} = authApiSlice;
