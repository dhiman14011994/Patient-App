import {
  View,
  Platform,
  Alert,
  Image,
  StatusBar,
  BackHandler,
} from 'react-native';
import React, {useEffect} from 'react';
import GTWelcomeHeader from '../../../components/GTWelcomeHeader';
import {
  AppleIcon,
  FacebookIcon,
  GoogleIcon,
  MobileIcon,
  Welcome_Icon,
} from '../../../assets';
import CONSTANTS from '../../../utils/constants';
import GTLabel from '../../../components/GTLabel';
import styles from './styles';
import GTButton from '../../../components/GTButton';
import GTButtonContainer from '../../../components/GTButtonContainer';
import GTScrollView from '../../../components/GTScrollView';
import {useNavigation} from '@react-navigation/native';
import {RouteNames} from '../../../utils/routesName';
import GTORView from '../../../components/GTORView';
import {googleLogin} from '../../../utils/socialLogin';
import {useSocialLoginApiMutation} from '../../../redux/auth-api-slice';
import GTIndicator from '../../../components/GTIndicator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Welcome = () => {
  const navigation = useNavigation();
  const [socialLoginApi, {isLoading, data}] = useSocialLoginApiMutation();
  const insets = useSafeAreaInsets();

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

  const googleButtonPress = () => {
    Alert.alert('Coming soon');

    // googleLogin((res: any) => {
    //   var params = {
    //     firebase_token: res.firebase_token,
    //     social_type: 'google',
    //     email: res?.email,
    //   };
    //   socialLoginApi(params)
    //     .unwrap()
    //     .then((result: any) => {
    //       //@ts-ignore
    //       navigation.navigate(RouteNames.PERSONAL_INFORMATION, {
    //         email: res?.email,
    //       });
    //     })
    //     .catch((err: any) => {
    //       console.log('err', err);
    //     });
    // });
  };

  return (
    <View
      style={{
        backgroundColor: CONSTANTS.THEME.colors.BackgroundColor,
        flex: 1,
      }}>
      <View
        style={{
          height: insets.top,
          backgroundColor: CONSTANTS.THEME.colors.TRANSPARENT,
        }}>
        <StatusBar
          translucent={true}
          backgroundColor={CONSTANTS.THEME.colors.TRANSPARENT}
        />
      </View>

      <GTScrollView>
        <StatusBar backgroundColor={CONSTANTS.THEME.colors.BackgroundColor} />
        <GTWelcomeHeader />
        <Image
          source={Welcome_Icon}
          resizeMode="cover"
          style={styles.imageStyle}
        />

        <View style={styles.constainer}>
          <View style={styles.welcomeContainer}>
            <GTLabel
              text={`${CONSTANTS.TEXT.WELCOME_WORLD} `}
              color={CONSTANTS.THEME.colors.Light_Gunmetal}
              fontSize={CONSTANTS.THEME.size.s12}
              fontWeight="400"
            />
            <GTLabel
              text={CONSTANTS.TEXT.PSYCHOLOGY}
              color={CONSTANTS.THEME.colors.PRIMARY_COLOR}
              fontSize={CONSTANTS.THEME.size.s12}
              fontWeight="700"
            />
          </View>
          <GTLabel
            text={`${CONSTANTS.TEXT.MINDFULL},`}
            color={CONSTANTS.THEME.colors.Dark_Gunmetal}
            fontSize={CONSTANTS.THEME.size.s28}
            fontWeight="700"
            customStyle={{marginTop: '1%'}}
          />
          <GTLabel
            text={CONSTANTS.TEXT.PERSONAL_GROWTH}
            color={CONSTANTS.THEME.colors.PRIMARY_COLOR}
            fontSize={CONSTANTS.THEME.size.s28}
            fontWeight="800"
          />
          <GTLabel
            text={CONSTANTS.TEXT.LOREM_TEXT}
            color={CONSTANTS.THEME.colors.Light_Primary_Gunmetal}
            fontFamily={CONSTANTS.THEME.typography.fontFamily.Black}
            fontWeight="400"
            fontSize={CONSTANTS.THEME.size.s14}
            customStyle={{
              marginTop: '2%',
              lineHeight: CONSTANTS.THEME.size.s22,
              marginBottom: '5%',
            }}
          />

          <GTButton
            //@ts-ignore
            onHandlePress={() => navigation.navigate(RouteNames.LOGIN)}
            leftIcon={<MobileIcon width={'100%'} height={'100%'} />}
            text={CONSTANTS.TEXT.SIGN_IN_VIA}
            color={CONSTANTS.THEME.colors.WHITE_COLOR}
            customStyle={styles.buttonStyle}
            leftStyle={{marginRight: CONSTANTS.THEME.size.s4}}
          />
          <GTORView />
          <View style={styles.socialContainer}>
            <GTButtonContainer onHandlePress={() => googleButtonPress()}>
              <GoogleIcon
                height={CONSTANTS.THEME.size.s24}
                width={CONSTANTS.THEME.size.s24}
              />
            </GTButtonContainer>
            {/* <GTButtonContainer>
            <FacebookIcon
              height={CONSTANTS.THEME.size.s24}
              width={CONSTANTS.THEME.size.s24}
            />
          </GTButtonContainer> */}
            {Platform.OS == 'ios' && (
              <GTButtonContainer
                onHandlePress={() => Alert.alert('Apple login')}>
                <AppleIcon
                  height={CONSTANTS.THEME.size.s24}
                  width={CONSTANTS.THEME.size.s24}
                />
              </GTButtonContainer>
            )}
          </View>
        </View>
      </GTScrollView>
      {isLoading && <GTIndicator />}
    </View>
  );
};

export default Welcome;
