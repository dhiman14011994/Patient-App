import {
  View,
  Text,
  Platform,
  StatusBar,
  BackHandler,
  Keyboard,
  Alert,
  FlatList,
  KeyboardEvent,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import GTLinearGradientView from '../../components/GTLinearGradientView';
import CONSTANTS from '../../utils/constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import styles from './styles';
import {AppointmentProps} from '../../models/HomeMode';
import {
  useCreateAppointmentApiMutation,
  useJoinWaitListApiMutation,
  useLazyGetAllAppointmentsApiQuery,
  useLazySimilarPsychologistApiQuery,
  useUpdateWaitListAppointmentApiMutation,
} from '../../redux/home-api-slice';
import {useDispatch, useSelector} from 'react-redux';
import {
  useGetOrderIdMutation,
  useUpdatePaymentMutation,
} from '../../redux/payment-api-slice';
import {useLazyGetUserDataApiQuery} from '../../redux/auth-api-slice';
import socketServices from '../../utils/socketService';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setIsLogin,
  setToken,
  setUserInfo,
  setWaitDataInfo,
  setWaitListValue,
} from '../../redux/app-api-slice';
import {
  compareTwoBetweenDays,
  compareTwoDate,
} from '../../utils/customFunction';
import GTAppointmentList from '../../components/GTAppointmentList';

//@ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import GTModal from '../../components/GTModal';
import GTIndicator from '../../components/GTIndicator';
import GTWaitComponent from '../../components/GTWaitComponent';
import GTOfflinePopup from '../../components/GTOfflinePopup';
import GTAddAmountView from '../../components/GTAddAmountView';
import GTScheduleChatContainer from '../../components/GTScheduleChatContainer';
import GTOfflineSimilerUserView from '../../components/GTOfflineSimilerUserView';
import ListEmptyComponent from '../../components/ListEmptyComponent/ListEmptyComponent';
import {White_Left_Icon} from '../../assets';
import GTHeader from '../../components/GTHeader';

