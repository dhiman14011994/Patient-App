import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../utils/routesName';
import {Login, OtpVerification, PersonalInformation, Welcome} from '../screen';
import Home from '../screen/DashBoard/Home';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../utils/constants';
import {
  setIsLogin,
  setSimilarList,
  setToken,
  setUserInfo,
  setWaitListValue,
} from '../redux/app-api-slice';
import BottomTabBar from './bottomTabBar';
import NetInfo from '@react-native-community/netinfo';
import GTNoInternetScreen from '../components/GTNoInternetScreen';
import socketServices from '../utils/socketService';

const AuthStack = createNativeStackNavigator();

const AuthenticationStack = () => {
  const isLogin = useSelector(state => state.appState.isLogin);
  const dispatch = useDispatch();
  const [isConnected, setConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('state.isConnected', state.isConnected);
      setConnected(state.isConnected);
      if (state.isConnected) {
        socketServices.initializeSocket();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    getLocalInfo();
  }, []);

  const getLocalInfo = async () => {
    const isLoginValue = await AsyncStorage.getItem(CONSTANTS.STORAGE.ISLOGGED);
    const token = await AsyncStorage.getItem(CONSTANTS.STORAGE.TOKEN);
    const userInfo = await AsyncStorage.getItem(CONSTANTS.STORAGE.USER_DATA);
    const waitInfo = await AsyncStorage.getItem(CONSTANTS.STORAGE.WAITLIST);
    const similarData = await AsyncStorage.getItem(
      CONSTANTS.STORAGE.SIMILAR_LIST,
    );

    dispatch(setIsLogin(isLoginValue === 'true'));
    dispatch(setToken(token == null || token == undefined ? '' : token));
    dispatch(
      setUserInfo(
        userInfo == null
          ? {}
          : userInfo == undefined
          ? {}
          : userInfo == ''
          ? {}
          : JSON.parse(userInfo),
      ),
    );
    dispatch(
      setWaitListValue(
        waitInfo == null
          ? {}
          : waitInfo == undefined
          ? {}
          : waitInfo == ''
          ? {}
          : JSON.parse(waitInfo),
      ),
    );
    dispatch(
      setSimilarList(
        similarData == null
          ? []
          : similarData == undefined
          ? []
          : similarData == ''
          ? []
          : JSON.parse(similarData),
      ),
    );
  };
  if (!isConnected) {
    return (
      <View>
        <GTNoInternetScreen />
      </View>
    );
  }
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {!isLogin ? (
        <>
          <AuthStack.Screen name={RouteNames.WELCOME} component={Welcome} />
          <AuthStack.Screen name={RouteNames.LOGIN} component={Login} />
          <AuthStack.Screen
            name={RouteNames.OTP_VERIFICATION}
            component={OtpVerification}
          />
          <AuthStack.Screen
            name={RouteNames.PERSONAL_INFORMATION}
            component={PersonalInformation}
          />
        </>
      ) : (
        <AuthStack.Screen
          name={RouteNames.BOTTOM_TAB}
          component={BottomTabBar}
        />
      )}
    </AuthStack.Navigator>
  );
};

export default AuthenticationStack;
