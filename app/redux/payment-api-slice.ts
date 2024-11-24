import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {ENDPOINTS, METHOD, REDUCERS} from '../utils/endpoints';
// import {getPrefsValue} from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../utils/constants';
import {BaseModel} from '../models/BaseMode';

export const PaymentSlice = createApi({
  reducerPath: REDUCERS.PAYMENT,
  baseQuery: fetchBaseQuery({
    baseUrl: ENDPOINTS.BASE_URL,

    prepareHeaders: async (headers, {endpoint}) => {
      headers.set('Content-Type', 'application/json');
      // const token = getPrefsValue(CONSTANTS.STORAGE.TOKEN);
      const token = await AsyncStorage.getItem(CONSTANTS.STORAGE.TOKEN);
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
      getOrderId: builder.mutation<BaseModel<void>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.RECHARGE}`,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      updatePayment: builder.mutation<BaseModel<void>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.RECHARGE}`,
            method: METHOD.PUT,
            body: params,
          };
        },
      }),
      getAllTransactionApi: builder.query<BaseModel<void>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.GET_ALL_TRANSACTION}`,
            method: METHOD.GET,
          };
        },
      }),
      chargeChatApi: builder.mutation<BaseModel<void>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.CHARGE_CHAT}`,
            method: METHOD.POST,
            body: params,
          };
        },
      }),
      cancelAppointmentScheduleApi: builder.mutation<BaseModel<void>, any>({
        query: params => {
          return {
            url: `${ENDPOINTS.CANCEL_CREATE_APPOINTMENT}${params.id}`,
            method: METHOD.POST,
            body: params.data,
          };
        },
      }),
    };
  },
});

export const {
  useGetOrderIdMutation,
  useUpdatePaymentMutation,
  useLazyGetAllTransactionApiQuery,
  useChargeChatApiMutation,
  useCancelAppointmentScheduleApiMutation,
} = PaymentSlice;
