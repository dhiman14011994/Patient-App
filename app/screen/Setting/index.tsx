import {
  View,
  Text,
  Platform,
  StatusBar,
  FlatList,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect, useLayoutEffect} from 'react';
import GTLinearGradientView from '../../components/GTLinearGradientView';
import CONSTANTS from '../../utils/constants';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GTHeader from '../../components/GTHeader';
import {
  APPOINTMENTS_ICON,
  CUSTOMER_SUPPORT_ICON,
  DIGITAL_WALLET_ICON,
  RATE_US_ICON,
  RECHARGE_ICON,
  SERVICES_ICON,
  SETTINGS_ICON,
  SIGN_UP_ICON,
  Wallet_Icon,
  WHITE_DELETE_USER_ICON,
  White_Left_Icon,
} from '../../assets';
import styles from './styles';
import GTSettingUserInfo from '../../components/GTSettingUserInfo';
import GTLabel from '../../components/GTLabel';
import GTSettingMenu from '../../components/GTSettingMenu';
import GTButton from '../../components/GTButton';
import {useDispatch, useSelector} from 'react-redux';
import {setIsLogin, setToken, setUserInfo} from '../../redux/app-api-slice';
// import {setPrefsValue} from '../../../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteNames} from '../../utils/routesName';
import Toast from 'react-native-toast-message';
import {
  useLazyDeleteUserDataApiQuery,
  useLazyGetUserDataApiQuery,
  useLogoutAccountApiMutation,
} from '../../redux/auth-api-slice';

