import {
  View,
  Text,
  Platform,
  StatusBar,
  FlatList,
  Animated,
  BackHandler,
  Alert,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import GTLinearGradientView from '../../components/GTLinearGradientView';
import CONSTANTS from '../../utils/constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FILTER_ICON, Humburger_Icon} from '../../assets';
import GTHeader from '../../components/GTHeader';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import GTCategoryItem from '../../components/GTCategoryItem';
import GTFlatlist from '../../components/GTFlatlist/GTFlatlist';
import GTItemHeader from '../../components/GTItemHeader';
import PagingDotContainer from '../../components/PagingDotContainer';
import GTUserListView from '../../components/GTUserListView';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {RouteNames} from '../../utils/routesName';
import GTModal from '../../components/GTModal';
import GTFilterContainer from '../../components/GTFilterContainer';
import {
  useLazyGetAllLanguageListApiQuery,
  useLazyGetAllSkillListApiQuery,
  useLazyGetFilterPartnerListApiQuery,
} from '../../redux/filter-api-slice';
import {
  setIsLogin,
  setLanguageList,
  setQueryValue,
  setSkillList,
  setToken,
} from '../../redux/app-api-slice';
import GTIndicator from '../../components/GTIndicator';
import ListEmptyComponent from '../../components/ListEmptyComponent/ListEmptyComponent';
import {useLazyGetBannerApiQuery} from '../../redux/home-api-slice';
import GTImage from '../../components/GTImage';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GTScheduleChatContainer from '../../components/GTScheduleChatContainer';
import {
  useCreateAppointmentApiMutation,
  useJoinWaitListApiMutation,
  useLazySimilarPsychologistApiQuery,
} from '../../redux/home-api-slice';

import {
  setSimilarList,
  setUserInfo,
  setWaitListValue,
} from '../../redux/app-api-slice';
import GTAddAmountView from '../../components/GTAddAmountView';
import GTOfflinePopup from '../../components/GTOfflinePopup';
import GTWaitComponent from '../../components/GTWaitComponent';
import {useLazyGetUserDataApiQuery} from '../../redux/auth-api-slice';
import GTOfflineSimilerUserView from '../../components/GTOfflineSimilerUserView';
//@ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import {
  useGetOrderIdMutation,
  useUpdatePaymentMutation,
} from '../../redux/payment-api-slice';
import GTRazorpayWebView from '../../components/GTRazorpayWebView';

