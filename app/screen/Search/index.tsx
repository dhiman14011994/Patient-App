import {
  View,
  KeyboardEvent,
  Platform,
  StatusBar,
  FlatList,
  Keyboard,
  BackHandler,
  Alert,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import GTLinearGradientView from '../../components/GTLinearGradientView';
import CONSTANTS from '../../utils/constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GTHeader from '../../components/GTHeader';
import {
  Finance_Icon,
  Humburger_Icon,
  Search_Icon,
  Wallet_Icon,
} from '../../assets';
import GTHomeHeaderIcon from '../../components/GTHomeHeaderIcon';
import GTInput from '../../components/GTInput';
import styles from './styles';
import GTItemHeader from '../../components/GTItemHeader';
import GTCategoryList from '../../components/GTCategoryList';
import GTUserListView from '../../components/GTUserListView';
import {
  useCreateAppointmentApiMutation,
  useJoinWaitListApiMutation,
  useLazySearchDataApiQuery,
  useLazySimilarPsychologistApiQuery,
} from '../../redux/home-api-slice';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {RouteNames} from '../../utils/routesName';
import GTModal from '../../components/GTModal';
import GTScheduleChatContainer from '../../components/GTScheduleChatContainer';
import Toast from 'react-native-toast-message';
import {
  setIsLogin,
  setSimilarList,
  setToken,
  setUserInfo,
  setWaitListValue,
} from '../../redux/app-api-slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GTOfflinePopup from '../../components/GTOfflinePopup';
import GTWaitComponent from '../../components/GTWaitComponent';
import GTOfflineSimilerUserView from '../../components/GTOfflineSimilerUserView';
import GTOfflineUserView from '../../components/GTOfflineUserView';
import GTAddAmountView from '../../components/GTAddAmountView';
import {
  useGetOrderIdMutation,
  useUpdatePaymentMutation,
} from '../../redux/payment-api-slice';
//@ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import {useLazyGetUserDataApiQuery} from '../../redux/auth-api-slice';
import GTIndicator from '../../components/GTIndicator';
import GTRazorpayWebView from '../../components/GTRazorpayWebView';

const Search = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const homeData = [{}, {}];
  const [searchText, setSearchText] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const {userInfo, waitList, similarList} = useSelector(
    (state: any) => state.appState,
  );
  const [searchDataApi, {data: searchData, isLoading}] =
    useLazySearchDataApiQuery();
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
  const [
    similarPsychologistApi,
    {data: similarPsychologist, isLoading: isSimilar},
  ] = useLazySimilarPsychologistApiQuery();
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
  const dispatch = useDispatch();

  useEffect(() => {
    getSearchListData();
  }, []);

  useEffect(() => {
    getSearchListData();
  }, [searchText]);

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

  const getSearchListData = () => {
    try {
      searchDataApi(`?search=${searchText}`)
        .unwrap()
        .then(res => {})
        .catch(e => {
          console.log('error12', JSON.stringify(e));
        });
    } catch (e) {
      console.log('error>>', JSON.stringify(e));
    }
  };

  const addAmount = () => {
    var oldUserDatails = {...userInfo, balance: amountDetail?.balance};
    dispatch(setUserInfo(oldUserDatails));
    setAmountDetail({});
  };

  const setVisbleView = () => {
    setTimeout(() => {
      setVisible(true);
    }, 500);
  };

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
        console.log('err>>>', JSON.stringify(err));
        setVisible(false);
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

  const ListHeaderComponent = () => {
    return (
      <View>
        <GTHeader
          text={CONSTANTS.TEXT.PERSONAL_INFORMATION}
          leftIcon={
            <Humburger_Icon
              width={CONSTANTS.THEME.size.s28}
              height={CONSTANTS.THEME.size.s28}
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
            //@ts-ignore
            navigation.navigate(RouteNames.SETTING_STACK);
          }}
          appIcon={<GTHomeHeaderIcon />}
        />
        <GTLinearGradientView
          container={{
            backgroundColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
            // height: CONSTANTS.THEME.size.WIDTH * 0.2,
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

          <GTInput
            customStyle={{
              marginVertical: '4%',
              width: CONSTANTS.THEME.size.WIDTH * 0.94,
              marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
            }}
            leftIcon={<Search_Icon width={20} height={20} />}
            placeholder="Search"
            inputContainer={{
              backgroundColor: CONSTANTS.THEME.colors.WHITE[20],
            }}
            placeholderTextColor={CONSTANTS.THEME.colors.WHITE[80]}
            input={searchText}
            inputStyle={{color: CONSTANTS.THEME.colors.WHITE_COLOR}}
            setInput={setSearchText}
            isSearch={true}
          />
        </GTLinearGradientView>
      </View>
    );
  };

  const ListFooterComponent = () => {
    return (
      <View
        style={{
          height: CONSTANTS.THEME.size.WIDTH * 0.5,
          backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
        }}
      />
    );
  };

  const renderItem = ({item, index}: any) => {
    if (index == 0 && item?.length != 0) {
      return (
        <GTCategoryList
          rightTextOnPress={() => {}}
          data={item || []}
          title={CONSTANTS.TEXT.CATEGORIES}
          rightText={''}
          itemContainer={styles.itemContainer}
          isFewItemShow={true}
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
    } else if (index == 1) {
      return (
        <View
          style={{
            ...styles.trandingContainer,
            marginTop:
              filterSearchData('partner')?.length != 0
                ? CONSTANTS.THEME.size.s20
                : 0,
          }}>
          <GTItemHeader
            title={
              searchText == ''
                ? CONSTANTS.TEXT.TOP_RATED_PSTCHOLOGIES
                : CONSTANTS.TEXT.SEARCH_TEXT(searchText)
            }
            rightText={item.length > 8 ? CONSTANTS.TEXT.VIEW_ALL : ''}
            containerStyle={{marginVertical: '5%'}}
            rightTextOnPress={() => {
              //@ts-ignore
              navigation.navigate(RouteNames.ALL_APPOINTMENT);
            }}
          />
          {/* @ts-ignore */}

          <FlatList
            data={item || []}
            // horizontal={}
            //@ts-ignore
            renderItem={renderTrending}
            keyExtractor={({it, index}: any) => it?._id}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
          {/* )} */}
        </View>
      );
    }
  };

  const renderTrending = ({item, index}: any) => {
    if (searchText == '' ? index < 8 : index < 100000) {
      return (
        <GTUserListView
          key={(index + 1).toString()}
          isOffline={!item?.isOnline}
          isWait={false}
          isTime={false}
          statusText={!item?.isOnline ? 'Offline' : ''}
          item={item}
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
          imageStyle={styles.imageStyle}
          userBalance={userInfo?.balance || 0}
        />
      );
    }
  };

  const filterSearchData = (type: string) => {
    let newArrayList = searchData?.data?.filter(
      (item: any) => item.type == type,
    );
    return newArrayList;
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
        bounces={false}
        data={
          searchData?.data
            ? [filterSearchData('category'), filterSearchData('partner') || []]
            : []
        }
        //@ts-ignore
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={ListFooterComponent}
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
      {(createAppointmentLoading || isLoading) && <GTIndicator />}
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

export default Search;
