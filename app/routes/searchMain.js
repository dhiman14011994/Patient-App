import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../utils/routesName';
import {
  AllPsychologist,
  Chat,
  Feedback,
  Psychologist,
  Search,
  UserCall,
  UserChat,
} from '../screen';
import SettingsStack from './settingstack';

const SearchStack = createNativeStackNavigator();
const SearchMain = () => {
  return (
    <SearchStack.Navigator
      initialRouteName={RouteNames.SEARCH || ''}
      screenOptions={{
        headerShown: false,
      }}>
      <SearchStack.Screen name={RouteNames.SEARCH} component={Search} />
      <SearchStack.Screen
        name={RouteNames.PSYCHOLOGIST}
        component={Psychologist}
      />
      <SearchStack.Screen
        name={RouteNames.SETTING_STACK}
        component={SettingsStack}
      />
      <SearchStack.Screen
        name={RouteNames.ALL_APPOINTMENT}
        component={AllPsychologist}
      />
      <SearchStack.Screen name={RouteNames.USER_CHAT} component={UserChat} />
      <SearchStack.Screen name={RouteNames.FEED_BACK} component={Feedback} />
      <SearchStack.Screen name={RouteNames.USER_CALL} component={UserCall} />
    </SearchStack.Navigator>
  );
};
export default SearchMain;
