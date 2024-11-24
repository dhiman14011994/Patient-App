import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {ENDPOINTS, METHOD, REDUCERS} from '../utils/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../utils/constants';
import {BaseModel} from '../models/BaseMode';
import {ChatDataProps, LanguageProps, SkillProps} from '../models/FilterMode';

export const filterSlice = createApi({
  reducerPath: REDUCERS.FILTER,
  baseQuery: fetchBaseQuery({
    baseUrl: ENDPOINTS.BASE_URL,

    prepareHeaders: async (headers, {endpoint}) => {
      headers.set('Content-Type', 'application/json');
      // const token = getPrefsValue(CONSTANTS.STORAGE.TOKEN);
      const token = await AsyncStorage.getItem(CONSTANTS.STORAGE.TOKEN);
      const apiName = ['getAllSkillListApi', 'getAllLanguageListApi']; // put here name of screen where you want to hide tabBar
      const isIncludes = apiName.indexOf(endpoint) <= -1;
      if (!isIncludes) {
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
      getAllSkillListApi: builder.query<BaseModel<SkillProps[]>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.SKILL_LIST}${params}`,
            method: METHOD.GET,
          };
        },
      }),
      getAllLanguageListApi: builder.query<BaseModel<LanguageProps[]>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.GET_LANGUAGE}${params}`,
            method: METHOD.GET,
          };
        },
      }),
      getFilterPartnerListApi: builder.query<BaseModel<[]>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.GET_FILTER_PARTNER}${params.trim()}`,
            method: METHOD.GET,
          };
        },
      }),
      getChatListApi: builder.query<BaseModel<ChatDataProps[]>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.GET_CHAT}${params}`,
            method: METHOD.GET,
          };
        },
      }),
      readMessageApi: builder.mutation({
        query: params => {
          return {
            url: `${ENDPOINTS.READ_MESSAGE}${params}`,
            method: METHOD.POST,
          };
        },
      }),
      appointmentfeedbackApi: builder.mutation({
        query: params => {
          return {
            url: `${ENDPOINTS.FEEDBACK_APPOINTMENT}${params.id}`,
            method: METHOD.POST,
            body: params.data,
          };
        },
      }),
      appointmentCallRecordingApi: builder.mutation({
        query: params => {
          return {
            url: `${ENDPOINTS.CALL_RECORDING}${params.id}`,
            method: METHOD.POST,
            body: params.data,
          };
        },
      }),
      appointmentGetCallRecordingApi: builder.mutation({
        query: params => {
          return {
            url: `${ENDPOINTS.CALL_RECORDING}${params.id}`,
            method: METHOD.GET,
          };
        },
      }),
    };
  },
});

export const {
  useLazyGetAllSkillListApiQuery,
  useLazyGetAllLanguageListApiQuery,
  useLazyGetFilterPartnerListApiQuery,
  useLazyGetChatListApiQuery,
  useReadMessageApiMutation,
  useAppointmentfeedbackApiMutation,
  useAppointmentCallRecordingApiMutation,
  useAppointmentGetCallRecordingApiMutation,
} = filterSlice;
