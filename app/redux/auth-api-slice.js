import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {ENDPOINTS, METHOD, REDUCERS} from '../utils/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../utils/constants';

export const authSlice = createApi({
  reducerPath: REDUCERS.AUTH,
  baseQuery: fetchBaseQuery({
    baseUrl: ENDPOINTS.BASE_URL,

    prepareHeaders: async (headers, {endpoint}) => {
      if (endpoint === 'uploadFileApi') {
        headers.set('Content-Type', 'multipart/form-data');
      } else {
        headers.set('Content-Type', 'application/json');
      }

      const token = await AsyncStorage.getItem(CONSTANTS.STORAGE.TOKEN);
      if (
        endpoint === 'loginApi' ||
        endpoint === 'otpVerificationApi' ||
        endpoint === 'resendCodeApi' ||
        endpoint === 'socialLoginApi'
      ) {
        return headers;
      }
      if (token) {
        headers.set('Authorization', token);
      }
      return headers;
    },
  }),

  endpoints(builder) {
    return {
      loginApi: builder.mutation({
        query: params => {
          return {
            url: ENDPOINTS.LOGIN,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      otpVerificationApi: builder.mutation({
        query: params => {
          return {
            url: ENDPOINTS.VERIFY,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      resendCodeApi: builder.mutation({
        query: params => {
          return {
            url: ENDPOINTS.RESEND_CODE,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      socialLoginApi: builder.mutation({
        query: params => {
          return {
            url: ENDPOINTS.SOCIAL_LOGIN,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      personalInformationApi: builder.mutation({
        query: params => {
          return {
            url: ENDPOINTS.PERSONAL_INFO,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      logoutApi: builder.mutation({
        query: params => {
          return {
            url: ENDPOINTS.LOGOUT,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      uploadFileApi: builder.mutation({
        query: params => {
          return {
            url: ENDPOINTS.FILE_UPLOAD,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      getAllUserApi: builder.query({
        query: params => {
          return {
            url: ENDPOINTS.GET_ALL_USER,
            method: METHOD.GET,
            body: params,
          };
        },
      }),
      getUserDataApi: builder.query({
        query: params => {
          return {
            url: `${ENDPOINTS.GET_USER}${params}`,
            method: METHOD.GET,
          };
        },
      }),
      deleteUserDataApi: builder.query({
        query: params => {
          return {
            url: `${ENDPOINTS.DELETE_ACCOUNT}`,
            method: METHOD.DELETE,
          };
        },
      }),
      logoutAccountApi: builder.mutation({
        query: params => {
          return {
            url: `${ENDPOINTS.LOGOUT}`,
            method: METHOD.POST,
          };
        },
      }),
      refreshAccessTokenApi: builder.query({
        query: params => {
          return {
            url: ENDPOINTS.REFRESH_TOKEN,
            method: METHOD.GET,
          };
        },
      }),
    };
  },
});

export const {
  useLoginApiMutation,
  useOtpVerificationApiMutation,
  useResendCodeApiMutation,
  useSocialLoginApiMutation,
  usePersonalInformationApiMutation,
  useLogoutApiMutation,
  useUploadFileApiMutation,
  useLazyGetAllUserApiQuery,
  useLazyGetUserDataApiQuery,
  useLazyDeleteUserDataApiQuery,
  useLogoutAccountApiMutation,
  useLazyRefreshAccessTokenApiQuery,
} = authSlice;
