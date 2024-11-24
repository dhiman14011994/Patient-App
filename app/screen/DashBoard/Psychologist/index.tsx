import {
  View,
  Platform,
  StatusBar,
  Animated,
  Keyboard,
  KeyboardEvent,
  BackHandler,
  Alert,
  Modal,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import GTLinearGradientView from '../../../components/GTLinearGradientView';
import CONSTANTS from '../../../utils/constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styles from './styles';
import GTHeader from '../../../components/GTHeader';
import {
  BLUE_CHAT_ICON,
  GRAY_CHAT_ICON,
  GRAY_ICON_CALL,
  GREEN_CHAT_ICON,
  Wallet_Icon,
  WHITE_CALL_ICON,
  White_Left_Icon,
} from '../../../assets';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import GTPsychologistImageView from '../../../components/GTPsychologistImageView';
import GTPsychologistNameDetailsView from '../../../components/GTPsychologistNameDetailsView';
import GTItemHeader from '../../../components/GTItemHeader';
import GTPsychologReviews from '../../../components/GTPsychologReviews';
import GTScrollView from '../../../components/GTScrollView';
import GTLabel from '../../../components/GTLabel';
import GTUserListView from '../../../components/GTUserListView';
import PagingDotContainer from '../../../components/PagingDotContainer';
import GTChatAssistantView from '../../../components/GTChatAssistantView';
import GTGiftView from '../../../components/GTGiftView';
import GTModal from '../../../components/GTModal';
import GTScheduleChatContainer from '../../../components/GTScheduleChatContainer';
import {
  useCreateAppointmentApiMutation,
  useJoinWaitListApiMutation,
  useLazyGetPartnerApiQuery,
  useLazyGetRattingsApiQuery,
  useLazySimilarPsychologistApiQuery,
} from '../../../redux/home-api-slice';
import Toast from 'react-native-toast-message';
import {RouteNames} from '../../../utils/routesName';
import {useDispatch, useSelector} from 'react-redux';
import GTWaitComponent from '../../../components/GTWaitComponent';
import GTOfflinePopup from '../../../components/GTOfflinePopup';
import {
  setIsLogin,
  setSimilarList,
  setToken,
  setUserInfo,
  setWaitListValue,
} from '../../../redux/app-api-slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GTButtonContainer from '../../../components/GTButtonContainer';
import GTAddAmountView from '../../../components/GTAddAmountView';
import {
  useGetOrderIdMutation,
  useUpdatePaymentMutation,
} from '../../../redux/payment-api-slice';
//@ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import {useLazyGetUserDataApiQuery} from '../../../redux/auth-api-slice';
import GTIndicator from '../../../components/GTIndicator';
import GTRazorpayWebView from '../../../components/GTRazorpayWebView';

const Psychologist = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const route: any = useRoute();
  const [visible, setVisible] = useState(false);
  const [appointmentType, setAppointmentType] = useState('chat');
  const [visibleRating, setVisibleRating] = useState(false);
  const [isNow, setIsNow] = useState(true);
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [title, setTitle] = useState('');
  const [createAppointmentApi, {data, isLoading}] =
    useCreateAppointmentApiMutation();
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const [getPartnerApi, {data: partnerDetails, isLoading: partnerLoading}] =
    useLazyGetPartnerApiQuery();
  const [
    similarPsychologistApi,
    {data: similarPsychologist, isLoading: isSimilar},
  ] = useLazySimilarPsychologistApiQuery();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [getRattingsApi, {data: rattingData, isLoading: rattingLoading}] =
    useLazyGetRattingsApiQuery();
  const [isWait, setIsWait] = useState(false);
  const [selectLanguage, setSelectLanguage] = useState('');
  const [joinWaitListApi] = useJoinWaitListApiMutation();
  const {userInfo} = useSelector((state: any) => state.appState);
  const dispatch = useDispatch();
  const [partnerDetail, setPartnerDetail] = useState<any>({});
  const [amountDetail, setAmountDetail] = useState<any>({});
  const [getOrderId, {isLoading: orderLoading}] = useGetOrderIdMutation();
  const [updatePayment, {isLoading: paymentLoading}] =
    useUpdatePaymentMutation();
  const [getUserDataApi, {isLoading: getUserLoading}] =
    useLazyGetUserDataApiQuery();
  const [orderId, setOderId] = useState('');
  const [amountValue, setAmountValue] = useState(0);
  const [isPayment, setIsPayment] = useState(false);

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

  useEffect(() => {
    if (route?.params?.data?._id) {
      getPsychologistDetails();
      getRattingData();
      getSimilarPartner();
    }
  }, [route?.params?.data?._id]);

  const getPsychologistDetails = () => {
    getPartnerApi(route?.params?.data?._id)
      .unwrap()
      .then(res => {})
      .catch(err => {
        console.log('error partnerDetails', err);
        if (err.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: err.responseMessage || err?.data || '',
          });
        }
      });
  };

  const getRattingData = () => {
    getRattingsApi(route?.params?.data?._id)
      .unwrap()
      .then(res => {})
      .catch(err => {
        console.log('error rating', err);
        if (err.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: err.responseMessage || err?.data || '',
          });
        }
      });
  };

  const getSimilarPartner = () => {
    similarPsychologistApi(`?page=1&limit=10&id=${route?.params?.data?._id}`)
      .unwrap()
      .then(res => {})
      .catch(err => {
        console.log('err>>', err);
        if (err.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: err.responseMessage || err?.data || '',
          });
        }
      });
  };

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none', height: 0},
      tabBarVisible: false,
    });
    return () =>
      navigation
        .getParent()
        ?.setOptions({tabBarStyle: undefined, tabBarVisible: undefined});
  }, [isFocus]);
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(
    scrollX,
    CONSTANTS.THEME.size.WIDTH * 0.7 - 64,
  );

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const okayButtonPress = () => {
    try {
      var similarData = Array.isArray(similarPsychologist?.data)
        ? similarPsychologist?.data.length > 0
          ? similarPsychologist?.data
          : []
        : similarPsychologist?.data;
      dispatch(setWaitListValue(partnerDetail));
      dispatch(setSimilarList(similarData));
      AsyncStorage.setItem(
        CONSTANTS.STORAGE.WAITLIST,
        JSON.stringify(partnerDetail),
      );
      AsyncStorage.setItem(
        CONSTANTS.STORAGE.SIMILAR_LIST,
        JSON.stringify(similarData),
      );
      setVisible(false);
    } catch (e) {
      setVisible(false);
    }
  };

  const joinButtonPress = () => {
    try {
      var params = {
        appointmentType: 'chat',
        chatSchedule: 'Schedule',
        language:
          selectLanguage ||
          partnerDetail?.language[0]?.value ||
          '6686466306177dc325124ef4',
        psychologistId: partnerDetail?._id,
        scheduledDateTime: date,
        title: title,
      };
      joinWaitListApi(params)
        .unwrap()
        .then(res => {
          setIsWait(false);
          setTitle('');
          setPartnerDetail({});
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
          setPartnerDetail({});

          console.log('join waitlist api err', err);
          if (err.originalStatus == 503) {
            Toast.show({
              type: 'error',
              text2: err.responseMessage || err?.data || '',
            });
          }
        });
    } catch (e) {
      setIsWait(false);
      setDate(new Date());
      setTitle('');
      setPartnerDetail({});
    }
  };

  const hearderContainerView = () => {
    return (
      <>
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
        <GTHeader
          text={
            route?.params?.data?.firstName
              ? `${route?.params?.data?.firstName} ${route?.params?.data?.lastName}`
              : 'Martha Nelson'
          }
          leftIcon={
            <White_Left_Icon
              width={CONSTANTS.THEME.size.s20}
              height={CONSTANTS.THEME.size.s20}
            />
          }
          rightIcon={
            <Wallet_Icon
              width={CONSTANTS.THEME.size.s28}
              height={CONSTANTS.THEME.size.s28}
            />
          }
          customStyle={styles.headerContainer}
          onHandleLeftPress={() => {
            navigation.goBack();
          }}
          onHandleRightPress={() => {
            //@ts-ignore
            navigation.navigate(RouteNames.RECHARGE);
          }}
        />
      </>
    );
  };
  const bottomHeight = CONSTANTS.THEME.size.HEIGHT * 0.1;

  const scheduleAppointment = ({data, type}: any) => {
    var params = {
      chatSchedule: isNow ? 'Now' : 'Schedule',
      scheduledDateTime: isNow ? null : data?.date || date,
      psychologistId: data?.id || route?.params?.data?._id,
      title: title,
      appointmentType: type || appointmentType,
    };
    console.log('data>>>', params);
    createAppointmentApi(params)
      .unwrap()
      .then(res => {
        setVisible(false);

        setTimeout(() => {
          if (res.data == undefined) {
            setIsWait(true);
          } else {
            userChatScreen(res.data);
            setTitle('');
            setIsNow(true);
            setDate(new Date());
            setPartnerDetail({});
          }
        }, 200);
      })
      .catch(err => {
        console.log('err>>>', JSON.stringify(err));
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

  const renderRatingView = ({item, index}: any) => {
    if (visibleRating) {
      return <GTPsychologReviews key={(index + 1).toString()} item={item} />;
    } else if (index < 6) {
      return <GTPsychologReviews key={(index + 1).toString()} item={item} />;
    }
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
      key: CONSTANTS.PAYMENT.key, // Your api key
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
      .catch((e: any) => {
        // handle failure
        console.log('payment error', e);
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
            id: partnerDetail?._id || partnerDetail?.id,
          },
          type: appointmentType,
        });
      })
      .catch(e => {
        console.log('error', JSON.stringify(e));
      });
  };

  const setVisbleView = () => {
    setTimeout(() => {
      setVisible(true);
    }, 500);
  };

  var ratingInfo: any = rattingData?.data;
  var partnerInfo: any = partnerDetails?.data;

  return (
    <View>
      {hearderContainerView()}
      <View
        style={{
          ...styles.subContainer,
          height: CONSTANTS.THEME.size.HEIGHT * 0.92,
        }}>
        <GTScrollView>
          <GTPsychologistImageView
            rating={`${Number(ratingInfo?.averageRating).toFixed(1)}`}
            experience={`${partnerInfo?.experience || 0}`}
            image={partnerInfo?.profilePicture || ''}
            orders={partnerInfo?.totalSessions || 0}
          />
          <GTPsychologistNameDetailsView
            username={
              partnerInfo?.firstName
                ? `${partnerInfo?.firstName} ${partnerInfo?.lastName}`
                : 'Martha Nelson'
            }
            data={partnerInfo}
          />

          <View style={styles.container}>
            {Array.isArray(ratingInfo?.rating) &&
              ratingInfo?.rating?.length != 0 && (
                <GTItemHeader
                  title={CONSTANTS.TEXT.REVIEWS}
                  titleFontSize={CONSTANTS.THEME.size.s12}
                  rightText={
                    Array.isArray(ratingInfo?.rating) &&
                    ratingInfo?.rating?.length != 0
                      ? `View ${ratingInfo?.rating.length} reviews`
                      : ''
                  }
                  containerStyle={{
                    marginVertical: '5%',
                    width: CONSTANTS.THEME.size.WIDTH * 0.94,
                  }}
                  rightTextOnPress={() => {}}
                />
              )}

            {Array.isArray(ratingInfo?.rating) &&
              ratingInfo?.rating?.length != 0 &&
              ratingInfo?.rating.map((it: any, i: number) =>
                renderRatingView({item: it, index: i}),
              )}
            {ratingInfo?.rating?.length > 5 ? (
              <GTLabel
                onPress={() => setVisibleRating(!visibleRating)}
                text={'View all reviews'}
                color={CONSTANTS.THEME.colors.PRIMARY_COLOR}
                textAlign="center"
                fontSize={CONSTANTS.THEME.size.s14}
                fontWeight="600"
              />
            ) : (
              <View />
            )}
          </View>
          <View style={styles.container}>
            <GTItemHeader
              title={CONSTANTS.TEXT.SIMILAR_CONSULTANTS}
              titleFontSize={CONSTANTS.THEME.size.s12}
              rightText={''}
              containerStyle={{
                marginVertical: '5%',
                width: CONSTANTS.THEME.size.WIDTH * 0.94,
              }}
              rightTextOnPress={() => {}}
            />
            <GTScrollView
              horizontal={true}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        x: scrollX,
                      },
                    },
                  },
                ],
                {
                  useNativeDriver: false,
                },
              )}>
              {similarPsychologist?.data?.map((it: any) => (
                <GTUserListView
                  key={it?._id}
                  onPress={() => {
                    //@ts-ignore
                    navigation.navigate(RouteNames.PSYCHOLOGIST, {data: it});
                  }}
                  item={it}
                  container={{
                    width: CONSTANTS.THEME.size.WIDTH * 0.83,
                    marginRight: CONSTANTS.THEME.size.WIDTH * 0.03,
                  }}
                  imageStyle={styles.imageStyle}
                  isOffline={!it?.isOnline}
                  isWait={false}
                  isTime={false}
                  statusText={!it?.isOnline ? 'Offline' : ''}
                  chatOnPress={(type: string) => {
                    setAppointmentType('chat');
                    setPartnerDetail(it);
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
                  }}
                  userBalance={userInfo?.balance || 0}
                />
              ))}
            </GTScrollView>
            <View style={{marginTop: '2%'}}>
              <PagingDotContainer
                elements={similarPsychologist?.data || []}
                position={position}
                dotColor={CONSTANTS.THEME.colors.PRIMARY_COLOR}
              />
            </View>
          </View>

          {/* <GTChatAssistantView />
          <GTGiftView /> */}

          <View style={styles.bottonContainer} />
        </GTScrollView>
      </View>
      <View
        style={{
          height: bottomHeight + CONSTANTS.THEME.size.s20,
          ...styles.bottomContainer,
          bottom:
            insets.bottom == 0
              ? Platform.OS == 'android'
                ? 0
                : CONSTANTS.THEME.size.s18
              : Platform.OS == 'android'
              ? 0
              : insets.bottom + insets.bottom,
          position: 'absolute',
          backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
          zIndex: 0,
        }}>
        <GTButtonContainer
          customStyle={{
            ...styles.chatButtonStyle,
            borderColor: partnerInfo?.isOnline
              ? userInfo?.balance > partnerInfo?.wageForChat
                ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                : CONSTANTS.THEME.colors.GREEN
              : CONSTANTS.THEME.colors.LIGHT_WHITE,
          }}
          // disabled={statusText != ''}
          onHandlePress={() => {
            setAppointmentType('chat');
            setPartnerDetail(route?.params?.data);
            if (route?.params?.data?.isOnline) {
              if (userInfo?.balance > route?.params?.data?.wageForChat) {
                scheduleAppointment({
                  data: {
                    date: date,
                    id: route?.params?.data?._id || route?.params?.data?.id,
                  },
                  type: 'chat',
                });
              } else {
                setVisbleView();
              }
            } else {
              setVisbleView();
            }
          }}>
          {partnerInfo?.isOnline ? (
            userInfo?.balance > partnerInfo?.wageForChat ? (
              <BLUE_CHAT_ICON
                width={CONSTANTS.THEME.size.s20}
                height={CONSTANTS.THEME.size.s20}
              />
            ) : (
              <GREEN_CHAT_ICON
                width={CONSTANTS.THEME.size.s20}
                height={CONSTANTS.THEME.size.s20}
              />
            )
          ) : (
            <GRAY_CHAT_ICON
              width={CONSTANTS.THEME.size.s20}
              height={CONSTANTS.THEME.size.s20}
            />
          )}
          <GTLabel
            text={CONSTANTS.TEXT.CHAT}
            color={
              !partnerInfo?.isOnline
                ? CONSTANTS.THEME.colors.Light_Gunmetal
                : userInfo?.balance > partnerInfo?.wageForChat
                ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                : CONSTANTS.THEME.colors.GREEN
            }
            customStyle={styles.leftStyle}
          />
          {!partnerInfo?.isOnline && (
            <GTLabel
              text={'offline'}
              customStyle={styles.offlineText}
              fontWeight="600"
              fontSize={CONSTANTS.THEME.size.s12}
              color={'rgba(224, 45, 60, 0.7)'}
            />
          )}
        </GTButtonContainer>

        <GTButtonContainer
          customStyle={{
            ...styles.callButtonStyle,
            backgroundColor: partnerInfo?.isOnline
              ? userInfo?.balance > partnerInfo?.wageForCall
                ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                : CONSTANTS.THEME.colors.GREEN
              : CONSTANTS.THEME.colors.LIGHT_WHITE,
            borderColor: partnerInfo?.isOnline
              ? userInfo?.balance > partnerInfo?.wageForCall
                ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                : CONSTANTS.THEME.colors.GREEN
              : CONSTANTS.THEME.colors.LIGHT_WHITE,
          }}
          // disabled={statusText != ''}
          onHandlePress={() => {
            setAppointmentType('call');
            setPartnerDetail(route?.params?.data);
            if (route?.params?.data?.isOnline) {
              if (userInfo?.balance > route?.params?.data?.wageForChat) {
                scheduleAppointment({
                  data: {
                    date: date,
                    id: route?.params?.data?._id || route?.params?.data?.id,
                  },
                  type: 'call',
                });
              } else {
                setVisbleView();
              }
            } else {
              setVisbleView();
            }
          }}>
          {partnerInfo?.isOnline ? (
            <WHITE_CALL_ICON
              width={CONSTANTS.THEME.size.s20}
              height={CONSTANTS.THEME.size.s20}
            />
          ) : (
            <GRAY_ICON_CALL
              width={CONSTANTS.THEME.size.s20}
              height={CONSTANTS.THEME.size.s20}
            />
          )}
          <GTLabel
            text={CONSTANTS.TEXT.CALL}
            color={
              !partnerInfo?.isOnline
                ? CONSTANTS.THEME.colors.Light_Gunmetal
                : CONSTANTS.THEME.colors.WHITE_COLOR
            }
            customStyle={styles.leftStyle}
          />
          {!partnerInfo?.isOnline && (
            <GTLabel
              text={'offline'}
              customStyle={{
                ...styles.offlineText,
                borderRadius: 8,
                borderColor: CONSTANTS.THEME.colors.LIGHT_WHITE,
                borderWidth: 1,
              }}
              fontWeight="600"
              fontSize={CONSTANTS.THEME.size.s12}
              color={'rgba(224, 45, 60, 0.7)'}
            />
          )}
        </GTButtonContainer>
      </View>

      <GTModal
        container={{
          justifyContent: partnerDetail?.isOnline ? 'flex-end' : 'center',
        }}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}>
        {partnerDetail?.isOnline ? (
          userInfo?.balance > partnerDetail?.wageForChat ? (
            <GTScheduleChatContainer
              selected={isNow}
              onClosePress={() => {
                setVisible(false);
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
              isLoading={isLoading}
              onPress={() => {
                // scheduleAppointment({
                //   date: date,
                //   id: partnerDetail?._id,
                // });
              }}
            />
          ) : (
            <GTAddAmountView
              onClosePress={() => {
                setVisible(false);
              }}
              item={partnerDetail}
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
            }}
            partnerDetails={partnerDetail}
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
        }}>
        <GTWaitComponent
          onClosePress={() => {
            setIsWait(false);
          }}
          partnerDetails={partnerDetail}
          cureentUser={userInfo}
          setSelectLanguage={setSelectLanguage}
          selectLanguage={selectLanguage}
          buttonPress={() => {
            joinButtonPress();
          }}
        />
      </GTModal>

      {isLoading && <GTIndicator />}
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

export default Psychologist;
