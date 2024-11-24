import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../utils/routesName';
import {
  AllPsychologist,
  Chat,
  Feedback,
  Psychologist,
  UserChat,
} from '../screen';
import SettingsStack from './settingstack';

const ChatingStack = createNativeStackNavigator();
const ChatStack = () => {
  return (
    <ChatingStack.Navigator
      initialRouteName={RouteNames.CHAT || ''}
      screenOptions={{
        headerShown: false,
      }}>
      <ChatingStack.Screen name={RouteNames.CHAT} component={Chat} />
      <ChatingStack.Screen
        name={RouteNames.PSYCHOLOGIST}
        component={Psychologist}
      />
      <ChatingStack.Screen
        name={RouteNames.SETTING_STACK}
        component={SettingsStack}
      />
      <ChatingStack.Screen
        name={RouteNames.ALL_APPOINTMENT}
        component={AllPsychologist}
      />
      <ChatingStack.Screen name={RouteNames.USER_CHAT} component={UserChat} />
      <ChatingStack.Screen name={RouteNames.FEED_BACK} component={Feedback} />
    </ChatingStack.Navigator>
  );
};
export default ChatStack;