const Chat = () => {
  const insets = useSafeAreaInsets();
  const {
    categoriesList,
    partnerList,
    sortBy,
    skill,
    language,
    gender,
    country,
    Offer,
    topPsychologist,
    filterCount,
    queryValue,
    userInfo,
  } = useSelector((state: any) => state.appState);
  const [visible, setVisible] = useState(false);
  const [sortbyText, setSortBy] = useState('');
  const [skillText, setSkillText] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [genderText, setGenderText] = useState('');
  const [countryText, setCountryText] = useState('');
  const [offerFilter, setOfferFilter] = useState('');
  const [topPsyText, setTopPsyText] = useState('');
  const [selectedId, setSelectedId] = useState('11');
  const [queryText, setQueryText] = useState('');
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const homeData = [{}, {}];
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, CONSTANTS.THEME.size.WIDTH - 64);
  const flashListRef: any = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [getAllSkillListApi, {data: skillData, isLoading: skillLoading}] =
    useLazyGetAllSkillListApiQuery();
  const [
    getAllLanguageListApi,
    {data: languageData, isLoading: languageLoading},
  ] = useLazyGetAllLanguageListApiQuery();

  const [getFilterPartnerList, {data: partnerData, isLoading: partnerLoading}] =
    useLazyGetFilterPartnerListApiQuery();
  const [isSimilarData, setIsSimilarData] = useState(false);
  const [getBannerApi, {data: bannerListData, isLoading: bannerLoading}] =
    useLazyGetBannerApiQuery();
  const [createAppointmentApi, {isLoading: createAppointmentLoading}] =
    useCreateAppointmentApiMutation();
  const [partnerDetails, setPartnerDetails] = useState<any>({});
  const [isWait, setIsWait] = useState(false);
  const [title, setTitle] = useState('');
  const [isLeave, setIsLeave] = useState(false);
  const [date, setDate] = useState(new Date());
  const isFocus = useIsFocused();
  const flatlistRef: any = useRef();
  const route: any = useRoute();
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [amountDetail, setAmountDetail] = useState<any>({});
  const [selectLanguage, setSelectLanguage] = useState('');
  const [getOrderId, {isLoading: orderLoading}] = useGetOrderIdMutation();
  const [
    similarPsychologistApi,
    {data: similarPsychologist, isLoading: isSimilar},
  ] = useLazySimilarPsychologistApiQuery();
  const [updatePayment, {isLoading: paymentLoading}] =
    useUpdatePaymentMutation();
  const [joinWaitListApi] = useJoinWaitListApiMutation();

  const [getUserDataApi, {isLoading: getUserLoading}] =
    useLazyGetUserDataApiQuery();
  const {waitList, similarList} = useSelector((state: any) => state.appState);
  //from Home
  const [appointmentType, setAppointmentType] = useState('chat');
  const [isNow, setIsNow] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const moveBackRef: any = useRef(null);
  const moveForwordRef: any = useRef(null);
  const monthRef: any = useRef(null);
  const dateTimeRef: any = useRef(null);
  const onScrollRef: any = useRef(null);
  const timerRef: any = useRef(null);
  const onRef: any = useRef(null);
  const navRef: any = useRef(null);
  const [orderId, setOderId] = useState('');
  const [amountValue, setAmountValue] = useState(0);
  const [isPayment, setIsPayment] = useState(false);

  const joinButtonPress = () => {
    var params = {
      appointmentType: 'chat',
      chatSchedule: isNow ? 'Now' : 'Schedule',
      language:
        selectLanguage ||
        partnerDetails?.language[0]?.value ||
        '6686466306177dc325124ef4',
      psychologistId: partnerDetails?._id,
      scheduledDateTime: date,
      title: title,
    };
    joinWaitListApi(params)
      .unwrap()
      .then(res => {
        setIsWait(false);
        setTitle('');
        setIsNow(true);
        setPartnerDetails({});
        setDate(new Date());
        setTimeout(() => {
          Toast.show({
            type: 'success',
            text2:
              res?.responseMessage ||
              'Please wait, your appointment is in waitlist.',
          });
        }, 200);
      })
      .catch(err => {
        setIsWait(false);
        setDate(new Date());
        setTitle('');
        setPartnerDetails({});
        console.log('join waitlist api err', err);
        if (err.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: err?.responseMessage || err?.data || '',
          });
        }
      });
  };

  useEffect(() => {
    // scroll to current month
    if (flatlistRef.current && categoriesData?.length != 0) {
      flatlistRef?.current?.scrollToIndex({
        index: route?.params?.curerrntIndex || 0,
        animated: true,
      });
      if (route?.params?.id) {
        setSelectedId(route?.params?.id || '11');
      }
    }
    getFilterPartnerData(
      route?.params?.id ? `?category=${route?.params?.id}` : '',
    );
  }, [isFocus, categoriesData]);

  useEffect(() => {
    setCategoriesData(
      categoriesList
        ? [{_id: '11', name: 'All', image: ''}, ...categoriesList]
        : [],
    );
    getSkillList();
    getLanguageList();

    getBannerData();
    return () => {
      if (monthRef.current) {
        clearTimeout(monthRef.current);
      }
      if (moveBackRef.current) {
        clearTimeout(moveBackRef.current);
      }
      if (moveForwordRef.current) {
        clearTimeout(moveForwordRef.current);
      }
      if (dateTimeRef.current) {
        clearTimeout(dateTimeRef.current);
      }
      if (onScrollRef.current) {
        clearTimeout(onScrollRef.current);
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (navRef.current) {
        clearTimeout(navRef.current);
      }
      if (onRef.current) {
        clearTimeout(onRef.current);
      }
    };
  }, []);

  const scheduleAppointment = ({data, type}: any) => {
    var params = {
      chatSchedule: isNow ? 'Now' : 'Schedule',
      scheduledDateTime: isNow ? null : data?.date || date,
      psychologistId: data?.id,
      // title: title,
      appointmentType: type,
    };
    createAppointmentApi(params)
      .unwrap()
      .then(res => {
        setVisible(false);
        setTimeout(() => {
          if (res.data == undefined) {
            removeSimilarData();
            setIsWait(true);
          } else {
            userChatScreen(res.data);
            removeSimilarData();
            setTitle('');
            setDate(new Date());
            setIsNow(true);
            setPartnerDetails({});
          }
        }, 200);
      })
      .catch(err => {
        console.log('err>>>', JSON.stringify(err));
        setVisible(false);
        setPartnerDetails({});
        setIsNow(true);
        setTitle('');
        setDate(new Date());
        if (err.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: err?.responseMessage || err?.data || '',
          });
        } else if (err?.status == 403) {
          Alert.alert(
            CONSTANTS.TEXT.SESSION_EXPIRED,
            CONSTANTS.TEXT.YOU_HAVE_LOGIN,
            [
              {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
              },
              {
                text: 'YES',
                onPress: () => {
                  logout();
                },
              },
            ],
          );
        }
      });
  };

  const logout = async () => {
    dispatch(setIsLogin(false));
    dispatch(setUserInfo({}));
    dispatch(setToken(''));
    await AsyncStorage.setItem(CONSTANTS.STORAGE.ISLOGGED, 'false');
    await AsyncStorage.setItem(CONSTANTS.STORAGE.USER_DATA, '');
    await AsyncStorage.setItem(CONSTANTS.STORAGE.TOKEN, '');
  };

  const userChatScreen = async (appointmentData: any) => {
    if (appointmentData.appointmentType == 'call') {
      // @ts-ignore
      navigation.navigate(RouteNames.USER_CALL, {
        data: appointmentData,
        isWait: false,
      });
    } else {
      //@ts-ignore
      navigation.navigate(RouteNames.USER_CHAT, {
        data: appointmentData,
        isWait: false,
        isDirect: true,
      });
    }
  };

  const removeSimilarData = () => {
    if (isSimilarData) {
      leaveSimilarData();
    }
  };
  const callPaymentGateway = (order_id: string, amountDue: string) => {
    var options = {
      description: '',
      image: userInfo?.profilePicture || '',
      currency: 'INR',
      key: 'rzp_test_4rrCmYtqWUOUvT', // Your api key
      amount: amountDue,
      order_id: order_id,
      name: userInfo?.firstName || '',
      prefill: {
        email: userInfo?.email || '',
        contact: userInfo?.mobileNumber || '',
        name: userInfo?.firstName || '',
      },
      theme: {color: CONSTANTS.THEME.colors.PRIMARY_COLOR},
    };

    RazorpayCheckout.open(options)
      .then((data: any) => {
        // handle success
        const {razorpay_payment_id, razorpay_order_id} = data;
        updatePaymentAPI(razorpay_payment_id, razorpay_order_id);
      })
      .catch(() => {
        // Alert.alert(`Errasync or: ${error.code} | ${error.description}`);
      });
  };
  const updatePaymentAPI = async (paymentId: string, orderId: string) => {
    try {
      let params = {orderId: orderId, paymentId: paymentId};
      updatePayment(params)
        .unwrap()
        .then(response => {
          getUserInfoData();
          Toast.show({
            type: 'success',
            text2: 'Payment updated successfully',
          });
        })
        .catch(error => {
          console.log('Error', error);
        });
    } catch (err) {
      console.log('Error', err);
    }
  };
  const leaveSimilarData = () => {
    dispatch(setWaitListValue({}));
    dispatch(setSimilarList([]));
    AsyncStorage.removeItem(CONSTANTS.STORAGE.SIMILAR_LIST);
    AsyncStorage.removeItem(CONSTANTS.STORAGE.WAITLIST);
    setIsLeave(false);
  };
  const getUserInfoData = () => {
    getUserDataApi(userInfo?._id || userInfo?.id)
      .unwrap()
      .then(async res => {
        dispatch(setUserInfo(res.data));
        await AsyncStorage.setItem(
          CONSTANTS.STORAGE.USER_DATA,
          JSON.stringify(res.data),
        );
        scheduleAppointment({
          data: {
            date: date,
            id: partnerDetails?._id || partnerDetails?.id,
          },
          type: appointmentType,
        });
      })
      .catch(e => {
        console.log('error', JSON.stringify(e));
      });
  };
  const getOrderIdAPI = async (amount: any) => {
    try {
      let params = {currency: 'INR', amount: amount};
      getOrderId(params)
        .unwrap()
        .then((res: any) => {
          // callPaymentGateway(res?.data?.id || '', res?.data?.amount || '');
          if (res?.data?.id) {
            setOderId(res?.data?.id);
            setAmountValue(res?.data?.amount);
            setIsPayment(true);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log('Error', err);
    }
  };
  const okayButtonPress = () => {
    try {
      dispatch(setWaitListValue(partnerDetails));
      AsyncStorage.setItem(
        CONSTANTS.STORAGE.WAITLIST,
        JSON.stringify(partnerDetails),
      );
      setVisible(false);
      getSimilarPartner();
    } catch (e) {
      setVisible(false);
    }
  };
  const getSimilarPartner = () => {
    try {
      similarPsychologistApi(`?page=1&limit=10&id=${partnerDetails?._id}`)
        .unwrap()
        .then(res => {
          AsyncStorage.setItem(
            CONSTANTS.STORAGE.SIMILAR_LIST,
            JSON.stringify(res.data || []),
          );
          dispatch(setSimilarList(res?.data || []));
          setVisible(false);
          setPartnerDetails({});
        })
        .catch(err => {
          setVisible(false);
          setPartnerDetails({});
          console.log('err>>', err);
          if (err.originalStatus == 503) {
            Toast.show({
              type: 'error',
              text2: err?.responseMessage || err?.data || '',
            });
          }
        });
    } catch (e) {
      setVisible(false);
    }
  };

  const getBannerData = () => {
    getBannerApi('')
      .unwrap()
      .then((res: any) => {})
      .catch((err: any) => {
        console.log('banner error', err);
        if (err.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: err?.responseMessage || err?.data || '',
          });
        }
      });
  };

  const getFilterPartnerData = async (data: any) => {
    getFilterPartnerList(data)
      .unwrap()
      .then(res => {})
      .catch(e => {
        console.log('filterPartnerError', e);
        if (e.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: e?.responseMessage || e?.data || '',
          });
        }
      });
  };

  const getSkillList = () => {
    getAllSkillListApi('?page=1&limit=100')
      .unwrap()
      .then(res => {
        dispatch(setSkillList(res?.data || []));
      })
      .catch(e => {
        console.log(e);
        if (e.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: e?.responseMessage || e?.data || '',
          });
        }
      });
  };

  const getLanguageList = () => {
    getAllLanguageListApi('')
      .unwrap()
      .then(res => {
        dispatch(setLanguageList(res?.data || []));
      })
      .catch(e => {
        console.log(e);
        if (e.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: e?.responseMessage || e?.data || '',
          });
        }
      });
  };

  const renderCategories = ({item, index}: any) => {
    return (
      <GTCategoryItem
        extra={{height: 100, width: 100, padding: 0}}
        onPress={() => {
          setSelectedId(item._id || '11');
          getFilterPartnerData(
            index == 0
              ? queryValue
                ? `?${
                    queryValue.indexOf('?') == 0
                      ? queryValue.replace('?', '&')
                      : queryValue
                  }`
                : ''
              : queryValue
              ? `?category=${item?._id}${
                  queryValue.indexOf('?') == 0
                    ? queryValue.replace('?', '&')
                    : queryValue
                }`
              : `?category=${item?._id}`,
          );
        }}
        text={item?.name}
        container={{
          ...styles.itemContainer,
          borderColor:
            item?._id == selectedId
              ? CONSTANTS.THEME.colors.WHITE[40]
              : CONSTANTS.THEME.colors.WHITE[20],
          backgroundColor:
            item?._id == selectedId
              ? CONSTANTS.THEME.colors.WHITE[20]
              : CONSTANTS.THEME.colors.TRANSPARENT,
          marginLeft: index == 0 ? CONSTANTS.THEME.size.WIDTH * 0.03 : 0,
          // paddingBottom: 0,
        }}
        resizeMode={'contain'}
        textColor={CONSTANTS.THEME.colors.WHITE[80]}
        imageItemStyle={{
          ...styles.imageStyle,
        }}
        fontSize={CONSTANTS.THEME.size.s14}
        textStyle={{maxWidth: '100%', marginLeft: 20}}
        isView={true}
        uri={item?.image || ''}
      />
    );
  };

  const ListHeaderComponent = () => {
    return (
      <View>
        <GTHeader
          text={CONSTANTS.TEXT.CHAT_PSYCHOLOGIST}
          leftIcon={
            <Humburger_Icon
              width={CONSTANTS.THEME.size.s28}
              height={CONSTANTS.THEME.size.s28}
            />
          }
          rightIcon={
            <FILTER_ICON
              width={CONSTANTS.THEME.size.s28}
              height={CONSTANTS.THEME.size.s28}
            />
          }
          count={filterCount}
          customStyle={styles.headerContainer}
          onHandleLeftPress={() => {
            //@ts-ignore
            navigation.navigate(RouteNames.SETTING_STACK);
          }}
          onHandleRightPress={() => {
            setFilterVisible(true);
          }}
          textStyle={{textAlign: 'left'}}
        />
        <GTLinearGradientView
          container={{
            backgroundColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <GTLinearGradientView
              color2={CONSTANTS.THEME.colors.WHITE[50]}
              color1={CONSTANTS.THEME.colors.WHITE[0]}
              container={{
                width: '50%',
                height: 1,
              }}
            />
            <GTLinearGradientView
              color1={CONSTANTS.THEME.colors.WHITE[50]}
              color2={CONSTANTS.THEME.colors.WHITE[0]}
              container={{
                width: '50%',
                height: 1,
              }}
            />
          </View>
          <View style={[styles.categoriesStyle, {marginBottom: 0}]}>
            <FlatList
              data={[...categoriesData]}
              renderItem={({item, index}: any) =>
                renderCategories({item, index})
              }
              ref={flatlistRef}
              style={{flex: 1}}
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces={false}
              onScrollToIndexFailed={error => {
                setTimeout(() => {
                  if (categoriesData.length !== 0 && flatlistRef !== null) {
                    flatlistRef.current.scrollToIndex({
                      index: error.index,
                      animated: true,
                    });
                  }
                }, 100);
              }}
            />
          </View>
        </GTLinearGradientView>
      </View>
    );
  };
  useEffect(() => {
    const backAction = () => {
      setFilterVisible(false);
      navRef.current = setTimeout(() => {
        navigation.goBack();
      });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const ListFooterComponent = () => {
    return (
      <View
        style={{
          height: 100,
          backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
        }}
      />
    );
  };

  const renderImageItem = ({item, index}: any) => {
    return (
      <View style={styles.bannerMainContainer}>
        {item.image && (
          <GTImage uri={item.image} imageStyle={styles.bannerMainContainer} />
        )}
      </View>
    );
  };

  const setVisbleView = () => {
    setTimeout(() => {
      setVisible(true);
    }, 500);
  };

  const renderTrending = ({item, index}: any) => {
    return (
      <GTUserListView
        key={(index + 1).toString()}
        isOffline={!item?.isOnline}
        isWait={false}
        isTime={false}
        statusText={!item?.isOnline ? 'Offline' : ''}
        imageStyle={styles.imagesStyle}
        item={item}
        isChat={true}
        onPress={() => {
          //@ts-ignore
          navigation.navigate(RouteNames.PSYCHOLOGIST, {data: item});
        }}
        chatOnPress={(type: string) => {
          setAppointmentType(type);
          setPartnerDetails(item);
          if (item?.isOnline) {
            if (userInfo?.balance > item?.wageForChat) {
              scheduleAppointment({
                data: {
                  date: date,
                  id: item?._id || item?.id,
                },
                type: type,
              });
            } else {
              setVisbleView();
            }
          } else {
            setVisbleView();
          }
        }}
        userBalance={userInfo?.balance || 0}
      />
    );
  };
  const renderItem = ({item, index}: any) => {
    if (index == 0) {
      return (
        <View style={[styles.bannerView]}>
          <GTFlatlist
            scrollX={scrollX}
            flatListref={flashListRef}
            setCurrentIndex={setCurrentIndex}
            data={bannerListData?.data || []}
            bounces={false}
            renderItem={renderImageItem}
          />
          <View style={styles.pageContainer}>
            <PagingDotContainer
              elements={bannerListData?.data || []}
              position={position}
              dotColor={CONSTANTS.THEME.colors.PRIMARY_COLOR}
            />
          </View>
        </View>
      );
    } else if (index == 1) {
      return (
        <View style={[styles.trandingContainer, {marginTop: 0, paddingTop: 0}]}>
          <GTItemHeader
            title={CONSTANTS.TEXT.TRENDING}
            rightText={CONSTANTS.TEXT.VIEW_ALL}
            containerStyle={{marginVertical: '5%'}}
            rightTextOnPress={() => {
              //@ts-ignore
              navigation.navigate(RouteNames.ALL_APPOINTMENT);
            }}
          />
          {/* @ts-ignore */}
          <FlatList
            bounces={false}
            showsVerticalScrollIndicator={false}
            data={partnerData?.data || []}
            //@ts-ignore
            renderItem={renderTrending}
            ListEmptyComponent={ListEmptyComponent}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={ListFooterComponent}
          />
        </View>
      );
    }
  };

  const getFilterValueAll = (data: boolean) => {
    let nestedArray = [
      sortBy,
      skill,
      language,
      gender,
      country,
      Offer,
      topPsychologist,
    ];
    var fiterQuery =
      selectedId == '11'
        ? `?${sortbyText}${
            skillText ? (sortbyText ? '&' + skillText : skillText) : ''
          }${
            languageFilter
              ? sortbyText || skillText
                ? '&' + languageFilter
                : languageFilter
              : ''
          }${
            genderText
              ? sortbyText || skillText || languageFilter
                ? '&' + genderText
                : genderText
              : ''
          }
          ${
            countryText
              ? sortbyText || skillText || languageFilter || genderText
                ? '&' + countryText
                : countryText
              : ''
          }${
            offerFilter
              ? sortbyText ||
                skillText ||
                languageFilter ||
                genderText ||
                countryText
                ? '&' + offerFilter
                : offerFilter
              : ''
          }${
            topPsyText
              ? sortbyText ||
                skillText ||
                languageFilter ||
                genderText ||
                countryText ||
                offerFilter
                ? '&' + topPsyText
                : topPsyText
              : ''
          }`
        : `${sortbyText ? '&' + sortbyText : ''}${
            skillText ? (sortbyText ? '&' + skillText : skillText) : ''
          }${
            languageFilter
              ? sortbyText || skillText
                ? '&' + languageFilter
                : languageFilter
              : ''
          }${
            genderText
              ? sortbyText || skillText || languageFilter
                ? '&' + genderText
                : genderText
              : ''
          }
          ${
            countryText
              ? sortbyText || skillText || languageFilter || genderText
                ? '&' + countryText
                : countryText
              : ''
          }${
            offerFilter
              ? sortbyText ||
                skillText ||
                languageFilter ||
                genderText ||
                countryText
                ? '&' + offerFilter
                : offerFilter
              : ''
          }${
            topPsyText
              ? sortbyText ||
                skillText ||
                languageFilter ||
                genderText ||
                countryText ||
                offerFilter
                ? '&' + topPsyText
                : topPsyText
              : ''
          }`;
    if (selectedId == '11') {
      if (queryText) {
        if (fiterQuery == '?') {
          getFilterPartnerData('');
        } else {
          getFilterPartnerData(fiterQuery);
        }
      } else {
        if (fiterQuery !== '?') {
          getFilterPartnerData(fiterQuery);
        }
      }
    } else {
      if (queryValue) {
        if (fiterQuery == '?') {
          getFilterPartnerData(`?category=${selectedId}`);
        } else {
          getFilterPartnerData(`?category=${selectedId}${fiterQuery}`);
        }
      } else {
        if (fiterQuery !== '?') {
          getFilterPartnerData(`?category=${selectedId}${fiterQuery}`);
        }
      }
    }
    dispatch(setQueryValue(fiterQuery == '?' ? '' : fiterQuery));
    setQueryText(fiterQuery == '?' ? '' : fiterQuery);
    if (data) {
      setFilterVisible(false);
    }
  };

  const clearFilter = () => {
    getFilterPartnerData(
      route?.params?.id ? `?category=${route?.params?.id}` : '',
    );
  };

  return (
    <View>
      {Platform.OS == 'android' ? (
        <GTLinearGradientView container={{height: insets.top}}>
          <StatusBar
            translucent={true}
            backgroundColor={CONSTANTS.THEME.colors.TRANSPARENT}
          />
        </GTLinearGradientView>
      ) : (
        <GTLinearGradientView
          container={{
            height: insets.top,
            backgroundColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
          }}
        />
      )}

      {ListHeaderComponent()}
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces={false}
        data={homeData}
        //@ts-ignore
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={ListFooterComponent}
      />

      <GTModal
        container={{justifyContent: 'flex-end'}}
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}>
        <GTFilterContainer
          onClosePress={() => {
            setFilterVisible(false);
          }}
          getFilterValueAll={getFilterValueAll}
          setCountryText={setCountryText}
          setGenderText={setGenderText}
          setLanguageFilter={setLanguageFilter}
          setOfferFilter={setOfferFilter}
          setSkillText={setSkillText}
          setTopPsyText={setTopPsyText}
          setSortBy={setSortBy}
          clearFilter={() => {
            clearFilter();
          }}
        />
      </GTModal>

      <GTModal
        container={{
          justifyContent: partnerDetails?.isOnline ? 'flex-end' : 'center',
        }}
        visible={visible}
        onClose={() => {
          setVisible(false);
          setPartnerDetails({});
        }}>
        {partnerDetails?.isOnline ? (
          userInfo?.balance > partnerDetails?.wageForChat ? (
            <GTScheduleChatContainer
              selected={isNow}
              onClosePress={() => {
                setVisible(false);
                setPartnerDetails({});
              }}
              setDate={setDate}
              date={date}
              title={title}
              setTitle={setTitle}
              isKeyboard={keyboardStatus}
              selectedDate={selectedDate}
              selectedSchedule={(data: any) => {
                setIsNow(data);
                setSelectedDate(data);
              }}
              keyboardHeight={keyboardHeight}
              isLoading={createAppointmentLoading}
              onPress={() => {
                setVisible(false);
              }}
            />
          ) : (
            <GTAddAmountView
              onClosePress={() => {
                setVisible(false);
              }}
              item={partnerDetails}
              setAmountDetail={setAmountDetail}
              amountDetail={amountDetail}
              onPress={() => {
                setVisible(false);
                setTimeout(() => {
                  getOrderIdAPI(amountDetail?.balance);
                }, 200);
              }}
            />
          )
        ) : (
          <GTOfflinePopup
            onClosePress={() => {
              setVisible(false);
              setPartnerDetails({});
            }}
            partnerDetails={partnerDetails}
            cureentUser={userInfo}
            buttonPress={() => {
              okayButtonPress();
            }}
          />
        )}
      </GTModal>

      <GTModal
        container={{
          justifyContent: 'center',
        }}
        visible={isWait}
        onClose={() => {
          setIsWait(false);
          setPartnerDetails({});
        }}>
        <GTWaitComponent
          onClosePress={() => {
            setIsWait(false);
            setPartnerDetails({});
          }}
          partnerDetails={partnerDetails}
          cureentUser={userInfo}
          setSelectLanguage={setSelectLanguage}
          selectLanguage={selectLanguage}
          buttonPress={() => {
            joinButtonPress();
          }}
        />
      </GTModal>
      <GTModal
        container={{
          justifyContent: 'center',
        }}
        visible={isLeave}
        onClose={() => {
          setIsLeave(false);
        }}>
        <GTOfflineSimilerUserView
          similarData={similarList}
          name={`${waitList?.firstName || 'abc'}${
            waitList?.lastName ? ' ' + waitList?.lastName : ''
          }`}
          onClosePress={() => {
            setIsLeave(false);
          }}
          leavePress={() => {
            leaveSimilarData();
            setIsLeave(false);
          }}
          onView={(it: any) => {
            setIsLeave(false);
            setTimeout(() => {
              //@ts-ignore
              navigation.navigate(RouteNames.PSYCHOLOGIST, {data: it});
            }, 500);
          }}
          onChat={(it: any) => {
            setIsLeave(false);
            setTimeout(() => {
              setIsSimilarData(true);
              setPartnerDetails(it);
              setAppointmentType('chat');
              if (it?.isOnline) {
                if (userInfo?.balance > it?.wageForChat) {
                  scheduleAppointment({
                    data: {
                      date: date,
                      id: it?._id || it?.id,
                    },
                    type: 'chat',
                  });
                } else {
                  setVisbleView();
                }
              } else {
                setVisbleView();
              }
            }, 500);
          }}
        />
      </GTModal>
      {(partnerLoading ||
        languageLoading ||
        skillLoading ||
        createAppointmentLoading) && <GTIndicator />}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPayment}
        onRequestClose={() => {
          setIsPayment(false);
        }}>
        <GTRazorpayWebView
          orderId={orderId}
          amount={amountValue}
          PaymentResponseSuccess={(response: any) => {
            updatePaymentAPI(
              response?.razorpay_payment_id,
              response?.razorpay_order_id,
            );
            setIsPayment(false);
          }}
          PaymentResponseFailure={() => {
            Toast.show({
              type: 'error',
              text1: 'Payment Failed',
              text2: 'Payment failed, please try again.',
            });
            setIsPayment(false);
          }}
          userInfo={userInfo}
        />
      </Modal>
    </View>
  );
};

export default Chat;
