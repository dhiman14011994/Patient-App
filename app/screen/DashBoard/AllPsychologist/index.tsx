import {
  View,
  FlatList,
  RefreshControl,
  Keyboard,
  KeyboardEvent,
  BackHandler,
  Alert,
  Modal,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import CONSTANTS from '../../../utils/constants';
import styles from './styles';
import {
  useCreateAppointmentApiMutation,
  useJoinWaitListApiMutation,
  useLazyGetAllPartnersApiQuery,
  useLazySimilarPsychologistApiQuery,
} from '../../../redux/home-api-slice';
import GTUserListView from '../../../components/GTUserListView';
import {RouteNames} from '../../../utils/routesName';
import {PartnerList} from '../../../models/HomeMode';
import GTIndicator from '../../../components/GTIndicator';
import GTModal from '../../../components/GTModal';
import GTScheduleChatContainer from '../../../components/GTScheduleChatContainer';
import Toast from 'react-native-toast-message';
import GTOfflinePopup from '../../../components/GTOfflinePopup';
import GTWaitComponent from '../../../components/GTWaitComponent';
import {useDispatch, useSelector} from 'react-redux';
import {
  setIsLogin,
  setSimilarList,
  setToken,
  setUserInfo,
  setWaitListValue,
} from '../../../redux/app-api-slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GTOfflineSimilerUserView from '../../../components/GTOfflineSimilerUserView';
import GTOfflineUserView from '../../../components/GTOfflineUserView';
import GTAddAmountView from '../../../components/GTAddAmountView';
import {
  useGetOrderIdMutation,
  useUpdatePaymentMutation,
} from '../../../redux/payment-api-slice';
//@ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import {useLazyGetUserDataApiQuery} from '../../../redux/auth-api-slice';
import GTAppointmentHeader from '../../../components/GTAppointmentHeader/GTAppointmentHeader';
import GTRazorpayWebView from '../../../components/GTRazorpayWebView';

const AllPsychologist = ({route}: any) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const [getAllPartnersApi, {data, isLoading: partnerLoading}] =
    useLazyGetAllPartnersApiQuery();
  const [refreshing, setRefreshing] = useState(false);
  const [partnerData, setPartnerData] = useState<PartnerList[]>([]);
  const [onlinePartnerData, setOnlinePartnerData] = useState<PartnerList[]>([]);
  const [page, setPage] = useState(1);
  const [totalLength, setTotalLength] = useState(10);
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [title, setTitle] = useState('');
  const [createAppointmentApi, {isLoading: createAppointmentLoading}] =
    useCreateAppointmentApiMutation();
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState<any>({});
  const [isNow, setIsNow] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isWait, setIsWait] = useState(false);
  const [selectLanguage, setSelectLanguage] = useState('');
  const [joinWaitListApi] = useJoinWaitListApiMutation();
  const {userInfo, waitList, similarList} = useSelector(
    (state: any) => state.appState,
  );
  const dispatch = useDispatch();
  const [similarPsychologistApi, {isLoading: isSimilar}] =
    useLazySimilarPsychologistApiQuery();
  const [isLeave, setIsLeave] = useState(false);
  const [isSimilarData, setIsSimilarData] = useState(false);
  const [amountDetail, setAmountDetail] = useState<any>({});
  const [getOrderId, {isLoading: orderLoading}] = useGetOrderIdMutation();
  const [updatePayment, {isLoading: paymentLoading}] =
    useUpdatePaymentMutation();
  const [getUserDataApi, {isLoading: getUserLoading}] =
    useLazyGetUserDataApiQuery();
  const [appointmentType, setAppointmentType] = useState<String>('chat');
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

  useEffect(() => {
    getPartnerListData();
  }, [refreshing, page]);

  const getPartnerListData = () => {
    getAllPartnersApi(`?page=${page}&limit=10`)
      .unwrap()
      .then((res: any) => {
        setRefreshing(false);
        if (page == 1) {
          setPartnerData(pre => [...res?.data]);
          var temp = res?.data.filter((item: any) => {
            return item.isOnline;
          });
          setOnlinePartnerData(temp);
          setTotalLength(res?.data?.length || 0);
        } else {
          setPartnerData(pre => [...pre, ...res?.data]);
          var temp = res?.data.filter((item: any) => {
            return item.isOnline;
          });
          setOnlinePartnerData(pre => [...pre, ...temp]);
          setTotalLength(res?.data?.length || 0);
        }
      })
      .catch((e: any) => {
        console.log(e);
        if (e.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: e?.responseMessage || e?.data || '',
          });
        }
      });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setPage(pre => 1);
  }, [refreshing]);

  const scheduleAppointment = ({data, type}: any) => {
    var params = {
      chatSchedule: isNow ? 'Now' : 'Schedule',
      scheduledDateTime: isNow ? null : data?.date || date,
      psychologistId: data?.id,
      title: title,
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
            setIsNow(true);
            setDate(new Date());
            setPartnerDetails({});
          }
        }, 200);
      })
      .catch(err => {
        console.log('err>>>11', JSON.stringify(err));
        setVisible(false);
        setIsNow(true);
        setPartnerDetails({});
        setTitle('');

        if (err?.status == 403) {
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

  const renderTrending = ({item, index}: any) => {
    return (
      <GTUserListView
        key={(index + 1).toString()}
        isOffline={!item?.isOnline}
        isWait={false}
        isTime={false}
        statusText={!item?.isOnline ? 'Offline' : ''}
        item={item}
        imageStyle={styles.imageStyle}
        onPress={() => {
          //@ts-ignore
          navigation.navigate(RouteNames.PSYCHOLOGIST, {data: item});
        }}
        chatOnPress={(type: string) => {
          setPartnerDetails(item);
          setAppointmentType(type);
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
  const setVisbleView = () => {
    setTimeout(() => {
      setVisible(true);
    }, 500);
  };
  const ListFooterComponent = () => {
    return <View style={{height: CONSTANTS.THEME.size.HEIGHT * 0.3}} />;
  };

  const getLoadMoreData = () => {
    if (totalLength == 10) {
      setPage(pre => pre + 1);
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
        setIsNow(true);
        setTitle('');
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
        setIsNow(true);
        setTitle('');
        setPartnerDetails({});
        console.log('join waitlist api err', err);
      });
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
        const {razorpay_payment_id, razorpay_order_id} = data;
        updatePaymentAPI(razorpay_payment_id, razorpay_order_id);
      })
      .catch((e: any) => {
        console.log('error payment', e);
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
          console.log('Error Payment api', error);
        });
    } catch (err) {
      console.log('Error payment cacth', err);
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
            id: partnerDetails?._id || partnerDetails?.id,
          },
          type: appointmentType,
        });
      })
      .catch(e => {
        console.log('error', JSON.stringify(e));
      });
  };

  return (
    <View style={styles.container}>
      <GTAppointmentHeader
        insets={insets}
        headerText={
          route.params?.fromOnline == true
            ? 'Online Psychologist'
            : 'All Psychologist'
        }
        onHandleLeftPress={() => {
          navigation.goBack();
        }}
        isBackIcon={true}
      />
      <View style={styles.trandingContainer}>
        <FlatList
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={
            route.params?.fromOnline == true
              ? onlinePartnerData
              : partnerData || []
          }
          renderItem={renderTrending}
          keyExtractor={({item, index}: any) => item?._id}
          ListFooterComponent={ListFooterComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={CONSTANTS.THEME.colors.PRIMARY_COLOR}
              onRefresh={onRefresh}
            />
          }
          onEndReached={getLoadMoreData}
          onEndReachedThreshold={0.1}
        />

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
        {waitList?._id && (
          <GTOfflineUserView
            customStyle={{
              bottom:
                CONSTANTS.THEME.size.HEIGHT < 700
                  ? CONSTANTS.THEME.size.HEIGHT * 0.15
                  : CONSTANTS.THEME.size.HEIGHT * 0.18,
            }}
            data={waitList}
            onExitPress={() => {
              setIsLeave(true);
            }}
          />
        )}
        {((page != 1 && partnerLoading) || createAppointmentLoading) && (
          <GTIndicator />
        )}

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
    </View>
  );
};

export default AllPsychologist;
