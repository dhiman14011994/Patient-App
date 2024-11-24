import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../utils/routesName';

import {BackHandler, Alert} from 'react-native';
import {
  AllPsychologist,
  Feedback,
  PaymentConfirmation,
  Psychologist,
  Recharge,
  UserCall,
  UserChat,
} from '../screen';
import Home from '../screen/DashBoard/Home';
import SettingsStack from './settingstack';
const HomeStack = createNativeStackNavigator();
const DashboardStack = () => {
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

  return (
    <HomeStack.Navigator
      initialRouteName={RouteNames.HOME}
      screenOptions={{
        headerShown: false,
      }}>
      <HomeStack.Screen name={RouteNames.HOME} component={Home} />
      <HomeStack.Screen
        name={RouteNames.PSYCHOLOGIST}
        component={Psychologist}
      />
      <HomeStack.Screen
        name={RouteNames.SETTING_STACK}
        component={SettingsStack}
      />
      <HomeStack.Screen
        name={RouteNames.ALL_APPOINTMENT}
        component={AllPsychologist}
      />
      <HomeStack.Screen name={RouteNames.USER_CHAT} component={UserChat} />
      <HomeStack.Screen name={RouteNames.FEED_BACK} component={Feedback} />
      <HomeStack.Screen name={RouteNames.USER_CALL} component={UserCall} />
      <HomeStack.Screen
        name={RouteNames.PAYMENT_CONFIRMATION}
        component={PaymentConfirmation}
      />
      <HomeStack.Screen name={RouteNames.RECHARGE} component={Recharge} />
    </HomeStack.Navigator>
  );
};
export default DashboardStack;
