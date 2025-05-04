import {apiSlice} from '../api/apiSlice';

export const globalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    //userWiseToken FCM Token api: /api/mobile_firebase_token/
    userWiseTokenFCMTokenSend: builder.mutation({
      query: (body: any) => ({
        url: '/api/mobile_firebase_token/',
        method: 'POST',
        body: body,
      }),
    }),
  }),
});

export const {
  useUserWiseTokenFCMTokenSendMutation,
  // userWiseTokenFCMTokenSend,
} = globalApiSlice;
