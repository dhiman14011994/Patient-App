import {
  View,
  Platform,
  StatusBar,
  ImageBackground,
  BackHandler,
  AppState,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import CONSTANTS from '../../utils/constants';
import {
  CALL_BACKGROUND,
  CROSS_WHITE_ICON,
  MIC_WHITE_ICON,
  VOLUME_ICON,
  White_Left_Icon,
} from '../../assets';
import GTLinearGradientView from '../../components/GTLinearGradientView';
import GTHeader from '../../components/GTHeader';
import styles from './styles';
import GTImage from '../../components/GTImage';
import GTLabel from '../../components/GTLabel';
import socketServices from '../../utils/socketService';
import {useDispatch, useSelector} from 'react-redux';

import {
  formatTime,
  requestRecordingPermission,
} from '../../utils/customFunction';
import {
  useLazyGetPartnerApiQuery,
  useUpdateSessionDetailsApiMutation,
} from '../../redux/home-api-slice';
import GTModal from '../../components/GTModal';
import GTSessionClose from '../../components/GTSessionClose';
import {RouteNames} from '../../utils/routesName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';
import GTButtonContainer from '../../components/GTButtonContainer';
import MicOff from '../../assets/MicOff';
import InCallManager from 'react-native-incall-manager';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {
  setSessionRunning,
  setSessionTimer,
  setUserInfo,
} from '../../redux/app-api-slice';
import {
  useCancelAppointmentScheduleApiMutation,
  useChargeChatApiMutation,
} from '../../redux/payment-api-slice';
import {useUploadFileApiMutation} from '../../redux/auth-api-slice';
import {useAppointmentCallRecordingApiMutation} from '../../redux/filter-api-slice';
import IdleTimerManager from 'react-native-idle-timer';
const audioRecorderPlayer = new AudioRecorderPlayer();

const UserCall = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const route: any = useRoute();
  const [sessionDetails, setSessionDetails] = useState<any>({});
  const {userInfo, chatText, isSessionRuning, sessionTimer} = useSelector(
    (state: any) => state?.appState,
  );
  const [appointmentCallRecordingApi, {isLoading: callRecordingLoading}] =
    useAppointmentCallRecordingApiMutation();
  const [uploadFileApi, {data: uploadImageData, isLoading: imageLoading}] =
    useUploadFileApiMutation();
  const [getPartnerApi, {data: partnerDetails, isLoading: partnerLoading}] =
    useLazyGetPartnerApiQuery();
  const [updateSessionDetailsApi] = useUpdateSessionDetailsApiMutation();
  const [sessionTime, setSessionTime] = useState<number>(0);
  const [isSession, setIsSession] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [isStartSession, setIsStartSession] = useState<boolean>(false);
  const [chargeChatApi] = useChargeChatApiMutation();

  const [appointmentData, setAppointmentData] = useState<any>(
    route?.params?.data || null,
  );
  const [cancelAppointment, setCancelAppointment] = useState(false);

  //@ts-ignore
  let totalMinutes = parseInt(Number(sessionTime) / 60);

  let totalCharge: number =
    //@ts-ignore
    partnerDetails?.data?.wageForChat * (totalMinutes == 0 ? 1 : totalMinutes);
  let userBalance: any = userInfo?.balance
    ? parseFloat(userInfo?.balance).toFixed(2)
    : 0;
  let remaningBalance = parseInt(userBalance) - totalCharge;

  const partnerName = partnerDetails?.data?.firstName
    ? `${partnerDetails?.data?.firstName}${
        partnerDetails?.data?.lastName
          ? ' ' + partnerDetails?.data?.lastName
          : ''
      }`
    : '';

  const [cancelAppointmentScheduleApi, {isLoading: cancelLoading}] =
    useCancelAppointmentScheduleApiMutation();

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
    if (partnerDetails?.data?.isOnline && isSessionRuning) {
      const interval = setInterval(() => {
        if (remaningBalance >= (partnerDetails?.data?.wageForChat || 0)) {
          setSessionTime(pre => pre + 1);
          dispatch(setSessionTimer(sessionTimer + 1));
          let startChatNotifiObj = {
            appointmentId: route?.params?.data?._id,
            startCallBy: userInfo?._id,
            sessionTiming: sessionTimer + 1,
          };
          socketServices.emit('is_call_session_timing', startChatNotifiObj);
        } else {
          Toast.show({
            type: 'error',
            text2: 'Wallet Balance is not enough to proceed.',
          });
          // leaveCall();
          socketServices.emit('callHangUp', {
            status: true,
            room: route.params.data._id,
          });
          clearInterval(interval);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [sessionTimer]);

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
    let roomObj = {
      room: route?.params?.data?._id,
    };
    socketServices.emit(CONSTANTS.SOCKET_EVENTS.JOIN_ROOM, roomObj);
    return () => {
      socketServices.removeListener(CONSTANTS.SOCKET_EVENTS.JOIN_ROOM);
    };
  }, [isFocus]);

  useEffect(() => {
    const backAction = () => {
      if (appointmentData?.appointmentStatus == 'pending') {
        setCancelAppointment(true);
      } else {
        endCall();
      }

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [appointmentData]);

  useEffect(() => {
    getPsychologistDetails();
  }, []);

  const getPsychologistDetails = () => {
    getPartnerApi(
      route?.params?.data?.scheduledWith == userInfo?._id
        ? route?.params?.data?.scheduledBy
        : route?.params?.data?.scheduledWith,
    )
      .unwrap()
      .then(res => {})
      .catch(err => {
        console.log('error partnerDetails', err);
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
        console.log('error', e);
      });
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        nextAppState === 'unknown' ||
        nextAppState === 'background' ||
        nextAppState === 'inactive'
      ) {
        if (sessionTimer > 2) {
          endCall();
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const connectionRef: any = useRef();

  const streamOnce: any = useRef(false);
  const callHangUp: any = useRef(false);
  const localStream: any = useRef(null);
  const [mute, setMute] = useState(false);
  const [isCallOnce, setCallOnce] = useState(false);
  const remoteStream: any = useRef(null);
  const [isSpeaker, setIsSpeaker] = useState<boolean>(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState<any>(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const callonce: any = useRef(false);

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
              if (!isCallOnce) {
                setCallOnce(true);
                setLeaveCount(0);
                setAppointmentData(data?.body?.appointmentDetail);
                callUser();
              }
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

            goBackScreen();
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    });

    return () => {
      socketServices.removeListener('callUser');
      socketServices.removeListener('callAccepted');
      socketServices.removeListener('getRemoteCandidates');
      socketServices.removeListener('callHangUp');
      socketServices.removeListener('setCandidates');
    };
  }, []);

  const goBackScreen = async () => {
    var screenName = await AsyncStorage.getItem(CONSTANTS.STORAGE.SCREEN_NAME);
    if (screenName == 'call') {
      navigation.goBack();
    }
  };

  const callUser = async () => {
    try {
      socketServices.emit('joinRoom', route?.params?.data?._id);
      socketServices.emit('appointmentId', {
        appointmentId: route?.params?.data?._id,
      });

      let mediaStream = await mediaDevices.getUserMedia({
        // audio: true,
        audio: {
          // echoCancellation: true,
          // noiseSuppression: true,
          // autoGainControl: true,
          // googEchoCancellation: true,
          // googAutoGainControl: true,
          // googNoiseSuppression: true,
          // googHighpassFilter: true,
          // googTypingNoiseDetection: true,
          // googNoiseReduction: true,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          volume: 1.0,
        },
        video: false,
      });

      if (mediaStream) {
        const configuration = {
          iceServers: [
            {
              urls: 'stun:stun.relay.metered.ca:80',
            },
            {
              urls: 'turn:global.relay.metered.ca:80',
              username: '641159709bb3b08b0affecb7',
              credential: 'zaXbhon7U69Aj0fv',
            },
            {
              urls: 'turn:global.relay.metered.ca:80?transport=tcp',
              username: '641159709bb3b08b0affecb7',
              credential: 'zaXbhon7U69Aj0fv',
            },
            {
              urls: 'turn:global.relay.metered.ca:443',
              username: '641159709bb3b08b0affecb7',
              credential: 'zaXbhon7U69Aj0fv',
            },
            {
              urls: 'turns:global.relay.metered.ca:443?transport=tcp',
              username: '641159709bb3b08b0affecb7',
              credential: 'zaXbhon7U69Aj0fv',
            },
          ],
        };
        let peerConnection: any = new RTCPeerConnection(configuration);
        if (mediaStream) {
          localStream.current = mediaStream;
          mediaStream
            ?.getTracks()
            .forEach((track: any) =>
              peerConnection?.addTrack(track, mediaStream),
            );
        }
        let sessionConstraints = {
          mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: false,
            VoiceActivityDetection: true,
          },
        };
        connectionRef.current = peerConnection;
        peerConnection
          .createOffer(sessionConstraints)
          .then((offer: any) => {
            peerConnection.setLocalDescription(offer).then(() => {
              socketServices.emit('callUser', {
                userToCall:
                  partnerDetails?.data?._id ||
                  route?.params?.data?.scheduledBy == userInfo._id
                    ? route?.params?.data?.scheduledWith
                    : route?.params?.data?.scheduledBy,
                signalData: offer,
                from: userInfo._id,
                room: route?.params?.data?._id,
              });
            });
          })
          .catch((e: any) => console.log('e create offer', e));
        socketServices.on('callAccepted', async (signal: any) => {
          let startChatNotifiObj = {
            appointmentId: route?.params?.data?._id,
            startChatBy:
              partnerDetails?.data?._id ||
              route?.params?.data?.scheduledBy == userInfo._id
                ? route?.params?.data?.scheduledWith
                : route?.params?.data?.scheduledBy,
            sessionTiming: 0,
          };

          socketServices.emit('is_session_timing', startChatNotifiObj);
          hanldleControl('unmute');
          recodAudioStart();
          InCallManager.start({
            media: 'audio',
          });
          InCallManager.setForceSpeakerphoneOn(false);
          dispatch(setSessionRunning(true));
          setSessionTime(pre => pre + 1);
          dispatch(setSessionTimer(sessionTimer + 1));
          setIsStartSession(true);
          if (!callonce.current) {
            callonce.current = true;
            const remoteDesc = new RTCSessionDescription(signal);
            await peerConnection.setRemoteDescription(remoteDesc);
          }
        });
        peerConnection.onicecandidate = function (event: any) {
          if (event.candidate) {
            try {
              socketServices.emit('setCandidates', {
                candidates: event.candidate,
              });
            } catch (e) {
              // Log any errors that occur during emission
              console.error('Error sending ICE candidate:', e);
            }
          } else {
            console.log('ICE candidate gathering completed.');
          }
        };
        // peerConnection.oniceconnectionstatechange = (event: any) => {
        //   console.log(event);
        // };
        socketServices.on('getRemoteCandidates', async (data: any) => {
          await peerConnection.addIceCandidate(data.candidates);
        });
        socketServices.on('callHangUp', async (data: any) => {
          updateSessionStatus();
          leaveCall();
        });

        peerConnection.ontrack = async (event: any) => {
          if (!streamOnce.current) {
            streamOnce.current = true;
            remoteStream.current = event.streams[0];
          }
        };
        connectionRef.current = peerConnection;
      }
    } catch (error) {}
  };

  const updateSecreenStatus = async () => {
    await AsyncStorage.setItem(CONSTANTS.STORAGE.SCREEN_NAME, 'call');
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
            if (appointmentData?.appointmentStatus == 'pending') {
              setCancelAppointment(true);
            } else {
              endCall();
            }
          }}
        />
      </>
    );
  };

  const updateSessionStatus = () => {
    var param = {
      appointmentId: route?.params?.data?._id,
      //@ts-ignore
      duration: parseInt(Number(sessionTime) / 60) || 0,
    };
    updateSessionDetailsApi(param)
      .unwrap()
      .then(res => {
        console.log('updateSessionDetailsApi');
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

  const hanldleControl = async (type: string) => {
    try {
      const audioTrack = await localStream?.current
        ?.getTracks()
        .find((track: any) => track.kind === 'audio');

      if (type === 'mute') {
        audioTrack.enabled = false;
        setMute(false);
      } else {
        audioTrack.enabled = true;
        setMute(true);
      }
    } catch (e) {
      console.log('err', e);
    }
  };

  const leaveCall = () => {
    // if (leaveCount < 2) {
    recodAudioStop();
    connectionRef?.current?.close();
    dispatch(setSessionRunning(false));
    chargeUserCall();
    //
    setMute(false);
    // }
  };

  const endCall = async () => {
    if (isStartSession) {
      setIsSession(true);
    } else {
      var screenName = await AsyncStorage.getItem(
        CONSTANTS.STORAGE.SCREEN_NAME,
      );
      if (screenName == 'call') {
        navigation.goBack();
      }
    }
  };

  const chargeUserCall = async () => {
    var updateStatus = await AsyncStorage.getItem(CONSTANTS.STORAGE.IS_UPDATE);
    if (updateStatus == '1') {
      //@ts-ignore
      let totalMinutes: number = parseInt(Number(sessionTimer || 60) / 60);
      //@ts-ignore
      const totalCharge =
        (partnerDetails?.data?.wageForCall || 1) *
        (totalMinutes == 0 ? 1 : totalMinutes);
      let leftAmount = userInfo?.balance - totalCharge;
      chargeChatApi({
        totalCharge: totalCharge,
        totalMin: totalMinutes == 0 ? 1 : totalMinutes,
        appointmentId: route.params.data._id,
        partnerId:
          partnerDetails?.data?._id || route?.params?.data?.scheduledWith,
        status: 'confirmed',
      })
        .unwrap()
        .then(async (res: any) => {
          await AsyncStorage.setItem(CONSTANTS.STORAGE.IS_UPDATE, '2');
          dispatch(setSessionTimer(0));
          dispatch(setUserInfo({...userInfo, balance: leftAmount || 0}));
        })
        .catch(async (e: any) => {
          await AsyncStorage.setItem(CONSTANTS.STORAGE.IS_UPDATE, '2');
        });
    }
  };

  const hanldleSpeaker = () => {
    // InCallManager.setSpeakerphoneOn(!isSpeaker);
    InCallManager.setForceSpeakerphoneOn(!isSpeaker);
    setIsSpeaker(!isSpeaker);
  };

  const recodAudioStart = async () => {
    try {
      var isRecodPermission = await requestRecordingPermission();
      if (isRecodPermission) {
        const stopRecoding = await audioRecorderPlayer.stopRecorder();
        const result = await audioRecorderPlayer?.startRecorder();
        Toast.show({
          type: 'success',
          text2: 'Call recoding start.',
        });
        audioRecorderPlayer.addRecordBackListener(e => {
          setRecordSecs(pre => e.currentPosition);
          setRecordTime(
            audioRecorderPlayer?.mmssss(Math.floor(e.currentPosition)) || 0,
          );
          return;
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  const recodAudioStop = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    if (result != 'Already stopped') {
      uploadAudioFile(result);
    }
    console.log('Stop record', result);
  };

  const uploadAudioFile = (record: any) => {
    var formData = new FormData();
    formData.append('profile_picture', {
      uri: Platform.OS === 'android' ? record : record.replace('file://', ''),
      name: 'test.mp4',
      type: 'audio/mp4',
    });
    uploadFileApi(formData)
      .unwrap()
      .then((res: any) => {
        appointmentCallRecordingApi({
          id: route?.params?.data?._id,
          data: {audio: res?.data[0]?.url || ''},
        })
          .unwrap()
          .then(res => {
            console.log(res);
          })
          .catch(e => {
            console.log('Call recording error', e);
          });
      })
      .catch(e => {
        console.log('upload err', JSON.stringify(e));
      });
  };

  return (
    <ImageBackground source={CALL_BACKGROUND} style={styles.container}>
      {hearderContainerView()}
      <View style={styles.subContainer}>
        <GTImage
          uri={partnerDetails?.data?.profilePicture}
          imageStyle={styles.userImagesStyle}
        />
        <GTLabel
          text={partnerName}
          fontWeight="600"
          customStyle={{lineHeight: CONSTANTS.THEME.size.s28}}
          fontSize={CONSTANTS.THEME.size.s18}
        />
      </View>
      {appointmentData?.appointmentStatus !== 'pending' && (
        <View style={styles.menuContainter}>
          <GTButtonContainer
            onHandlePress={() => {
              hanldleSpeaker();
            }}
            customStyle={{
              ...styles.volumeButton,
              backgroundColor: isSpeaker
                ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                : 'rgb(46,46,46)',
            }}>
            <VOLUME_ICON
              height={CONSTANTS.THEME.size.s24}
              width={CONSTANTS.THEME.size.s24}
            />
          </GTButtonContainer>

          <GTButtonContainer
            onHandlePress={() => {
              hanldleControl(mute ? 'mute' : 'unmute');
            }}
            customStyle={{
              ...styles.volumeButton,
              backgroundColor: 'rgb(46,46,46)',
            }}>
            {!mute ? (
              <MicOff
                height={CONSTANTS.THEME.size.s24}
                width={CONSTANTS.THEME.size.s24}
                fill={'#FFF'}
              />
            ) : (
              <MIC_WHITE_ICON
                height={CONSTANTS.THEME.size.s24}
                width={CONSTANTS.THEME.size.s24}
              />
            )}
          </GTButtonContainer>
          <GTButtonContainer
            onHandlePress={() => {
              endCall();
            }}
            customStyle={{
              ...styles.volumeButton,
              backgroundColor: CONSTANTS.THEME.colors.RED,
            }}>
            <CROSS_WHITE_ICON
              height={CONSTANTS.THEME.size.s24}
              width={CONSTANTS.THEME.size.s24}
            />
          </GTButtonContainer>
        </View>
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
              // updateSessionStatus();
              // leaveCall();
              setIsSession(false);
              socketServices.emit('callHangUp', {
                status: true,
                room: route.params.data._id,
              });
              updateSessionStatus();
              leaveCall();
            }
          }}
          noButtonPress={() => {
            setIsSession(false);
            setCancelAppointment(false);
          }}
        />
      </GTModal>
    </ImageBackground>
  );
};

export default UserCall;