const Setting = () => {
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state?.appState.userInfo);
  const [deleteUserDataApi] = useLazyDeleteUserDataApiQuery();
  const [logoutAccountApi] = useLogoutAccountApiMutation();
  const [getUserDataApi, {isLoading: getUserLoading}] =
    useLazyGetUserDataApiQuery();

  const settingArray = [
    {
      id: '1',
      image: (
        <APPOINTMENTS_ICON
          width={CONSTANTS.THEME.size.s32}
          height={CONSTANTS.THEME.size.s32}
        />
      ),
      name: CONSTANTS.TEXT.MY_APPOINTMENTS,
    },
    {
      id: '2',
      image: (
        <RECHARGE_ICON
          width={CONSTANTS.THEME.size.s32}
          height={CONSTANTS.THEME.size.s32}
        />
      ),
      name: CONSTANTS.TEXT.RECHARGE,
    },
    {
      id: '3',
      image: (
        <DIGITAL_WALLET_ICON
          width={CONSTANTS.THEME.size.s32}
          height={CONSTANTS.THEME.size.s32}
        />
      ),
      name: CONSTANTS.TEXT.DIGITAL_WALLET,
    },
    {
      id: '4',
      image: (
        <SETTINGS_ICON
          width={CONSTANTS.THEME.size.s32}
          height={CONSTANTS.THEME.size.s32}
        />
      ),
      name: CONSTANTS.TEXT.SETTINGS,
    },
    {
      id: '5',
      image: (
        <SERVICES_ICON
          width={CONSTANTS.THEME.size.s32}
          height={CONSTANTS.THEME.size.s32}
        />
      ),
      name: CONSTANTS.TEXT.SERVICES,
    },
    {
      id: '6',
      image: (
        <RATE_US_ICON
          width={CONSTANTS.THEME.size.s32}
          height={CONSTANTS.THEME.size.s32}
        />
      ),
      name: CONSTANTS.TEXT.RATE_US,
    },
    {
      id: '7',
      image: (
        <CUSTOMER_SUPPORT_ICON
          width={CONSTANTS.THEME.size.s32}
          height={CONSTANTS.THEME.size.s32}
        />
      ),
      name: CONSTANTS.TEXT.CUSTOMER_SUPPORT,
    },
    {
      id: '8',
      image: (
        <View style={styles.deleteView}>
          <WHITE_DELETE_USER_ICON
            width={CONSTANTS.THEME.size.s16}
            height={CONSTANTS.THEME.size.s16}
          />
        </View>
      ),
      name: CONSTANTS.TEXT.DELETE_ACCOUNT,
    },
  ];

  useEffect(() => {
    getUserInfoData();
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
        console.log('error', JSON.stringify(e));
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
          text={'Setting'}
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

  const renderValueItem = ({name, value}: any) => {
    return (
      <View style={styles.valueItem}>
        <GTLabel
          text={value}
          color={CONSTANTS.THEME.colors.GREEN}
          fontSize={CONSTANTS.THEME.size.s22}
          fontWeight="700"
          customStyle={{lineHeight: CONSTANTS.THEME.size.s32}}
        />
        <GTLabel
          text={name}
          color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
          fontSize={CONSTANTS.THEME.size.s12}
          fontWeight="400"
          customStyle={{lineHeight: CONSTANTS.THEME.size.s20}}
        />
      </View>
    );
  };

  const onPress = (data: any) => {
    switch (data) {
      case 0:
        //@ts-ignore
        navigation.navigate(RouteNames.MY_APPOINTMENT);
        break;
      case 1:
        //@ts-ignore
        navigation.navigate(RouteNames.RECHARGE);
        break;
      case 2:
        //@ts-ignore
        navigation.navigate(RouteNames.WALLET);
        break;
      case 3:
        Toast.show({
          type: 'success',
          text2: 'Coming soon',
        });
        break;
      case 4:
        Toast.show({
          type: 'success',
          text2: 'Coming soon',
        });
        break;
      case 5:
        Toast.show({
          type: 'success',
          text2: 'Coming soon',
        });
        break;
      case 6:
        Toast.show({
          type: 'success',
          text2: 'Coming soon',
        });
        break;
      case 7:
        deleteAccountPopup();
        break;
    }
  };

  const renderItem = ({item, index}: any) => {
    const isIndex = index == 0 || index == 3 || index == 7;
    return (
      <GTSettingMenu
        onPress={() => onPress(index)}
        leftImage={item.image}
        name={item.name}
        container={{
          marginTop: isIndex ? CONSTANTS.THEME.size.s10 : 0,
        }}
      />
    );
  };

  const ListHeaderComponent = () => {
    return (
      <View>
        <GTSettingUserInfo
          name={userInfo?.firstName || ''}
          mobile_no={userInfo?.mobileNumber ? `+${userInfo?.mobileNumber}` : ''}
          userImage={userInfo?.profilePicture || ''}
          onEditPress={() => {
            //@ts-ignore
            navigation.navigate(RouteNames.PROFILE);
          }}
          imageStyle={{
            borderRadius: CONSTANTS.THEME.size.WIDTH * 0.5,
            overflow: 'hidden',
          }}
        />
        <View style={styles.balanceContainer}>
          {renderValueItem({
            name: CONSTANTS.TEXT.WALLET,
            value: `₹${userInfo?.balance ? parseInt(userInfo?.balance) : 0}`,
          })}
          {renderValueItem({
            name: CONSTANTS.TEXT.CHAT,
            value: `${userInfo?.totalChatCount || 0}`,
          })}
          {renderValueItem({
            name: CONSTANTS.TEXT.CALLS,
            value: `${userInfo?.totalCallCount || 0}`,
          })}
        </View>
      </View>
    );
  };

  const ListFooterComponent = () => {
    return (
      <View style={styles.footerContainer}>
        <GTLinearGradientView container={styles.continueViewButton}>
          <GTButton
            onHandlePress={() => {
              logoutPopup();
            }}
            text="Logout"
            customStyle={styles.continueButton}
            backgroundColor={CONSTANTS.THEME.colors.TRANSPARENT}
            color={CONSTANTS.THEME.colors.WHITE_COLOR}
          />
        </GTLinearGradientView>

        <View
          style={{
            ...styles.emptyView,
            marginBottom:
              insets.bottom == 0 ? CONSTANTS.THEME.size.s50 : insets.bottom,
          }}
        />
      </View>
    );
  };

  const deleteAccountPopup = () => {
    Alert.alert(
      'Confirm Delete Account',
      'Are your sure you want to delete account?. if you delete account then you will lost your data',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => deleteAccountInfo()},
      ],
    );
  };

  const deleteAccountInfo = () => {
    deleteUserDataApi('')
      .unwrap()
      .then(response => {
        Toast.show({
          type: 'success',
          text2: response?.responseMessage || 'Account deleted successfully',
        });
        logout();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const logoutPopup = () => {
    Alert.alert('Confirm Logout', 'Are your sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => logOutAccountInfo()},
    ]);
  };

  const logOutAccountInfo = () => {
    try {
      logoutAccountApi('')
        .unwrap()
        .then(response => {
          logout();
        })
        .catch(error => {
          console.log(error);
          logout();
        });
    } catch (error) {
      console.log(error);
      logout();
    }
  };

  const logout = async () => {
    dispatch(setIsLogin(false));
    dispatch(setUserInfo({}));
    dispatch(setToken(''));
    await AsyncStorage.setItem(CONSTANTS.STORAGE.ISLOGGED, 'false');
    await AsyncStorage.setItem(CONSTANTS.STORAGE.USER_DATA, '');
    await AsyncStorage.setItem(CONSTANTS.STORAGE.TOKEN, '');
  };

  return (
    <View>
      {hearderContainerView()}

      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        data={settingArray}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
};

export default Setting;
