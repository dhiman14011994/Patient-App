import {View, StatusBar, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import GTSafeAreaView from '../../../components/GTSafeAreaView';
import GTLoginBack from '../../../components/GTLoginBack';
import {useNavigation, useRoute} from '@react-navigation/native';
import GTLabel from '../../../components/GTLabel';
import CONSTANTS from '../../../utils/constants';
import styles from './styles';
import GTOtpView from '../../../components/GTOtpView';
import GTButton from '../../../components/GTButton';
import {RouteNames} from '../../../utils/routesName';
import {
  useOtpVerificationApiMutation,
  useResendCodeApiMutation,
} from '../../../redux/auth-api-slice';
import GTIndicator from '../../../components/GTIndicator';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {setIsLogin, setToken, setUserInfo} from '../../../redux/app-api-slice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtpVerification = () => {
  const navigation = useNavigation();
  const route: any = useRoute();
  const [inputOtp, setInputOtp] = useState(['', '', '', '']);
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    CONSTANTS.TEXT.VALID_VERIFICATION_CODE || '',
  );
  const [isResend, setResend] = useState(false);
  const [timeValue, setTimeValue] = useState(59);
  const [otpVerificationApi, {data, isLoading: verifyLoading}] =
    useOtpVerificationApiMutation();
  const [resendCodeApi, {isLoading: resendLoading}] =
    useResendCodeApiMutation();
  const dispatch = useDispatch();

  const onHandleRest = () => {
    var params = {
      mobile: `${route?.params?.countryCode}${route?.params?.phone_number}`,
    };
    resendCodeApi(params)
      .unwrap()
      .then((res: any) => {
        Toast.show({
          type: 'success',
          text2: 'Otp send successfully',
        });
      })
      .catch((err: any) => {
        console.log('<<<err', err);
      });
    setResend(true);
    setTimeValue(59);
  };

  useEffect(() => {
    if (isResend) {
      const interval = setInterval(() => {
        setTimeValue(preview => {
          if (preview <= 1) {
            clearInterval(interval);
            setResend(false);
            return preview;
          } else {
            return preview - 1;
          }
        });
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isResend]);

  const onHandlePress = () => {
    if (inputOtp[0] && inputOtp[1] && inputOtp[2] && inputOtp[3]) {
      var params = {
        countryCode: route?.params?.countryCode,
        mobileNumber: `${route?.params?.countryCode}${route?.params?.phone_number}`,
        otp: `${inputOtp[0]}${inputOtp[1]}${inputOtp[2]}${inputOtp[3]}`,
      };
      otpVerificationApi(params)
        .unwrap()
        .then(async res => {
          if (res.data) {
            Toast.show({
              type: 'success',
              text2: 'login successful',
            });
            if (res.data?.isLogIn) {
              dispatch(setUserInfo(res.data));
              dispatch(setToken(res?.data?.accessToken));
              await AsyncStorage.setItem(
                CONSTANTS.STORAGE.TOKEN,
                res?.data?.accessToken || '',
              );
              await AsyncStorage.setItem(
                CONSTANTS.STORAGE.USER_DATA,
                JSON.stringify(res.data),
              );
              await AsyncStorage.setItem(CONSTANTS.STORAGE.ISLOGGED, 'true');
              dispatch(setIsLogin(true));
            } else {
              dispatch(setToken(res?.data?.accessToken));
              await AsyncStorage.setItem(
                CONSTANTS.STORAGE.TOKEN,
                res?.data?.accessToken || '',
              );
              // @ts-ignore
              navigation.navigate(RouteNames.PERSONAL_INFORMATION, {
                phone_number: `${route?.params?.countryCode}${route?.params?.phone_number}`,
              });
            }
          }
        })
        .catch(err => {
          console.log('err', err);
          if (err.originalStatus == 503) {
            Toast.show({
              type: 'error',
              text2: err?.responseMessage || err?.data || '',
            });
          } else {
            Toast.show({
              type: 'error',
              text2: err?.data?.responseMessage || 'Somethings went wrong',
            });
          }
        });
    } else {
      setError(true);
    }
  };

  useEffect(() => {
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

  return (
    <GTSafeAreaView>
      <StatusBar backgroundColor={CONSTANTS.THEME.colors.BackgroundColor} />
      <GTLoginBack onHandlePress={() => navigation.goBack()} />
      <GTLabel
        text={CONSTANTS.TEXT.VERIFICATION_CODE}
        textAlign="center"
        fontSize={CONSTANTS.THEME.size.s28}
        color={CONSTANTS.THEME.colors.Dark_Gunmetal}
        fontWeight="700"
        customStyle={{marginTop: '8%'}}
      />
      <GTLabel
        text={`${CONSTANTS.TEXT.PLEASE_ENTER_CODE} ${
          route?.params?.phone_number
            ? `+${route?.params?.countryCode} ${route?.params?.phone_number}`
            : '+91 785464854'
        }`}
        color={CONSTANTS.THEME.colors.Light_Gunmetal}
        fontSize={CONSTANTS.THEME.size.s14}
        textAlign="center"
        fontWeight="400"
        customStyle={styles.enterCodeText}
      />
      <GTLabel
        text={CONSTANTS.TEXT.EDIT_NUMBER}
        color={CONSTANTS.THEME.colors.PRIMARY_COLOR}
        fontSize={CONSTANTS.THEME.size.s16}
        fontWeight="600"
        textAlign="center"
        onPress={() => navigation.goBack()}
        customStyle={{marginBottom: '15%'}}
      />

      <GTOtpView
        isError={isError}
        errorMessage={errorMessage}
        inputCount={4}
        onCodeFilled={(otp: any) => {
          setInputOtp(otp);
          setError(false);
        }}
        setError={(value: any) => {
          setError(value);
        }}
      />
      <View style={styles.buttonStyle}>
        {isResend ? (
          <GTLabel
            text={`${CONSTANTS.TEXT.RESEND_CODE} in 0:${timeValue}`}
            color={CONSTANTS.THEME.colors.Light_Gunmetal}
            fontSize={CONSTANTS.THEME.size.s12}
            fontWeight="400"
            textAlign="center"
            onPress={() => {}}
            customStyle={{marginBottom: '2%'}}
          />
        ) : (
          <GTLabel
            text={CONSTANTS.TEXT.RESEND_CODE}
            color={CONSTANTS.THEME.colors.PRIMARY_COLOR}
            fontSize={CONSTANTS.THEME.size.s12}
            fontWeight="600"
            textAlign="center"
            onPress={() => {
              onHandleRest();
            }}
            customStyle={{marginBottom: '3%'}}
          />
        )}

        <GTButton
          text={CONSTANTS.TEXT.CONTINUE}
          color={
            verifyLoading ||
            resendLoading ||
            (inputOtp[0] && inputOtp[1] && inputOtp[2] && inputOtp[3])
              ? CONSTANTS.THEME.colors.WHITE_COLOR
              : CONSTANTS.THEME.colors.Light_Gunmetal
          }
          backgroundColor={
            verifyLoading ||
            resendLoading ||
            (inputOtp[0] && inputOtp[1] && inputOtp[2] && inputOtp[3])
              ? CONSTANTS.THEME.colors.PRIMARY_COLOR
              : CONSTANTS.THEME.colors.LIGHT_WHITE
          }
          customStyle={styles.continueButton}
          disabled={
            verifyLoading ||
            resendLoading ||
            (inputOtp[0] == '' &&
              inputOtp[1] == '' &&
              inputOtp[2] == '' &&
              inputOtp[3] == '')
          }
          onHandlePress={() => {
            onHandlePress();
          }}
        />
      </View>
      {(verifyLoading || resendLoading) && <GTIndicator />}
    </GTSafeAreaView>
  );
};

export default OtpVerification;
