import {
  View,
  Animated,
  FlatList,
  Alert,
  BackHandler,
  RefreshControl,
  Keyboard,
  KeyboardEvent,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CONSTANTS from '../../../utils/constants';
import styles from './styles';
import GTLabel from '../../../components/GTLabel/index';
import GTFlatlist from '../../../components/GTFlatlist/GTFlatlist';
import PagingDotContainer from '../../../components/PagingDotContainer';
import GTCategoryList from '../../../components/GTCategoryList';
import GTItemHeader from '../../../components/GTItemHeader';
import GTUserListView from '../../../components/GTUserListView';
import GTCarousalFlatList from '../../../components/GTCarousalFlatList';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCategoriesList,
  setIsLogin,
  setPartnerList,
  setSimilarList,
  setToken,
  setUserInfo,
  setWaitListValue,
} from '../../../redux/app-api-slice';

import {
  Star_Icon,
  VerifyIcon,
  Calender_Icon,
  ChatIcon,
  CallIcon,
} from '../../../assets';
import {
  useCreateAppointmentApiMutation,
  useJoinWaitListApiMutation,
  useLazyGetAllBlogApiQuery,
  useLazyGetAllCategoriesApiQuery,
  useLazyGetAllPartnersApiQuery,
  useLazyGetBannerApiQuery,
  useLazySimilarPsychologistApiQuery,
} from '../../../redux/home-api-slice';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {RouteNames} from '../../../utils/routesName';
import GTIndicator from '../../../components/GTIndicator';
import GTImage from '../../../components/GTImage';
import socketServices from '../../../utils/socketService';
import Toast from 'react-native-toast-message';
import GTModal from '../../../components/GTModal';
import GTScheduleChatContainer from '../../../components/GTScheduleChatContainer';
import GTOfflinePopup from '../../../components/GTOfflinePopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GTWaitComponent from '../../../components/GTWaitComponent';
import GTOfflineUserView from '../../../components/GTOfflineUserView';
import GTOfflineSimilerUserView from '../../../components/GTOfflineSimilerUserView';
import GTAddAmountView from '../../../components/GTAddAmountView';
import {compareTwoDate} from '../../../utils/customFunction';
import Background from '../../../assets/images/Background.svg';
import GTHomeBanner from '../../../components/GTHomeBanner';
//@ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import {
  useGetOrderIdMutation,
  useUpdatePaymentMutation,
} from '../../../redux/payment-api-slice';
import {
  useLazyGetUserDataApiQuery,
  useLazyRefreshAccessTokenApiQuery,
} from '../../../redux/auth-api-slice';
import {onboardingData} from '../../../utils/CustomData';
import GTHomeHeader from '../../../components/GTHomeHeader/GTHomeHeader';
import SecureComponent from '../../../components/GTSecureComponent';
import FeedbackComponent from '../../../components/GTFeedbackComponent';
import {ChatAppointmentIcon, CallAppointmentIcon1} from '../../../assets';
import {PhoneIcon} from '../../../assets';
import GTRazorpayWebView from '../../../components/GTRazorpayWebView';

