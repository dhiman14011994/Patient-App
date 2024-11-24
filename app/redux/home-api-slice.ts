import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {ENDPOINTS, METHOD, REDUCERS} from '../utils/endpoints';
// import {getPrefsValue} from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../utils/constants';
import {BaseModel} from '../models/BaseMode';
import {
  AppointmentListProps,
  AppointmentProps,
  BannerProps,
  BlogProps,
  CategoriesProps,
  PartnerList,
  rattingAllProps,
  SearchProps,
  TestimonialsProps,
} from '../models/HomeMode';

export const homeSlice = createApi({
  reducerPath: REDUCERS.HOME,
  baseQuery: fetchBaseQuery({
    baseUrl: ENDPOINTS.BASE_URL,

    prepareHeaders: async (headers, {endpoint}) => {
      headers.set('Content-Type', 'application/json');
      // const token = getPrefsValue(CONSTANTS.STORAGE.TOKEN);
      const token = await AsyncStorage.getItem(CONSTANTS.STORAGE.TOKEN);
      console.log('data', token);
      if (endpoint === 'getAllCategoriesApi') {
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
      getAllPartnersApi: builder.query<BaseModel<PartnerList[]>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.GET_ALL_PARTNERS}${params}`,
            method: METHOD.GET,
          };
        },
      }),
      getPartnerApi: builder.query<BaseModel<PartnerList>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.GET_PARTNER}${params}`,
            method: METHOD.GET,
          };
        },
      }),
      getAllCategoriesApi: builder.query<BaseModel<CategoriesProps[]>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.GET_ALL_CATEGORIES}?page=1&limit=1000`,
            method: METHOD.GET,
          };
        },
      }),
      getAllBlogApi: builder.query<BaseModel<BlogProps[]>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.GET_BLOG}`,
            method: METHOD.GET,
          };
        },
      }),
      createAppointmentApi: builder.mutation({
        query: params => {
          return {
            url: `${ENDPOINTS.CREATE_APPOINTMENT}`,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      getAllAppointmentsApi: builder.query<
        BaseModel<AppointmentListProps>,
        any
      >({
        query: param => {
          return {
            url: `${ENDPOINTS.GET_ALL_APPOINTMENTS}${param}`,
            method: METHOD.GET,
          };
        },
      }),
      getUpcomingAppointmentsApi: builder.query<
        BaseModel<AppointmentProps[]>,
        any
      >({
        query: () => {
          return {
            url: ENDPOINTS.UPCOMING_APPOINTMENTS,
            method: METHOD.GET,
          };
        },
      }),
      searchDataApi: builder.query<BaseModel<SearchProps[]>, any>({
        query: param => {
          return {
            url: `${ENDPOINTS.SEARCH}${param}`,
            method: METHOD.GET,
          };
        },
      }),
      getBannerApi: builder.query<BaseModel<BannerProps[]>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.GET_BANNER}`,
            method: METHOD.GET,
          };
        },
      }),
      getTestimonialsApi: builder.query<BaseModel<TestimonialsProps[]>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.GET_TESTIMONIALS}${params}`,
            method: METHOD.GET,
          };
        },
      }),
      getRattingsApi: builder.query<BaseModel<rattingAllProps[]>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.GET_RATTING}${params}`,
            method: METHOD.GET,
          };
        },
      }),
      addRattingsApi: builder.mutation({
        query: params => {
          return {
            url: `${ENDPOINTS.GET_RATTING}${params.id}`,
            method: METHOD.POST,
            body: params.data,
          };
        },
      }),
      similarPsychologistApi: builder.query<BaseModel<PartnerList[]>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.SIMILAR_PSYCHOLOGIST}${params}`,
            method: METHOD.GET,
          };
        },
      }),
      joinWaitListApi: builder.mutation({
        query: params => {
          return {
            url: `${ENDPOINTS.JOINWAITLIST}`,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      getSessionDetailsApi: builder.mutation({
        query: params => {
          return {
            url: `${ENDPOINTS.GET_CHAT_SESSION}${params}`,
            method: METHOD.POST,
          };
        },
      }),
      updateSessionDetailsApi: builder.mutation({
        query: params => {
          return {
            url: `${ENDPOINTS.GET_CHAT_SESSION}${params.appointmentId}`,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      updateWaitListAppointmentApi: builder.mutation({
        query: params => {
          return {
            url: `${ENDPOINTS.WAIT_APPOINTMENT_UPDATE}${params.id}`,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
    };
  },
});

export const {
  useLazyGetAllPartnersApiQuery,
  useLazyGetPartnerApiQuery,
  useLazyGetAllCategoriesApiQuery,
  useLazyGetAllBlogApiQuery,
  useCreateAppointmentApiMutation,
  useLazyGetAllAppointmentsApiQuery,
  useLazySearchDataApiQuery,
  useLazyGetBannerApiQuery,
  useLazyGetTestimonialsApiQuery,
  useLazySimilarPsychologistApiQuery,
  useLazyGetRattingsApiQuery,
  useLazyGetUpcomingAppointmentsApiQuery,
  useJoinWaitListApiMutation,
  useGetSessionDetailsApiMutation,
  useUpdateSessionDetailsApiMutation,
  useAddRattingsApiMutation,
  useUpdateWaitListAppointmentApiMutation,
} = homeSlice;
