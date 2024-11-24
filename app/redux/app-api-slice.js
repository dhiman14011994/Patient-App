import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {REDUCERS} from '../utils/endpoints';

const initialState = {
  isLogin: false,
  userInfo: {},
  token: '',
  categoriesList: [],
  partnerList: [],
  sortBy: [
    {
      id: 1,
      name: 'Popularity',
      isSelected: false,
      value: 'popularity',
    },
    {
      id: 2,
      name: 'Experience: High to Low',
      isSelected: false,
      value: 'exp_high_to_low',
    },
    {
      id: 3,
      name: 'Experience: Low to High',
      isSelected: false,
      value: 'exp_low_to_high',
    },
    {
      id: 4,
      name: 'Orders: High to Low',
      isSelected: false,
      value: 'orders_high_to_low',
    },
    {
      id: 5,
      name: 'Orders: Low to High',
      isSelected: false,
      value: 'orders_low_to_high',
    },
    {
      id: 6,
      name: 'Price: High to Low ',
      isSelected: false,
      value: 'price_high_to_low',
    },
    {
      id: 7,
      name: 'Price: Low to High ',
      isSelected: false,
      value: 'price_low_to_high',
    },
    {
      id: 8,
      name: 'Rating: High to Low ',
      isSelected: false,
      value: 'rating_high_to_low',
    },
    {
      id: 9,
      name: 'Rating: Low to High ',
      isSelected: false,
      value: 'rating_low_to_high',
    },
  ],
  skill: [
    {
      id: 1,
      name: 'Problem solving',
      isSelected: false,
    },
    {
      id: 2,
      name: 'Communication',
      isSelected: false,
    },
    {
      id: 3,
      name: 'Critical thinking',
      isSelected: false,
    },
    {
      id: 4,
      name: 'Empathy',
      isSelected: false,
    },
    {
      id: 5,
      name: 'Patience',
      isSelected: false,
    },
    {
      id: 6,
      name: 'Research skills',
      isSelected: false,
    },
    {
      id: 7,
      name: 'Active listening',
      isSelected: false,
    },
    {
      id: 8,
      name: 'Research',
      isSelected: false,
    },
    {
      id: 9,
      name: 'Interpersonal communication',
      isSelected: false,
    },
  ],
  language: [
    {
      id: 1,
      name: 'English',
      value: 'english',
      isSelected: false,
    },
    {
      id: 2,
      name: 'Hindi',
      value: 'hindi',
      isSelected: false,
    },
    {
      id: 3,
      name: 'Bengali',
      value: 'bengali',
      isSelected: false,
    },
    {
      id: 4,
      name: 'Gujarati',
      value: 'gujarati',
      isSelected: false,
    },
    {
      id: 5,
      name: 'Kannada',
      value: 'kannada',
      isSelected: false,
    },
    {
      id: 6,
      name: 'Malayalam',
      value: 'malayalm',
      isSelected: false,
    },
    {
      id: 7,
      name: 'Marathi',
      value: 'marathi',
      isSelected: false,
    },
    {
      id: 8,
      name: 'Punjabi',
      value: 'punjabi',
      isSelected: false,
    },
    {
      id: 9,
      name: 'Tamil',
      value: 'tamil',
      isSelected: false,
    },
  ],
  gender: [
    {
      id: 1,
      name: 'Male',
      value: 'male',
      isSelected: false,
    },
    {
      id: 2,
      name: 'Female',
      value: 'female',
      isSelected: false,
    },
    {
      id: 3,
      name: 'Other',
      value: 'other',
      isSelected: false,
    },
  ],
  country: [
    {
      id: 1,
      name: 'India',
      value: 'india',
      isSelected: false,
    },
    {
      id: 2,
      name: 'Other',
      value: 'other',
      isSelected: false,
    },
  ],
  Offer: [
    {
      id: 1,
      name: 'Active',
      value: 'active',
      isSelected: false,
    },
    {
      id: 2,
      name: 'Not Active',
      value: 'not_active',
      isSelected: false,
    },
  ],
  topPsychologist: [
    {
      id: 1,
      name: 'Celebrity',
      description:
        'They have the highest fan following & people crazy about them',
      value: 'celebrity',
      isSelected: false,
    },
    {
      id: 2,
      name: 'Top Choice',
      description: 'If you talk to them once, you are their customer for life.',
      value: 'top_choice',
      isSelected: false,
    },
    {
      id: 3,
      name: 'Rising Star',
      description: 'They are high in demand & have strong customer loyalty.',
      value: 'rising_star',
      isSelected: false,
    },
    {
      id: 4,
      name: 'All',
      description:
        'It includes all verified Psychologist, hired after 5 rounds of interviews.',
      value: 'all',
      isSelected: false,
    },
  ],
  filterCount: 0,
  queryValue: '',
  waitList: {},
  similarList: [],
  chatText: '',
  waitData: {},
  isSessionRuning: false,
  sessionTimer: 0,
  sessionChatTimer: 0,
};

const appStateSlice = createSlice({
  name: REDUCERS.APP,
  initialState,
  reducers: {
    setIsLogin(state, action) {
      state.isLogin = action.payload;
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setCategoriesList(state, action) {
      state.categoriesList = action.payload;
    },
    setPartnerList(state, action) {
      state.partnerList = action.payload;
    },
    setSortByList(state, action) {
      state.sortBy = action.payload;
    },
    setSkillList(state, action) {
      state.skill = action.payload;
    },
    setLanguageList(state, action) {
      state.language = action.payload;
    },
    setGenderList(state, action) {
      state.gender = action.payload;
    },
    setCountryList(state, action) {
      state.country = action.payload;
    },
    setOfferList(state, action) {
      state.Offer = action.payload;
    },
    setTopPsychologistList(state, action) {
      state.topPsychologist = action.payload;
    },
    setFilterCount(state, action) {
      state.filterCount = action.payload;
    },
    setQueryValue(state, action) {
      state.queryValue = action.payload;
    },
    setWaitListValue(state, action) {
      state.waitList = action.payload;
    },
    setSimilarList(state, action) {
      state.similarList = action.payload;
    },
    setChatText(state, action) {
      state.chatText = action.payload;
    },
    setWaitDataInfo(state, action) {
      state.waitData = action.payload;
    },
    setSessionRunning(state, action) {
      state.isSessionRuning = action.payload;
    },
    setSessionTimer(state, action) {
      state.sessionTimer = action.payload;
    },
    setSessionChatTimer(state, action) {
      state.sessionChatTimer = action.payload;
    },
  },
});

export const {
  setIsLogin,
  setUserInfo,
  setToken,
  setCategoriesList,
  setPartnerList,
  setCountryList,
  setFilterCount,
  setGenderList,
  setLanguageList,
  setOfferList,
  setSkillList,
  setSortByList,
  setTopPsychologistList,
  setQueryValue,
  setWaitListValue,
  setSimilarList,
  setChatText,
  setWaitDataInfo,
  setSessionRunning,
  setSessionTimer,
  setSessionChatTimer,
} = appStateSlice.actions;
export default appStateSlice.reducer;
