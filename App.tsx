import {View, Text, Platform} from 'react-native';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {store} from './app/redux/store';
import Route from './app/routes';
import Toast from 'react-native-toast-message';
import SplashScreen from 'react-native-splash-screen';
import {googleConfiguration} from './app/utils/socialLogin';
import {enableScreens} from 'react-native-screens';
import socketServices from './app/utils/socketService';
import {
  requestCameraPermission,
  requestExternalWritePermission,
  requestMicrophone,
  requestRecordingPermission,
} from './app/utils/customFunction';
import {requestAllPermission} from './app/utils/Permissions';
import DeviceInfo from 'react-native-device-info';
import {
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
  check,
} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import CONSTANTS from './app/utils/constants';

const App = () => {
  useEffect(() => {
    requestMicrophone();
    socketServices.initializeSocket();
    googleConfiguration();
    SplashScreen.hide();
    requestPermission();
    if (Platform.OS === 'android') {
      // requestAllPermission();
      setTimeout(() => {
        permissionRequest();
      }, 1000);
    } else {
      getFirebaseToken();
    }

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage>>>11', remoteMessage);
    });
    return unsubscribe;
  }, []);

  const getFirebaseToken = async () => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          getToken();
        } else {
          requestPermissionToken();
        }
      })
      .catch(error => {
        console.log('error checking permisions ' + error);
      });
  };

  const requestPermissionToken = () => {
    messaging()
      .requestPermission()
      .then(() => {
        getToken();
      })
      .catch(error => {
        console.log('permission rejected ' + error);
      });
  };

  const getToken = () => {
    messaging()
      .getToken()
      .then(token => {
        console.log('push token ' + token);
      })
      .catch(error => {
        console.log('error getting push token ' + error);
      });
  };
  const permissionRequest = async () => {
    let systemVersion: any = DeviceInfo.getSystemVersion();
    if (systemVersion > 12) {
      check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              notificationPermission();
              break;
            case RESULTS.DENIED:
              notificationPermission();
              break;
            case RESULTS.LIMITED:
              notificationPermission();
              break;
            case RESULTS.GRANTED:
              getFirebaseToken();
              console.log(CONSTANTS.PERMISSION_MESSGAE.GRANTED_PERMISSION);
              break;
            case RESULTS.BLOCKED:
              notificationPermission();
              break;
          }
        })
        .catch(error => {
          // …
        });
    } else {
      getFirebaseToken();
    }
  };

  const notificationPermission = async () => {
    request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS).then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          openSettings().catch(() =>
            console.warn(CONSTANTS.PERMISSION_MESSGAE.CANNOT_OPEN),
          );
          console.log(CONSTANTS.PERMISSION_MESSGAE.UNIAVAILABLE_PERMISSION);
          break;
        case RESULTS.DENIED:
          openSettings().catch(() =>
            console.warn(CONSTANTS.PERMISSION_MESSGAE.CANNOT_OPEN),
          );
          console.log(CONSTANTS.PERMISSION_MESSGAE.DENIED_PERMISSION);
          break;
        case RESULTS.LIMITED:
          openSettings().catch(() =>
            console.warn(CONSTANTS.PERMISSION_MESSGAE.CANNOT_OPEN),
          );
          console.log(CONSTANTS.PERMISSION_MESSGAE.LIMITED_PERMISSION);
          break;
        case RESULTS.GRANTED:
          getFirebaseToken();
          console.log(CONSTANTS.PERMISSION_MESSGAE.GRANTED_PERMISSION);
          break;
        case RESULTS.BLOCKED:
          // Toast.show(CONSTANTS.PERMISSION_MESSGAE.PERMISSION_NOTITIFCATION_MESSAGE);
          openSettings().catch(() =>
            console.warn(CONSTANTS.PERMISSION_MESSGAE.CANNOT_OPEN),
          );
          console.log(CONSTANTS.PERMISSION_MESSGAE.BLOCKED_PERMISSION);
          break;
      }
    });
  };

  const requestPermission = async () => {
    // var isCamera = await requestCameraPermission();
    // var isStorage = await requestExternalWritePermission();
    // var isRecorder = await requestRecordingPermission();
  };

  useEffect(() => {
    if (Platform.OS == 'ios') {
      enableScreens(false);
    }
  });
  return (
    <Provider store={store}>
      <Route />
      <Toast />
    </Provider>
  );
};

export default App;