const Home = () => {
  const insets = useSafeAreaInsets();
  const homeData = [{}, {}, {}, {}, {}, {}, {}, {}];
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const flashListRef: any = useRef(null);
  const [isNow, setIsNow] = useState(true);
  const navigation = useNavigation();
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, CONSTANTS.THEME.size.WIDTH - 64);
  const dispatch = useDispatch();
  const [getAllPartnersApi, {data, isLoading: partnerLoading}] =
    useLazyGetAllPartnersApiQuery();
  const [
    getAllCategoriesApi,
    {data: categories, isLoading: categoriesLoading},
  ] = useLazyGetAllCategoriesApiQuery();
  const [getAllBlog, {data: blogData, isLoading: blogLoading}] =
    useLazyGetAllBlogApiQuery();
  const [getBannerApi, {data: bannerListData, isLoading: bannerLoading}] =
    useLazyGetBannerApiQuery();
  const {userInfo, waitList, similarList} = useSelector(
    (state: any) => state.appState,
  );
  const [getOrderId, {isLoading: orderLoading}] = useGetOrderIdMutation();
  const [updatePayment, {isLoading: paymentLoading}] =
    useUpdatePaymentMutation();
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [title, setTitle] = useState('');
  const [createAppointmentApi, {isLoading: createAppointmentLoading}] =
    useCreateAppointmentApiMutation();
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState<any>({});
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isWait, setIsWait] = useState(false);
  const [isLeave, setIsLeave] = useState(false);
  const [selectLanguage, setSelectLanguage] = useState('');
  const [joinWaitListApi] = useJoinWaitListApiMutation();
  const todayDate = new Date();
  const [
    similarPsychologistApi,
    {data: similarPsychologist, isLoading: isSimilar},
  ] = useLazySimilarPsychologistApiQuery();
  const [isSimilarData, setIsSimilarData] = useState(false);
  const [amountDetail, setAmountDetail] = useState<any>({});
  const [partnerData, setPartnerData] = useState<any[]>([]);
  const [onlinePartnerData, setOnlinePartnerData] = useState<any[]>([]);
  const isFocus = useIsFocused();
  const [isCategoriesData, setIsCategoriesData] = useState(false);
  const [getUserDataApi, {isLoading: getUserLoading}] =
    useLazyGetUserDataApiQuery();

  const [refreshAccessTokenApi] = useLazyRefreshAccessTokenApiQuery();
  const moveRef: any = useRef(null);
  const sucessRef: any = useRef(null);
  const monthRef: any = useRef(null);
  const failRef: any = useRef(null);
  const onScrollRef: any = useRef(null);
  const timerRef: any = useRef(null);
  const onRef: any = useRef(null);
  const navRef: any = useRef(null);
  const [orderId, setOderId] = useState('');
  const [amountValue, setAmountValue] = useState(0);
  const [isPayment, setIsPayment] = useState(false);

  useEffect(() => {
    if (isFocus) {
      updateSecreenStatus();
      updateValue();
    }

    return () => {
      if (monthRef.current) {
        clearTimeout(monthRef.current);
      }
      if (moveRef.current) {
        clearTimeout(moveRef.current);
      }
      if (sucessRef.current) {
        clearTimeout(sucessRef.current);
      }
      if (failRef.current) {
        clearTimeout(failRef.current);
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
  }, [isFocus]);

  const updateValue = () => {};

  const updateSecreenStatus = async () => {
    await AsyncStorage.setItem(CONSTANTS.STORAGE.SCREEN_NAME, 'Home');
    await AsyncStorage.setItem(CONSTANTS.STORAGE.IS_UPDATE, '1');
  };
  const {width, height} = Dimensions.get('window');
  const [appointmentType, setAppointmentType] = useState<String>('chat');
  useEffect(() => {
    socketServices.on('notification', async (data: any) => {
      try {
        const userInf: any = await AsyncStorage.getItem(
          CONSTANTS.STORAGE.USER_DATA,
        );
        const userInfos =
          userInf == null
            ? {}
            : userInf == undefined
            ? {}
            : userInf == ''
            ? {}
            : JSON.parse(userInf);
        if (data?.body?.receiverId === userInfos?._id) {
          // Toast.show({
          //   type: 'success',
          //   text2: `Hi ${userInfos?.firstName}, ${data?.body?.message}`,
          // });
          if (data.body?.notificationType == 'Appointment') {
            var isToday = compareTwoDate({
              startDate: todayDate,
              endDate: data?.body?.appointmentDetail?.scheduledDateTime,
            });

            if (isToday) {
              // userChatScreen(data?.body?.appointmentDetail);
            }
          }
          if (data.body?.notificationType == 'onlineStatus') {
            updatePartnerData({
              data: data?.body?.appointmentDetail,
              isBusy: false,
            });
          }
        }

        if (data.body?.notificationType == 'partnerBusyStatus') {
          updatePartnerData({
            data: data,
            isBusy: true,
          });
          console.log('data.body>>', data);
        }
      } catch (error) {
        console.log('error', error);
      }
    });
  }, []);

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

  const userChatScreen = async (appointmentData: any) => {
    if (appointmentData.appointmentType == 'call') {
      await AsyncStorage.setItem(CONSTANTS.STORAGE.SCREEN_NAME, 'chat');
      // @ts-ignore
      navigation.navigate(RouteNames.USER_CALL, {
        data: appointmentData,
        isWait: false,
      });
    } else {
      await AsyncStorage.setItem(CONSTANTS.STORAGE.SCREEN_NAME, 'call');
      //@ts-ignore
      navigation.navigate(RouteNames.USER_CHAT, {
        data: appointmentData,
        isWait: false,
        isDirect: true,
      });
    }
  };

  const updatePartnerData = ({data, isBusy}: any) => {
    if (partnerData.length == 0) {
      getPartnerListData();
    } else {
      var oldPartner = partnerData.map((item, index) => {
        if (item._id == data?._id || data?.partnerId) {
          if (isBusy) {
            return {...item, isBusy: data?.body?.partnerBusyStatus};
          } else {
            return {...item, isOnline: data?.isOnline};
          }
        }
        return item;
      });
      monthRef.current = setTimeout(() => {
        if (oldPartner?.length != 0) {
          setPartnerData(
            oldPartner?.length != 0 ? [...oldPartner] : [...partnerData],
          );
        }
      });
    }
  };

  // Back press Handler manage
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Exit app!', 'Are you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  //keyboard status manage
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      (e: KeyboardEvent) => {
        setKeyboardHeight(e?.endCoordinates?.height);
        setKeyboardStatus(true);
      },
    );
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      setKeyboardStatus(false);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  //Pull to referece manage
  useEffect(() => {
    getPartnerListData();
    getCategories();
    getBlogData();
    getBannerData();
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, [refreshing]);

  const getBannerData = () => {
    getBannerApi('')
      .unwrap()
      .then((res: any) => {
        setRefreshing(false);
      })
      .catch((err: any) => {
        setRefreshing(false);
        console.log('banner error', err);
        if (err?.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: err.responseMessage || err?.data || '',
          });
        } else if (err?.status === 403 || err?.status === 401) {
          refreshAccessTokenApi('')
            .unwrap()
            .then(async res => {
              dispatch(setToken(res?.data?.accessToken));
              await AsyncStorage.setItem(
                CONSTANTS.STORAGE.TOKEN,
                res?.data?.accessToken || '',
              );
              getPartnerListData();
              getCategories();
              getBlogData();
              getBannerData();
            })
            .catch(err => {});
        }
      });
  };

  const getBlogData = () => {
    getAllBlog('')
      .unwrap()
      .then(res => {
        setRefreshing(false);
      })
      .catch(e => {
        setRefreshing(false);
        console.log('blog error>>', JSON.stringify(e));
      });
  };

  const getCategories = () => {
    getAllCategoriesApi('?page=1&limit=10')
      .unwrap()
      .then((res: any) => {
        setRefreshing(false);
        dispatch(setCategoriesList(res?.data || []));
      })
      .catch(e => {
        setRefreshing(false);
        console.log(e);
        if (e.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: e.responseMessage || e?.data || '',
          });
        }
      });
  };

  const getPartnerListData = () => {
    getAllPartnersApi('?page=1&limit=100')
      .unwrap()
      .then((res: any) => {
        setRefreshing(false);
        setPartnerData(res?.data || []);
        var temp = res?.data.filter((item: any) => {
          return item.isOnline;
        });
        setOnlinePartnerData(temp);
        dispatch(setPartnerList(res?.data || []));
      })
      .catch((e: any) => {
        setRefreshing(false);
        console.log(e);
        if (e.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: e.responseMessage || e?.data || '',
          });
        }
      });
  };

  const renderImageItem = ({item, index}: any) => {
    return (
      <View style={styles.bannerMainContainer}>
        <GTImage uri={item?.image} imageStyle={styles.bannerMainContainer} />
      </View>
    );
  };

  const renderTrending = ({item, index}: any) => {
    if (index < 8 && item) {
      return (
        <GTUserListView
          // container={{width:300,height:300}}
          key={(index + 1).toString()}
          isOffline={!item?.isOnline}
          isWait={false}
          isTime={false}
          statusText={!item?.isOnline ? 'Offline' : ''}
          item={item}
          imageStyle={{
            ...styles.imageStyle,
          }}
          onPress={() => {
            //@ts-ignore
            navigation.navigate(RouteNames.PSYCHOLOGIST, {data: item});
          }}
          chatOnPress={(type: String) => {
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
    } else {
      return (
        <View>
          <Text>Hello</Text>
        </View>
      );
    }
  };

  const renderOnline = ({item, index}: any) => {
    if (index < 8 && item) {
      return (
        <GTUserListView
          container={{
            width: width * 0.54,
            backgroundColor: '#F0F5FF',
            margin: 4,
            marginTop: 10,
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            // backgroundColor: 'pink',
          }}
          topContainer={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          nameContainer={{
            marginTop: 10,
            width: '100%',
            // backgroundColor: 'pink',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          nameDetailContainer={{flexDirection: 'column', width: '100%'}}
          isOnline={true}
          userStyle={{width: '100%', justifyContent: 'center'}}
          key={(index + 1).toString()}
          isOffline={!item?.isOnline}
          isWait={false}
          isTime={false}
          statusText={!item?.isOnline ? 'Offline' : ''}
          item={item}
          imageStyle={{
            ...styles.imageStyle,
          }}
          onPress={() => {
            //@ts-ignore
            navigation.navigate(RouteNames.PSYCHOLOGIST, {data: item});
          }}
          chatOnPress={(type: String) => {
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
    }
  };

  const renderItem = ({item, index}: any) => {
    if (index == 0) {
      var bannerData = bannerListData?.data || [];
      if (Array.isArray(bannerData) && bannerData?.length != 0) {
        return (
          <View style={styles.bannerView}>
            <GTFlatlist
              scrollX={scrollX}
              flatListref={flashListRef}
              data={bannerListData?.data || []}
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
      } else {
        return (
          <>
            <GTHomeBanner
              container={{paddingVertical: 30}}
              onHandlePress={() => {
                //@ts-ignore
                navigation.navigate(RouteNames.ALL_APPOINTMENT);
              }}
            />
            {/* <View style={styles.containerBanner}>
          <Background/>
          <View style={styles.textContainer}>
              <Text style={styles.headerText}>PSYCHOLOGY SERVICES</Text>
              <Text style={styles.descriptionText}>
                Psychology Services to individuals, couples, and families.
              </Text>
              <TouchableOpacity style={styles.button1}>
                <Text style={styles.buttonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
            </View> */}
          </>
        );
      }
    } else if (index == 1) {
      var categoriesData = categories?.data || [];
      if (Array.isArray(categoriesData) && categoriesData.length != 0) {
        return (
          <GTCategoryList
            rightTextOnPress={() => {
              setIsCategoriesData(true);
            }}
            data={categories?.data || []}
            title={CONSTANTS.TEXT.TOP_CATEGORIES}
            rightText={!isCategoriesData || true ? CONSTANTS.TEXT.VIEW_ALL : ''}
            itemContainer={styles.itemContainer}
            isFewItemShow={!isCategoriesData}
            numberOfItem={9}
            onPress={({categoryItem, categoryIndex}: any) => {
              //@ts-ignore
              navigation.navigate(RouteNames.CHAT_STACK, {
                screen: RouteNames.CHAT,
                params: {
                  curerrntIndex: categoryIndex + 1,
                  id: categoryItem?._id || categoryItem?.id,
                },
              });
            }}
          />
        );
      } else {
        return <View />;
      }
    } else if (index == 2) {
      if (Array.isArray(partnerData) && partnerData?.length != 0) {
        return (
          <View
            style={[
              styles.trandingContainer,
              {
                marginTop: 0,
                margin: 0,
                overflow: 'hidden',
                padding: 0,
              },
            ]}>
            <GTItemHeader
              title={CONSTANTS.TEXT.ONLINE}
              rightText={CONSTANTS.TEXT.VIEW_ALL}
              // containerStyle={{marginVertical: '5%'}}
              rightTextOnPress={() => {
                //@ts-ignore
                navigation.navigate(RouteNames.ALL_APPOINTMENT, {
                  fromOnline: true,
                });
              }}
            />
            {/* @ts-ignore */}
            <FlatList
              // contentContainerStyle={{backgroundColor: 'red'}}
              data={onlinePartnerData ? [...onlinePartnerData] : []}
              horizontal
              showsHorizontalScrollIndicator={false}
              //@ts-ignore
              renderItem={renderOnline}
              keyExtractor={(item, index) => index.toString()}
              // horizontal
            />
          </View>
        );
      } else {
        return <View />;
      }
    } else if (false && index == 3) {
      var buttonData = [
        {
          label: 'Chat',
          onPress: () => {
            setAppointmentType('chat');
            setPartnerDetails(item);
            if (item?.isOnline) {
              if (userInfo?.balance > item?.wageForChat) {
                scheduleAppointment({
                  data: {
                    date: date,
                    id: item?._id || item?.id,
                  },
                  type: 'chat',
                });
              } else {
                setVisbleView();
              }
            } else {
              setVisbleView();
            }
          },
        },
        {
          label: 'Call',
          onPress: () => {
            setAppointmentType('call');
            setPartnerDetails(item);
            if (item?.isOnline) {
              if (userInfo?.balance > item?.wageForChat) {
                scheduleAppointment({
                  data: {
                    date: date,
                    id: item?._id || item?.id,
                  },
                  type: 'call',
                });
              } else {
                setVisbleView();
              }
            } else {
              setVisbleView();
            }
            console.log('Call is pressed!');
          },
        },
      ];
      if (Array.isArray(partnerData) && partnerData?.length != 0) {
        return (
          <View style={[styles.trandingContainer, {marginTop: 0}]}>
            <GTItemHeader
              title={'My Appointments'}
              rightText={CONSTANTS.TEXT.VIEW_ALL}
              containerStyle={{marginVertical: '5%'}}
              rightTextOnPress={() => {
                //@ts-ignore
                navigation.navigate(RouteNames.ALL_APPOINTMENT);
              }}
            />
            {/* @ts-ignore */}
            <FlatList
              data={partnerData ? [...partnerData] : []}
              //@ts-ignore
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => {
                return (
                  <View
                    style={{
                      width: width * 0.7,
                      margin: 4,
                      padding: 10,
                      paddingBottom: 0,
                      borderColor: '#dfdfdf',
                      borderWidth: 1,
                      borderRadius: 20,
                      backgroundColor: '#F0F5FF',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        //justifyContent:'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={{uri: item?.profilePicture || ''}}
                        style={{
                          ...styles.imageStyle,
                        }}></Image>
                      <View style={{marginHorizontal: 10}}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            color: 'black',
                          }}>
                          {' '}
                          {`${item?.firstName} ${item?.lastName}`}
                        </Text>
                        <View style={{flexDirection: 'row', marginTop: 5}}>
                          <Calender_Icon />
                          <Text style={{color: 'black'}}>16 Sep, 2024</Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 10,
                      }}>
                      {buttonData.map(item => {
                        return (
                          <TouchableOpacity
                            style={{
                              width: '45%',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderColor: '#2F6FED',
                              //borderWidth: 1,
                              padding: 5,
                              borderRadius: 20,
                            }}
                            onPress={() => {
                              item.onPress();
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              {item.label == 'Chat' ? (
                                <Image
                                  source={require('../../../assets/images/chatAppointmentImage.png')}
                                  style={{width: 120, height: 40}}
                                  resizeMode="contain"></Image>
                              ) : (
                                <Image
                                  source={require('../../../assets/images/callAppointmentImage.png')}
                                  style={{width: 120, height: 40}}
                                  resizeMode="contain"></Image>
                              )}
                              {/* <Text
                                style={{
                                  color: '#2F6FED',
                                  margin: 5,
                                }}>
                                {item.label}
                              </Text> */}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              // horizontal
            />
          </View>
        );
      } else {
        return <View />;
      }
    } else if (index == 4) {
      if (Array.isArray(partnerData) && partnerData?.length != 0) {
        return (
          <View
            style={[
              styles.trandingContainer,
              {
                marginTop: 0,
                margin: 0,
                overflow: 'hidden',
                padding: 0,
              },
            ]}>
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
              data={partnerData ? [...partnerData] : []}
              //@ts-ignore
              renderItem={renderOnline}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              keyExtractor={(item, index) => index.toString()}
              // horizontal
            />
          </View>
        );
      } else {
        return <View />;
      }
    } else if (index == 5) {
      var blogList = blogData?.data || [];
      if (Array.isArray(blogList) && blogList?.length != 0) {
        return (
          <View style={styles.blogContainer}>
            <GTLabel
              text={CONSTANTS.TEXT.BLAG}
              color={CONSTANTS.THEME.colors.Dark_Gunmetal}
              fontWeight="900"
              fontSize={CONSTANTS.THEME.size.s12}
              customStyle={{marginLeft: '5%', marginBottom: '5%'}}
            />
            <GTCarousalFlatList data={blogData?.data || []} isBlog={true} />
          </View>
        );
      } else {
        return <View />;
      }
    } else if (index == 6) {
      var ourClientList = onboardingData || [];
      if (Array.isArray(ourClientList) && ourClientList?.length > 0) {
        return (
          <View style={styles.blogContainer}>
            <GTLabel
              text={CONSTANTS.TEXT.WHAT_OUR_CLIENTS}
              color={CONSTANTS.THEME.colors.Dark_Gunmetal}
              fontWeight="900"
              fontSize={CONSTANTS.THEME.size.s12}
              customStyle={{
                marginLeft: '5%',
                marginBottom: '5%',
                textTransform: 'uppercase',
              }}
            />
            <GTCarousalFlatList data={onboardingData} isBlog={false} />
          </View>
        );
      }
    } else if (index == 7) {
      return (
        <View>
          <FeedbackComponent />
          <SecureComponent />
        </View>
      );
    }
  };

  const setVisbleView = () => {
    onScrollRef.current = setTimeout(() => {
      setVisible(true);
    }, 500);
  };

  const scheduleAppointment = ({data, type}: any) => {
    var params = {
      chatSchedule: isNow ? 'Now' : 'Schedule',
      scheduledDateTime: isNow ? null : data?.date || date,
      psychologistId: data?.id,
      appointmentType: type || appointmentType || 'chat',
    };
    createAppointmentApi(params)
      .unwrap()
      .then(res => {
        // setVisible(false);
        // moveRef.current = setTimeout(() => {
        if (res.data == undefined) {
          removeSimilarData();
          setIsWait(true);
        } else {
          userChatScreen(res.data);
          setDate(new Date());
          setIsNow(true);
          setPartnerDetails({});
          removeSimilarData();
        }
        // });
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
  const addAmount = () => {
    var oldUserDatails = {...userInfo, balance: amountDetail?.balance};
    dispatch(setUserInfo(oldUserDatails));
    setAmountDetail({});
  };

  const leaveSimilarData = () => {
    dispatch(setWaitListValue({}));
    dispatch(setSimilarList([]));
    AsyncStorage.removeItem(CONSTANTS.STORAGE.SIMILAR_LIST);
    AsyncStorage.removeItem(CONSTANTS.STORAGE.WAITLIST);
    setIsLeave(false);
  };

  const removeSimilarData = () => {
    if (isSimilarData) {
      leaveSimilarData();
    }
  };

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
        navRef.current = setTimeout(() => {
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
        // handle failure
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

  return (
    <View style={styles.container}>
      <GTHomeHeader
        insets={insets}
        searchText={searchText}
        setSearchText={setSearchText}
        customStyle={styles.headerContainer}
        onHandleLeftPress={() => {
          //@ts-ignore
          navigation.navigate(RouteNames.SETTING_STACK);
        }}
        onHandleRightPress={() => {
          //@ts-ignore
          navigation.navigate(RouteNames.RECHARGE);
        }}
        onHandlePress={() => {
          //@ts-ignore
          navigation.navigate(RouteNames.SEARCH_MAIN);
        }}
      />

      <FlatList
        bounces={false}
        data={homeData}
        //@ts-ignore
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        // ListFooterComponent={ListFooterComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={CONSTANTS.THEME.colors.PRIMARY_COLOR}
            onRefresh={onRefresh}
          />
        }
      />

      {waitList?._id && (
        <GTOfflineUserView
          customStyle={{
            bottom: CONSTANTS.THEME.size.HEIGHT * 0.01,
          }}
          data={waitList}
          onExitPress={() => {
            setIsLeave(true);
          }}
        />
      )}

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
                scheduleAppointment({
                  date: date,
                  id: partnerDetails?._id || partnerDetails?.id,
                });
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
                timerRef.current = setTimeout(() => {
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
            onRef.current = setTimeout(() => {
              //@ts-ignore
              navigation.navigate(RouteNames.PSYCHOLOGIST, {data: it});
            }, 500);
          }}
          onChat={(it: any) => {
            setIsLeave(false);
            onScrollRef.current = setTimeout(() => {
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
        categoriesLoading ||
        blogLoading ||
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

export default Home;
