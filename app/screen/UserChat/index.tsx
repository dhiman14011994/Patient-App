import {
  View,
  Platform,
  StatusBar,
  ImageBackground,
  Keyboard,
  EmitterSubscription,
  BackHandler,
  AppState,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import CONSTANTS from '../../utils/constants';
import {CHAT_BACKGROUND_IMAGE, White_Left_Icon} from '../../assets';
import GTLinearGradientView from '../../components/GTLinearGradientView';
import GTHeader from '../../components/GTHeader';
import styles from './styles';
import GTImage from '../../components/GTImage';
import GTLabel from '../../components/GTLabel';
import {GiftedChat, IMessage, Bubble} from 'react-native-gifted-chat';
import {
  renderComposer,
  renderInputToolbar,
  renderSend,
} from './ChatComponents/InputToolBar';
import {
  renderAvatar,
  renderBubble,
  renderDay,
  renderMessageImage,
  renderMessageText,
} from './ChatComponents/MessageContainer';
import GTRenderInputToolbar from '../../components/GTRenderInputToolbar';
import socketServices from '../../utils/socketService';
import {useDispatch, useSelector} from 'react-redux';
import {
  useLazyGetChatListApiQuery,
  useReadMessageApiMutation,
} from '../../redux/filter-api-slice';
import moment from 'moment';
import EmojiPicker from '../../components/CustomEmojiPicker/emojis/EmojiPicker';
import GTIndicator from '../../components/GTIndicator';

import {
  formatTime,
  requestExternalWritePermission,
} from '../../utils/customFunction';
import {
  useLazyGetUserDataApiQuery,
  useUploadFileApiMutation,
} from '../../redux/auth-api-slice';

import {
  useGetSessionDetailsApiMutation,
  useLazyGetPartnerApiQuery,
  useUpdateSessionDetailsApiMutation,
} from '../../redux/home-api-slice';

import GTSessionClose from '../../components/GTSessionClose';
import DocumentPicker, {types} from 'react-native-document-picker';
import {RouteNames} from '../../utils/routesName';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {setSessionChatTimer, setUserInfo} from '../../redux/app-api-slice';
import {
  useCancelAppointmentScheduleApiMutation,
  useChargeChatApiMutation,
} from '../../redux/payment-api-slice';
import IdleTimerManager from 'react-native-idle-timer';
import GTModal from '../../components/GTModal';
import BackgroundTimer from 'react-native-background-timer';

const APPROXIMATE_HEIGHT = CONSTANTS.THEME.size.HEIGHT * 0.45;

const UserChat = () => {
  const insets = useSafeAreaInsets();
  const todayDate = new Date();
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const route: any = useRoute();
  const gitfChatRef = useRef<any>();
  const [messages, setMessages] = useState<any>([]);
  const [sessionDetails, setSessionDetails] = useState<any>({});
  const [partnerData, setPartnerData] = useState<any>({});
  const [newMessage, setNewMessage] = useState<any>('');
  const {userInfo, chatText, sessionChatTimer} = useSelector(
    (state: any) => state?.appState,
  );
  const [getChatListApi, {isLoading: isChatLoading}] =
    useLazyGetChatListApiQuery();
  const [isSelectedEmoji, setIsSelectedEmoji] = useState<boolean>(false);
  const [uploadFileApi, {isLoading: imageLoading}] = useUploadFileApiMutation();
  let inputRef: any = useRef(null);
  const [visible, setVisible] = useState(false);
  const [height, setHeight] = useState(APPROXIMATE_HEIGHT);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [isSessionStart, setIsSessionStart] = useState(false);
  const [readMessageApi] = useReadMessageApiMutation();
  const [getPartnerApi, {data: partnerDetails, isLoading: partnerLoading}] =
    useLazyGetPartnerApiQuery();
  const [updateSessionDetailsApi] = useUpdateSessionDetailsApiMutation();
  const [sessionTime, setSessionTime] = useState<number>(0);
  const [isSession, setIsSession] = useState<boolean>(false);
  const [appointmentData, setAppointmentData] = useState<any>(
    route?.params?.data || null,
  );
  const [cancelAppointment, setCancelAppointment] = useState(false);
  const dispatch = useDispatch();
  const [getUserDataApi, {isLoading: getUserLoading}] =
    useLazyGetUserDataApiQuery();

  const [chargeChatApi, {isLoading: chargeLoading}] =
    useChargeChatApiMutation();
  const [cancelAppointmentScheduleApi, {isLoading: cancelLoading}] =
    useCancelAppointmentScheduleApiMutation();
  const sucessRef: any = useRef(null);
  const onRef: any = useRef(null);
  const navRef: any = useRef(null);

  let interval: any;
  var isEnable =
    !sessionDetails?.sessionStatus &&
    (appointmentData?.isExpireAppointment == undefined ||
      appointmentData?.isExpireAppointment == false);
  //@ts-ignore
  let totalMinutes = parseInt(Number(sessionTime) / 60);

  let totalCharge: number =
    //@ts-ignore
    partnerDetails?.data?.wageForChat * (totalMinutes == 0 ? 1 : totalMinutes);
  let userBalance: any = userInfo?.balance
    ? parseFloat(userInfo?.balance).toFixed(2)
    : 0;
  let remaningBalance = parseInt(userBalance) - totalCharge;

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
    IdleTimerManager.setIdleTimerDisabled(true);

    return () => IdleTimerManager.setIdleTimerDisabled(false);
  }, []);

  useEffect(() => {
    if (
      (appointmentData &&
        partnerDetails?.data?.isOnline &&
        appointmentData?.appointmentStatus == 'confirmed' &&
        (sessionDetails?.sessionStatus === false ||
          sessionDetails?.sessionStatus == undefined) &&
        (appointmentData?.isExpireAppointment == undefined ||
          appointmentData?.isExpireAppointment == false)) ||
      route?.params?.isWait
    ) {
      interval = setInterval(() => {
        if (remaningBalance >= (partnerDetails?.data?.wageForChat || 0)) {
          dispatch(setSessionChatTimer(sessionChatTimer + 1));
          setSessionTime(pre => pre + 1);
          let startChatNotifiObj = {
            appointmentId: route?.params?.data?._id,
            startCallBy: userInfo?._id,
            sessionTiming: sessionChatTimer + 1,
          };
          socketServices.emit('is_call_session_timing', startChatNotifiObj);
        } else {
          Toast.show({
            type: 'error',
            text2: 'Wallet Balance is not enough to proceed.',
          });
          updateSessionStatus();
          updateChargeChat();
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [appointmentData, remaningBalance, sessionChatTimer]);

  useEffect(() => {
    if (partnerDetails?.data?.wageForChat) {
      if (remaningBalance == (partnerDetails?.data?.wageForChat || 0)) {
        Toast.show({
          type: 'error',
          text2: 'Your Wallet Balance  very low. Please add balance.',
        });
      }
    }
  }, [remaningBalance]);

  useEffect(() => {
    updateSecreenStatus();
    getAllChatData('');
    let roomObj = {
      room: appointmentData?._id,
    };
    socketServices.emit(CONSTANTS.SOCKET_EVENTS.JOIN_ROOM, roomObj);
    getMessageList();
    return () => {
      socketServices.removeListener(CONSTANTS.SOCKET_EVENTS.RECEIVE_MESSAGE);
      socketServices.removeListener(CONSTANTS.SOCKET_EVENTS.JOIN_ROOM);
      dispatch(setSessionChatTimer(0));
      if (sucessRef.current) {
        clearTimeout(sucessRef.current);
      }
      if (navRef.current) {
        clearTimeout(navRef.current);
      }
      if (onRef.current) {
        clearTimeout(onRef.current);
      }
    };
  }, [isFocus]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          nextAppState === 'unknown' ||
          nextAppState === 'background' ||
          nextAppState === 'inactive'
        ) {
          var isMedia = await AsyncStorage.getItem('isMedia');
          if (isMedia !== 'true') {
            updateSessionStatus();
            updateChargeChat();
            // BackgroundTimer.setTimeout(() => {
            //    updateSessionStatus();
            //    updateChargeChat();
            // }, 1000);
          }
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // Fetches the details of the chat partner
  useEffect(() => {
    getPsychologistDetails();
  }, []);

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
          if (data.body?.notificationType == 'Appointment') {
            if (
              data?.body?.appointmentDetail?._id == route?.params?.data?._id
            ) {
              setAppointmentData(data?.body?.appointmentDetail);
              setIsSessionStart(true);
            }
          } else if (
            data.body?.notificationType == 'cancleAppointment' &&
            data?.body?.appointmentDetail?._id == route?.params?.data?._id
          ) {
            var partnerName = partnerDetails?.data?.firstName
              ? `${partnerDetails?.data?.firstName} ${partnerDetails?.data?.lastName}`
              : partnerDetails?.data?.firstName
              ? `${partnerDetails?.data?.firstName} ${partnerDetails?.data?.lastName}`
              : '';
            Toast.show({
              type: 'success',
              text2: `${partnerName} are cancel your request`,
            });
            setTimeout(() => {
              goBackScreen();
            }, 500);
          }
        }
      } catch (error) {
        console.log('socket error', error);
      }
    });
  }, []);

  const goBackScreen = async () => {
    var screenName = await AsyncStorage.getItem(CONSTANTS.STORAGE.SCREEN_NAME);
    if (screenName == 'chat') {
      navigation.goBack();
    }
  };

  const updateSecreenStatus = async () => {
    await AsyncStorage.setItem(CONSTANTS.STORAGE.SCREEN_NAME, 'chat');
    await AsyncStorage.setItem('isMedia', '');
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
      })
      .catch(e => {
        console.log('error user', JSON.stringify(e));
      });
  };

  const updateChargeChat = async () => {
    var updateStatus = await AsyncStorage.getItem(CONSTANTS.STORAGE.IS_UPDATE);
    if (updateStatus == '1') {
      //@ts-ignore
      let totalMinutes = parseInt(Number(sessionChatTimer || sessionTime) / 60);
      //@ts-ignore
      const totalCharge =
        (partnerDetails?.data?.wageForChat || partnerData?.wageForChat || 1) *
        (totalMinutes == 0 ? 1 : totalMinutes);
      var param = {
        totalCharge: totalCharge,
        totalMin: totalMinutes,
        appointmentId: appointmentData?._id,
        partnerId:
          partnerDetails?.data?._id ||
          partnerData?._id ||
          route?.params?.data?.scheduledWith,
        status: 'completed',
      };
      console.log('charge param>>', param);
      chargeChatApi(param)
        .unwrap()
        .then(async response => {
          await AsyncStorage.setItem(CONSTANTS.STORAGE.IS_UPDATE, '2');
          getUserInfoData();
        })
        .catch(async error => {
          await AsyncStorage.setItem(CONSTANTS.STORAGE.IS_UPDATE, '2');
          console.log('error user charge', JSON.stringify(error));
        });
    }
  };

  useEffect(() => {
    let keyboardDidShowListener: EmitterSubscription;

    keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShow,
    );
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setVisible(false);
      setKeyboardStatus(false);
    });
    return () => {
      if (keyboardDidShowListener) {
        keyboardDidShowListener.remove();
      }
      hideSubscription.remove();
    };
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [appointmentData]);

  const backAction = () => {
    setVisible(false);
    Keyboard.dismiss();
    console.log(
      'appointmentData?.appointmentStatus',
      appointmentData?.appointmentStatus,
    );
    if (appointmentData?.appointmentStatus == 'pending') {
      setCancelAppointment(true);
    } else {
      if (
        (partnerDetails?.data?.isOnline &&
          (sessionDetails?.sessionStatus === false ||
            sessionDetails?.sessionStatus == undefined) &&
          (appointmentData?.isExpireAppointment == undefined ||
            appointmentData?.isExpireAppointment == false)) ||
        route?.params?.isWait
      ) {
        inputRef?.current?.blur();
        setIsSession(true);
      }
    }

    return true;
  };

  const getPsychologistDetails = () => {
    getPartnerApi(
      route?.params?.data?.scheduledWith == userInfo?._id
        ? route?.params?.data?.scheduledBy
        : route?.params?.data?.scheduledWith,
    )
      .unwrap()
      .then(res => {
        setPartnerData(res?.data || {});
        getAllChatData(res.data);
      })
      .catch(err => {
        console.log('error partnerDetails', err);
      });
  };

  // Handler for the keyboard show event
  const keyboardDidShow = (e: any) => {
    setKeyboardStatus(true);
    setVisible(false);
    setHeight(e?.endCoordinates?.height); // sets the height after opening the keyboard
  };

  // Fetches all chat messages for the session
  const getAllChatData = (data: any) => {
    getChatListApi(route?.params?.data?._id)
      .unwrap()
      .then((res: any) => {
        setSessionDetails(res?.data?.chatSession || {});
        // Formats the message object for GiftedChat
        const giftedChats: IMessage = res?.data?.chatMessages?.map(
          (it: any) => {
            return {
              ...it,
              text: it?.message ? it?.message : '',
              createdAt: moment(it.createdAt).toDate(),
              user:
                it?.senderId == userInfo._id
                  ? {
                      _id: userInfo._id || '',
                      name: userInfo?.firstName || '',
                      avatar: userInfo.profilePicture || '',
                    }
                  : {
                      _id: it?.senderId,
                      name: partnerDetails?.data?.firstName
                        ? `${partnerDetails?.data?.firstName}${
                            partnerDetails?.data?.lastName
                              ? ' ' + partnerDetails?.data?.lastName
                              : ''
                          }`
                        : data?.firstName
                        ? `${data?.firstName}${
                            data?.lastName ? ' ' + data?.lastName : ''
                          }`
                        : 'abc',
                      avatar:
                        partnerDetails?.data?.profilePicture ||
                        data?.profilePicture ||
                        'https://img.icons8.com/ios/50/user-male-circle--v1.png',
                    },
            };
          },
        );
        setMessages(giftedChats);

        // Mark all messages as read once they are retrieved
        readMessageApi(route?.params?.data?._id)
          .unwrap()
          .then(res => {})
          .catch(e => {
            console.log('readmessage error>>>', e);
          });
      })
      .catch(e => {
        console.log('chatData error>>', e);
      });
  };

  const getMessageList = () => {
    socketServices.on(CONSTANTS.SOCKET_EVENTS.RECEIVE_MESSAGE, (data: any) => {
      // Formats the message object for GiftedChat
      setMessages((prev: any) => [
        ...prev,
        {
          _id: prev?.length ? prev.length + 1 : 1,
          text: data?.message ? data?.message : '',
          ...data,
          user:
            data.senderId == userInfo._id
              ? {
                  _id: userInfo._id || '',
                  name: userInfo?.firstName || '',
                  avatar: userInfo.profilePicture || '',
                }
              : {
                  _id: data?.senderId,
                  name: partnerDetails?.data?.firstName
                    ? `${partnerDetails?.data?.firstName}${
                        partnerDetails?.data?.lastName
                          ? ' ' + partnerDetails?.data?.lastName
                          : ''
                      }`
                    : '',
                  avatar:
                    partnerDetails?.data?.profilePicture ||
                    'https://img.icons8.com/ios/50/user-male-circle--v1.png',
                },
        },
      ]);

      // Mark all messages as read once they are retrieved
      readMessageApi(route?.params?.data?._id)
        .unwrap()
        .then(res => {})
        .catch(e => {
          console.log('readmessage error>>>', e);
        });
    });
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
          appIcon={
            <View style={styles.headerUserStyle}>
              <GTImage
                imageStyle={styles.userImageStyle}
                uri={partnerDetails?.data?.profilePicture || ''}
              />
              <View style={styles.nameStyle}>
                <GTLabel
                  fontSize={CONSTANTS.THEME.size.s14}
                  text={
                    partnerDetails?.data?.firstName
                      ? `${partnerDetails?.data?.firstName} ${partnerDetails?.data?.lastName}`
                      : partnerDetails?.data?.firstName
                      ? `${partnerDetails?.data?.firstName} ${partnerDetails?.data?.lastName}`
                      : ''
                  }
                  color={CONSTANTS.THEME.colors.NEUTRAL[100]}
                  customStyle={{lineHeight: CONSTANTS.THEME.size.s20}}
                  fontWeight="700"
                />
                <GTLabel
                  fontSize={CONSTANTS.THEME.size.s12}
                  text={partnerDetails?.data?.isOnline ? 'Online' : 'offline'}
                  customStyle={{lineHeight: CONSTANTS.THEME.size.s18}}
                  fontWeight="400"
                  color="rgba(255, 255, 255, 0.65)"
                />
                {isEnable && (
                  <GTLabel
                    fontSize={CONSTANTS.THEME.size.s12}
                    text={
                      sessionTime > 0
                        ? `${formatTime(sessionTime)}`
                        : 'Connecting'
                    }
                    customStyle={{lineHeight: CONSTANTS.THEME.size.s18}}
                    fontWeight="400"
                    color={CONSTANTS.THEME.colors.RED}
                  />
                )}
              </View>
            </View>
          }
          leftIcon={
            <White_Left_Icon
              width={CONSTANTS.THEME.size.s20}
              height={CONSTANTS.THEME.size.s20}
            />
          }
          customStyle={styles.headerContainer}
          textStyle={{textAlign: 'left'}}
          onHandleLeftPress={() => {
            console.log(
              'appointmentData?.appointmentStatus11',
              appointmentData?.appointmentStatus,
            );
            if (appointmentData?.appointmentStatus == 'pending') {
              setCancelAppointment(true);
            } else {
              if (
                (partnerDetails?.data?.isOnline &&
                  (sessionDetails?.sessionStatus === false ||
                    sessionDetails?.sessionStatus == undefined) &&
                  (appointmentData?.isExpireAppointment == undefined ||
                    appointmentData?.isExpireAppointment == false)) ||
                route?.params?.isWait
              ) {
                setIsSession(true);
              } else {
                navigation.goBack();
              }
            }
          }}
        />
      </>
    );
  };

  // Handles file upload and sending as a message
  const selectImage = async () => {
    try {
      await AsyncStorage.setItem('isMedia', 'true');
      let isStoragePermitted = await requestExternalWritePermission();
      sucessRef.current = setTimeout(() => {
        if (isStoragePermitted) {
          DocumentPicker.pick({
            allowMultiSelection: false,
            type: [types.doc, types.docx, types.images, types.pdf],
          })
            .then(async res => {
              uploadImage(res);
              await AsyncStorage.setItem('isMedia', '');
            })
            .catch(async err => {
              console.log('err', err);
              await AsyncStorage.setItem('isMedia', '');
            });
        }
      }, 800);
    } catch (error) {}
  };
  // Handles file upload and sending as a message
  const uploadImage = (values: any) => {
    try {
      var formData = new FormData();
      formData.append('profile_picture', {
        uri: values[0]?.uri,
        type: values[0].type,
        name: values[0].name,
      });
      uploadFileApi(formData)
        .unwrap()
        .then(res => {
          var urlData = res?.data?.url || res?.data[0].url;
          var type = urlData.split('.').pop();
          const docData = ['doc', 'docx', 'pdf']; // put here name of screen where you want to hide tabBar
          const isDoc = docData.indexOf(type) <= -1;
          const _createdtime_ = Date.now();
          var senderData = {
            room: route?.params?.data?._id,
            receiverId:
              route?.params?.data?.scheduledWith == userInfo?._id
                ? route?.params?.data?.scheduledBy
                : route?.params?.data?.scheduledWith,
            senderId: userInfo?._id,
            message: '',
            document: !isDoc ? urlData : '',
            image: isDoc ? urlData : '',
            appointmentId: route?.params?.data?._id,
            createdAt: _createdtime_,
          };

          socketServices.emit(CONSTANTS.SOCKET_EVENTS.SEND_MESSAGE, senderData);
        })
        .catch(e => {
          console.log('upload err', JSON.stringify(e));
          if (e?.originalStatus == 413) {
            Toast.show({
              type: 'error',
              text2: 'Request Entity Too Large',
            });
          } else {
            Toast.show({
              type: 'error',
              text2: e?.responseMessage || 'file not upload',
            });
          }
        });
    } catch (e) {
      console.log('upload err>>', JSON.stringify(e));
    }
  };

  // Handles sending a message
  const onSend = () => {
    Keyboard.dismiss();
    setIsSelectedEmoji(false);
    setVisible(false);
    const _createdtime_ = Date.now();
    var senderData = {
      room: route?.params?.data?._id,
      receiverId:
        route?.params?.data?.scheduledWith == userInfo?._id
          ? route?.params?.data?.scheduledBy
          : route?.params?.data?.scheduledWith,
      senderId: userInfo?._id,
      message: newMessage,
      appointmentId: route?.params?.data?._id,
      createdAt: _createdtime_,
    };

    socketServices.emit(CONSTANTS.SOCKET_EVENTS.SEND_MESSAGE, senderData);
    onRef.current = setTimeout(() => {
      setNewMessage('');
    }, 500);
  };

  const onContentSizeChange = () => {
    gitfChatRef.current.scrollToEnd({animated: true});
  };

  const openEmojiPicker = () => {
    Keyboard.dismiss();
    if (inputRef?.current) {
      inputRef?.current.blur();
    }
    setVisible(!visible);
  };

  const renderInputsToolbar = () => {
    return (
      <View>
        {(appointmentData?.isExpireAppointment == undefined ||
          appointmentData?.isExpireAppointment == false) &&
          appointmentData?.appointmentStatus == 'confirmed' && (
            <GTRenderInputToolbar
              ref={inputRef}
              onEmojiPress={() => {
                openEmojiPicker();
              }}
              mediaPress={() => selectImage()}
              onChangeText={(text: any) => {
                setNewMessage(text);
              }}
              value={newMessage}
              onSendMessage={() => {
                setVisible(false);
                Keyboard.dismiss();
                onSend();
              }}
              onFocus={() => {
                setVisible(false);
              }}
              isSelectedEmoji={isSelectedEmoji}
            />
          )}
      </View>
    );
  };

  const onChangeEmoji = (res: any) => {
    setNewMessage(`${newMessage}${res}`);
  };

  // Handles the session status update when session ends
  const updateSessionStatus = () => {
    var param = {
      appointmentId: route?.params?.data?._id,
      //@ts-ignore
      duration: parseInt(Number(sessionTime) / 60) || 0,
    };

    console.log('param>>', param);

    updateSessionDetailsApi(param)
      .unwrap()
      .then(res => {
        setIsSession(false);
        //@ts-ignore
        navigation.navigate(RouteNames.FEED_BACK, {
          id: route?.params?.data?._id,
        });
      })
      .catch(e => {
        console.log(' update session api err ', e);
        setIsSession(false);
      });
  };

  const cancelSchedule = () => {
    var param = {
      data: {
        cancellationReason: '',
        id: route?.params?.data?._id,
        status: 'cancelled',
      },
      id: route?.params?.data?._id,
    };

    cancelAppointmentScheduleApi(param)
      .unwrap()
      .then((res: any) => {
        console.log('res', res);
        setTimeout(() => {
          navigation.goBack();
        }, 500);
      })
      .catch(e => {
        console.log('error cancel appointment', e);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => setVisible(false)}>
      <ImageBackground source={CHAT_BACKGROUND_IMAGE} style={styles.container}>
        {hearderContainerView()}
        {/* Chat message list */}
        <GiftedChat
          alwaysShowSend
          messages={messages}
          inverted={false}
          renderInputToolbar={props => renderInputsToolbar()}
          renderComposer={renderComposer}
          renderSend={renderSend}
          renderDay={renderDay}
          renderMessageImage={renderMessageImage}
          scrollToBottom
          renderBubble={renderBubble}
          renderMessageText={renderMessageText}
          // isTyping
          placeholder={CONSTANTS.TEXT.TYPE_YOUR_MESSAGE}
          // renderInputToolbar={() => {
          //   return <View />;
          // }}
          minInputToolbarHeight={50}
          // alwaysShowSend={true}
          listViewProps={{
            ref: gitfChatRef,
            onContentSizeChange: onContentSizeChange,
          }}
          showAvatarForEveryMessage={true}
          showUserAvatar={false}
          user={{
            _id: userInfo?._id || '',
            avatar: userInfo?.profilePicture || '',
            //@ts-ignore
            name: userInfo?.firstName || '',
          }}
          renderAvatar={() => {
            return <View />;
          }}
        />

        <View
          style={{
            height: visible ? height : 0,
            backgroundColor: CONSTANTS.THEME.colors.BackgroundColor,
          }}>
          <EmojiPicker selectedEmoji={onChangeEmoji} />
        </View>
        {Platform.OS == 'ios' && insets.bottom > 0 && (
          <View style={{height: insets.bottom}} />
        )}

        <GTModal
          visible={isSession || cancelAppointment}
          onClose={() => {
            setIsSession(false);
            setCancelAppointment(false);
          }}>
          <GTSessionClose
            isCancel={cancelAppointment}
            onClosePress={() => {
              setIsSession(false);
              setCancelAppointment(false);
            }}
            yesButtonPress={() => {
              if (cancelAppointment) {
                setCancelAppointment(false);
                cancelSchedule();
              } else {
                updateSessionStatus();
                updateChargeChat();
              }
            }}
            noButtonPress={() => {
              setIsSession(false);
              setCancelAppointment(false);
            }}
          />
        </GTModal>
        {(isChatLoading || imageLoading) && <GTIndicator />}
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default UserChat;