const Call = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [getAllAppointments, {data, isLoading}] =
    useLazyGetAllAppointmentsApiQuery();
  const {userInfo, waitData} = useSelector((state: any) => state.appState);
  const [appointmentList, setAppointmentList] = useState<AppointmentProps[]>(
    [],
  );
  const [waitingData, setWaitingData] = useState({});

  const [waitList, setWaitList] = useState<AppointmentProps[]>([]);
  const [updateWaitListAppointmentApi, {isLoading: updateWaitLoading}] =
    useUpdateWaitListAppointmentApiMutation();
  const [rejectid, setRejectId] = useState(0);
  const [isLeave, setIsLeave] = useState(false);
  const [isSimilarData, setIsSimilarData] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState<any>({});
  const [amountDetail, setAmountDetail] = useState<any>({});
  const [
    similarPsychologistApi,
    {data: similarPsychologist, isLoading: isSimilar},
  ] = useLazySimilarPsychologistApiQuery();
  const [visible, setVisible] = useState(false);
  const [isNow, setIsNow] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [title, setTitle] = useState('');
  const [createAppointmentApi, {isLoading: createAppointmentLoading}] =
    useCreateAppointmentApiMutation();
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [date, setDate] = useState(new Date());
  const [isWait, setIsWait] = useState(false);
  const [selectLanguage, setSelectLanguage] = useState('');
  const [joinWaitListApi] = useJoinWaitListApiMutation();
  const [getOrderId, {isLoading: orderLoading}] = useGetOrderIdMutation();
  const [updatePayment, {isLoading: paymentLoading}] =
    useUpdatePaymentMutation();
  const [getUserDataApi, {isLoading: getUserLoading}] =
    useLazyGetUserDataApiQuery();

  const isFocus = useIsFocused();

  useEffect(() => {
    socketServices.on('notification', (data: any) => {
      if (data?.body?.receiverId === userInfo._id) {
        // Toast.show({
        //   type: 'success',
        //   text2: `Hi ${userInfo?.firstName}, ${data?.body?.message}`,
        // });

        if (data.body?.notificationType == 'pleaseWait') {
          getWaitAppintmentList();
        }

        if (data.body?.notificationType == 'waitingTimeCompleted') {
          updateWaitData(data?.body?.appointmentDetail);
        }
      }
    });
  }, []);

  const updateWaitData = (it: any) => {
    dispatch(setWaitDataInfo(it));
    setWaitingData(it);
  };

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

  useEffect(() => {
    getAppintmentList();
    getWaitAppintmentList();
  }, [isFocus]);

  const getAppintmentList = () => {
    getAllAppointments('allTypes')
      .unwrap()
      .then(res => {
        setAppointmentList(res?.data?.allAppointments || []);
      })
      .catch(e => {
        if (e.status == 403) {
          logout();
        }
        console.log('error', JSON.stringify(e));
        if (e.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: e.responseMessage || e?.data || '',
          });
        }
      });
  };
  const getWaitAppintmentList = () => {
    getAllAppointments('waitList')
      .unwrap()
      .then(res => {
        setWaitList(res?.data?.waitListAppointments || []);
      })
      .catch(e => {
        if (e.status == 403) {
          logout();
        }
        console.log('error', JSON.stringify(e));
        if (e.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: e.responseMessage || e?.data || '',
          });
        }
      });
  };

  const okayButtonPress = () => {
    try {
      dispatch(setWaitListValue(partnerDetails));
      AsyncStorage.setItem(
        CONSTANTS.STORAGE.WAITLIST,
        JSON.stringify(partnerDetails),
      );
      setVisible(false);
      // getSimilarPartner();
    } catch (e) {
      setVisible(false);
    }
  };

  const getSimilarPartner = (id: any) => {
    try {
      similarPsychologistApi(`?page=1&limit=10&id=${id}`)
        .unwrap()
        .then(res => {
          setIsLeave(true);
        })
        .catch(err => {
          console.log('err>>', err);
          if (err.originalStatus == 503) {
            Toast.show({
              type: 'error',
              text2: err?.responseMessage || err?.data || '',
            });
          }
        });
    } catch (e) {}
  };

  const chatPress = ({item, isWait}: any) => {
    var isToday = compareTwoDate({
      startDate: new Date(),
      endDate: item?.scheduledDateTime,
    });
    var days = compareTwoBetweenDays({
      startDate: new Date(),
      endDate: item?.scheduledDateTime,
    });

    if (isToday || days < 0) {
      setTimeout(() => {
        //@ts-ignore
        navigation.navigate(RouteNames.USER_CHAT, {
          data: item,
          isWait: isWait,
          isDirect: false,
        });
      });
    } else {
      Alert.alert('Please wait until the scheduled time to access the chat');
    }
  };

  const renderItem = ({item, index}: any) => {
    if (true || item?.appointmentType == 'call') {
      return (
        <GTAppointmentList
          onHandlePress={() => {
            // chatPress({item, isWait: false});
          }}
          waitData={waitData}
          container={styles.renderContainer}
          message={item?.message || item?.title}
          name={
            item?.name || item?.scheduledWithPartner_firstName
              ? `${item?.scheduledWithPartner_firstName}  ${item?.scheduledWithPartner_lastName}`
              : ''
          }
          time={item?.scheduledDateTime}
          typeOfMessage={
            item?.video ? 'video' : item?.image ? 'image' : 'message'
          }
          tickType={item?.isCurrentUser ? 'none' : 'tick'}
          unreadMeassage={item?.unReadMessage}
          item={item}
          onPressAccept={() => {
            updateWaitingAppointment(item);
          }}
          onPressReject={() => {
            setRejectId(index);
            getSimilarPartner(item?.scheduledWith || '');
          }}
        />
      );
    }
  };

  const updateWaitingAppointment = (item: any) => {
    updateWaitListAppointmentApi({id: item._id, reqAcceptedByClient: true})
      .unwrap()
      .then(res => {
        chatPress({item, isWait: true});
        getAppintmentList();
        getWaitAppintmentList();
      })
      .catch(error => {
        console.log('error>>>', error);
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

  const scheduleAppointment = (data: any) => {
    var params = {
      chatSchedule: isNow ? 'Now' : 'Schedule',
      scheduledDateTime: isNow ? null : data?.date || date,
      psychologistId: data?.id,
      // title: title,
      appointmentType: 'chat',
    };
    createAppointmentApi(params)
      .unwrap()
      .then(res => {
        setVisible(false);
        setTimeout(() => {
          if (res.data == undefined) {
            setIsWait(true);
          } else {
            setTitle('');
            setDate(new Date());
            setIsNow(true);
            setPartnerDetails({});
            setTimeout(() => {
              Toast.show({
                type: 'success',
                text2:
                  res?.responseMessage ||
                  'Request for appointment has been sent.',
              });
            }, 200);
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
        }
      });
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

  const leaveAppointment = () => {
    updateWaitListAppointmentApi({
      id: waitList[rejectid]._id,
      reqAcceptedByClient: false,
    })
      .unwrap()
      .then(res => {
        console.log('ress>>', res);
        getAppintmentList();
        getWaitAppintmentList();
      })
      .catch(error => {
        console.log('error>>>', error);
      });
  };

  const getOrderIdAPI = async (amount: any) => {
    try {
      let params = {currency: 'INR', amount: amount};
      getOrderId(params)
        .unwrap()
        .then((res: any) => {
          callPaymentGateway(res?.data?.id || '', res?.data?.amount || '');
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
        setTimeout(() => {
          // navigation.goBack();
        }, 500);
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

  const getUserInfoData = () => {
    getUserDataApi(userInfo?._id || userInfo?.id)
      .unwrap()
      .then(async res => {
        dispatch(setUserInfo(res.data));
        await AsyncStorage.setItem(
          CONSTANTS.STORAGE.USER_DATA,
          JSON.stringify(res.data),
        );
        setVisible(true);
      })
      .catch(e => {
        console.log('error', JSON.stringify(e));
      });
  };

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
  const hearderContainerView = () => {
    return (
      <>
        {Platform.OS == 'android' ? (
          <GTLinearGradientView>
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
        <GTLinearGradientView
          container={{
            height:
              insets.top < 35
                ? insets.top
                : Platform.OS == 'android'
                ? insets.top
                : 35,
            backgroundColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
          }}
        />
        <GTHeader
          text={'Call'}
          leftIcon={
            <White_Left_Icon
              width={CONSTANTS.THEME.size.s20}
              height={CONSTANTS.THEME.size.s20}
            />
          }
          customStyle={styles.headerContainer}
          textStyle={{textAlign: 'left'}}
          onHandleLeftPress={() => {
            navigation.goBack();
          }}
        />
      </>
    );
  };
  return (
    <View style={styles.container}>
      {/* {Platform.OS == 'android' ? (
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
        
      )} */}

      {hearderContainerView()}
      <FlatList
        data={[...waitList, ...appointmentList]}
        //@ts-ignore
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />

      <GTModal
        container={{
          justifyContent: 'center',
        }}
        visible={isLeave}
        onClose={() => {
          setIsLeave(false);
        }}>
        <GTOfflineSimilerUserView
          similarData={similarPsychologist?.data}
          name={
            `${
              //@ts-ignore
              waitList[rejectid]?.name ||
              waitList[rejectid]?.scheduledWithPartner_firstName
            }`
              ? `${waitList[rejectid]?.scheduledWithPartner_firstName}  ${waitList[rejectid]?.scheduledWithPartner_lastName}`
              : ''
          }
          onClosePress={() => {
            setIsLeave(false);
          }}
          leavePress={() => {
            // leaveSimilarData();
            setIsLeave(false);
            leaveAppointment();
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
              setVisible(true);
            }, 500);
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
      {isLoading && <GTIndicator />}
    </View>
  );
};

export default Call;
