const ENDPOINTS = {
  // BASE_URL: 'http://openmindsapi.codefactstech.com:8080/',
  // BASE_URL: 'https://openmindsapi.codefactstech.com/',
  BASE_URL: 'https://devapi.mindtalks.in/',
  LOGIN: 'auth/api/v1/login',
  VERIFY: 'auth/api/v1/verifyLogin',
  SOCIAL_LOGIN: 'auth/api/v1/socialLogin',
  RESEND_CODE: 'auth/api/v1/resendOTP',
  DELETE_ACCOUNT: 'auth/api/v1/deleteAccount',
  LOGOUT: 'auth/api/v1/logOut',
  GET_ALL_PARTNERS: 'listing/api/v1/getAllPartners',
  GET_PARTNER: 'listing/api/v1/getPartner/',
  PERSONAL_INFO: 'auth/api/v1/createClientAccount',
  GET_ALL_CATEGORIES: 'listing/api/v1/getAllCategories',
  GET_BLOG: 'listing/api/v1/blog',
  FILE_UPLOAD: 'auth/api/v1/fileUpload',
  GET_ALL_USER: 'listing/api/v1/getAllUsers',
  GET_SPECIALITY: 'listing/api/v1/getAllSpeciality',
  GET_ALL_APPOINTMENTS:
    'appointment/api/v1/getAllAppointments?search=All&&type=',
  CREATE_APPOINTMENT: 'appointment/api/v1/createAppointment',
  SEARCH: 'listing/api/v1/dashboardSearch',
  GET_USER: 'listing/api/v1/getUser/',
  GET_BANNER: 'listing/api/v1/banner',
  GET_TESTIMONIALS: 'listing/api/v1/getTestimonials',
  SIMILAR_PSYCHOLOGIST: 'listing/api/v1/similarPsychologist',
  GET_RATTING: 'listing/api/v1/rating/',
  UPCOMING_APPOINTMENTS:
    'appointment/api/v1/getUpcommingAppointments?search=All',
  SKILL_LIST: 'listing/api/v1/getAllSpeciality',
  GET_ALL_LIST: 'listing',
  GET_LANGUAGE: 'listing/api/v1/language',
  GET_FILTER_PARTNER: 'listing/api/v1/getAllPartners',
  GET_CHAT: 'listing/api/v1/getChat/',
  READ_MESSAGE: 'appointment/api/v1/readMessages/',
  JOINWAITLIST: 'appointment/api/v1/joinWaitList',
  GET_CHAT_SESSION: 'appointment/api/v1/chatSession/',
  WAIT_APPOINTMENT_UPDATE:
    'appointment/api/v1/updateWaitListAppointmentStatus/',
  FEEDBACK_APPOINTMENT: 'listing/api/v1/feedback/',
  RECHARGE: 'payment/api/v1/recharge',
  GET_ALL_TRANSACTION:
    'payment/api/v1/getAllTransactionByUser?page=1&limit=1000',
  CHARGE_CHAT: 'payment/api/v1/chargeUserChat',
  REFRESH_TOKEN: 'auth/api/v1/refreshToken',
  CALL_RECORDING: 'appointment/api/v1/callRecording/',
  CANCEL_CREATE_APPOINTMENT: 'appointment/api/v1/updateAppointmentStatus/',
};
// const SOCKET_URL = 'https://openmindsapi.codefactstech.com';
const SOCKET_URL = 'https://devapi.mindtalks.in';
const METHOD = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  PUT: 'PUT',
};

const REDUCERS = {
  APP: 'app',
  AUTH: 'auth',
  HOME: 'home',
  FILTER: 'filter',
  PAYMENT: 'payment',
};

export {ENDPOINTS, METHOD, REDUCERS, SOCKET_URL};
