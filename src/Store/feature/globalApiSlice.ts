import {EndpointBuilder} from '@reduxjs/toolkit/query';
import {
  COMPLETE_TASK_PUBLIC_KEY,
  GET_ASSIGNED_TASK_PUBLIC_KEY,
  GET_DRIVER_PROFILE_PUBLIC_KEY,
  START_TASK_PUBLIC_KEY,
  UPDATE_FCM_TOKEN_PUBLIC_KEY,
  UPDATE_LOCATION_PUBLIC_KEY,
} from '../../Base';
import {apiSlice} from '../api/apiSlice';

export interface UpdateLocationData {
  driverId: string;
  latitude: string;
  longitude: string;
  speed: number | null;
  heading: number | null;
}

export const globalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    //get user profile
    getUserProfile: builder.query({
      // /authenticateDriver?publickey=${LOGIN_PUBLIC_KEY}
      query: (id: string) => ({
        // console.log('id', id);

        url: `/get_driver_profile_data?publickey=${GET_DRIVER_PROFILE_PUBLIC_KEY}`,
        method: 'GET',
        params: {
          driverId: id,
        },
      }),
      providesTags: ['UserProfile'],
    }),

    //get get_assigned_task
    getAssignedTask: builder.query({
      query: (id: string) => {
        return {
          url: `/get_assigned_task?publickey=${GET_ASSIGNED_TASK_PUBLIC_KEY}`,
          method: 'GET',
          params: {
            driverId: id,
          },
        };
      },
    }),

    //update location
    // url: `/updateLocation?publickey=${UPDATE_LOCATION_PUBLIC_KEY}`,
    updateDriverLocation: builder.mutation({
      query: (data: UpdateLocationData) => ({
        url: `/updateLocation?publickey=${UPDATE_LOCATION_PUBLIC_KEY}`,
        method: 'POST',
        body: {
          driverId: data.driverId,
          latitude: data.latitude,
          longitude: data.longitude,
          speed: data.speed,
          heading: data.heading,
        },
      }),
    }),

    //start_task
    startNewTask: builder.mutation({
      query: (data: UpdateLocationData) => ({
        url: `/start_task?publickey=${START_TASK_PUBLIC_KEY}`,
        method: 'POST',
        body: {
          driverId: data.driverId,
          latitude: data.latitude,
          longitude: data.longitude,
          speed: data.speed,
          heading: data.heading,
        },
      }),
    }),

    //completed_task
    completeTask: builder.mutation({
      query: (data: UpdateLocationData) => ({
        url: `/completed_task?publickey=${COMPLETE_TASK_PUBLIC_KEY}`,
        method: 'POST',
        body: {
          driverId: data.driverId,
          latitude: data.latitude,
          longitude: data.longitude,
          speed: data.speed,
          heading: data.heading,
        },
      }),
    }),

    //send fcm token to the zoho api
    sendFcmTokenToZoho: builder.mutation({
      query: (data: {fcmToken: string; driverId: string}) => ({
        url: `/update_fcm_token?publickey=${UPDATE_FCM_TOKEN_PUBLIC_KEY}`,
        method: 'POST',
        body: {
          fcmToken: data.fcmToken,
          driverId: data.driverId,
        },
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useGetAssignedTaskQuery,
  useLazyGetAssignedTaskQuery,

  // update location
  useUpdateDriverLocationMutation,

  // send fcm token to the zoho api
  useSendFcmTokenToZohoMutation,

  // start task
  useStartNewTaskMutation,
  // complete task
  useCompleteTaskMutation,
} = globalApiSlice;
