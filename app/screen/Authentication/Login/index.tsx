import {View, BackHandler, StatusBar} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Error_Icon} from '../../../assets';
import CONSTANTS from '../../../utils/constants';
import GTLabel from '../../../components/GTLabel';
import GTLoginBack from '../../../components/GTLoginBack';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import GTButton from '../../../components/GTButton';
import GTLoginPhoneNumberInput from '../../../components/GTLoginPhoneNumberInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RouteNames} from '../../../utils/routesName';
import {useLoginApiMutation} from '../../../redux/auth-api-slice';
import GTIndicator from '../../../components/GTIndicator';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';

const Login = () => {
  const navigation = useNavigation();
  const [countryCode, setCountryCode] = useState('91');
  const [countryName, setCountryName] = useState('IN');
  const [fcmToken, setFcmToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberErr, setPhoneNumberErr] = useState('');
  const [loginApi, {isLoading}] = useLoginApiMutation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getToken();
    const goBack = () => {
      navigation.goBack();
      return true;
    };
    BackHandler?.addEventListener('hardwareBackPress', () => goBack());
    return () =>
      BackHandler?.removeEventListener('hardwareBackPress', () => goBack());
  }, []);

  const getToken = () => {
    messaging()
      .getToken()
      .then(token => {
        setFcmToken(token);
      })
      .catch(error => {
        console.log('error getting push token ' + error);
      });
  };

  const onPress = () => {
    if (phoneNumber.length < 9) {
      setPhoneNumberErr(CONSTANTS.TEXT.INVALID_PHONE_NUMBER);
    } else {
      var params = {
        countryCode: countryCode,
        mobileNumber: `${countryCode}${phoneNumber}`,
        // fcmToken: fcmToken || '',
      };
      loginApi(params)
        .unwrap()
        .then(res => {
          if (res.responseCode < 210) {
            Toast.show({
              type: 'success',
              text2: 'Otp send successfully',
            });
            //@ts-ignore
            navigation.navigate(RouteNames.OTP_VERIFICATION, {
              countryCode: countryCode,
              phone_number: phoneNumber,
              isLogin: false,
            });
          }
        })
        .catch(err => {
          if (err.status == 400) {
            Toast.show({
              type: 'error',
              text2:
                err?.data?.responseMessage ||
                'Something want wrong? Please try again',
            });
          } else {
            if (err.originalStatus == 503) {
              Toast.show({
                type: 'error',
                text2: err?.responseMessage || err?.data || '',
              });
            } else {
              Toast.show({
                type: 'error',
                text2:
                  err?.data?.responseMessage ||
                  'Something want wrong? Please try again',
              });
            }
          }
        });
    }
  };

  return (
    <View style={styles.container}>
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
      <StatusBar backgroundColor={CONSTANTS.THEME.colors.BackgroundColor} />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <GTLoginBack onHandlePress={() => navigation.goBack()} />
        <GTLabel
          text={CONSTANTS.TEXT.YOUR_NUMBER}
          color={CONSTANTS.THEME.colors.Dark_Gunmetal}
          fontSize={CONSTANTS.THEME.size.s28}
          textAlign="center"
          fontWeight="700"
          customStyle={styles.yourText}
        />
        <GTLabel
          text={CONSTANTS.TEXT.ENTER_PHONE_NUMBER}
          color={CONSTANTS.THEME.colors.Light_Gunmetal}
          fontSize={CONSTANTS.THEME.size.s14}
          textAlign="center"
          fontWeight="400"
        />

        <GTLoginPhoneNumberInput
          container={styles.inputContainer}
          onChangeText={(text: string) => {
            setPhoneNumber(text);
            if (phoneNumberErr) {
              setPhoneNumberErr('');
            }
          }}
          value={phoneNumber}
          onSelectCode={(code: any) => {
            setCountryCode(`${code.callingCode[0]}`);
            setCountryName(code?.cca2);
          }}
          keyboardType={CONSTANTS.KEYBOARD_TYPE.NUMBER_PAD}
          placeholder={CONSTANTS.TEXT.PHONE_NUMBER}
          countryCode={countryCode}
          countryName={countryName}
          customContainerStyle={{
            color: phoneNumberErr
              ? CONSTANTS.THEME.colors.RED
              : CONSTANTS.THEME.colors.Dark_Gunmetal,
          }}
          crossButtonPress={() => {
            setPhoneNumber('');
            setPhoneNumberErr('');
          }}
          maxLength={10}
        />
        {phoneNumberErr && (
          <View style={styles.errorView}>
            <Error_Icon
              width={CONSTANTS.THEME.size.s14}
              height={CONSTANTS.THEME.size.s14}
            />
            <GTLabel
              text={phoneNumberErr}
              color={CONSTANTS.THEME.colors.RED}
              fontSize={CONSTANTS.THEME.size.s12}
              fontWeight="400"
              customStyle={{marginLeft: '2%'}}
            />
          </View>
        )}

        <GTLabel
          text={CONSTANTS.TEXT.MAKE_SURE}
          color={CONSTANTS.THEME.colors.Light_Gunmetal}
          fontSize={CONSTANTS.THEME.size.s12}
          textAlign="center"
          fontWeight="400"
          customStyle={styles.makeSureText}
        />
        <GTButton
          text={CONSTANTS.TEXT.CONTINUE}
          color={
            phoneNumber.length > 6
              ? CONSTANTS.THEME.colors.WHITE_COLOR
              : CONSTANTS.THEME.colors.Light_Gunmetal
          }
          backgroundColor={
            phoneNumber.length > 6
              ? CONSTANTS.THEME.colors.PRIMARY_COLOR
              : CONSTANTS.THEME.colors.LIGHT_WHITE
          }
          customStyle={styles.continueButton}
          disabled={phoneNumber.length < 6}
          onHandlePress={() => onPress()}
        />
      </KeyboardAwareScrollView>
      {isLoading && <GTIndicator />}
    </View>
  );
};

export default Login;
