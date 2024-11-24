import {
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import GTHeader from '../../../components/GTHeader';
import CONSTANTS from '../../../utils/constants';
import {Calender_Icon, White_Left_Icon} from '../../../assets';
import styles from './styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GTLinearGradientView from '../../../components/GTLinearGradientView';
import {useFormik} from 'formik';
import {personalInfoValidationSchema} from '../../../utils/validations';
import GTScrollView from '../../../components/GTScrollView';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import GTInput from '../../../components/GTInput';
import {useNavigation, useRoute} from '@react-navigation/native';
import GTGenderview from '../../../components/GTGenderView';
import GTButton from '../../../components/GTButton';
import moment from 'moment';
import {RouteNames} from '../../../utils/routesName';
import {useDispatch} from 'react-redux';
import {setIsLogin, setToken, setUserInfo} from '../../../redux/app-api-slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {usePersonalInformationApiMutation} from '../../../redux/auth-api-slice';
import Toast from 'react-native-toast-message';
import GTIndicator from '../../../components/GTIndicator';
import {
  DatePickerModal,
  enGB,
  registerTranslation,
} from 'react-native-paper-dates';

//@ts-ignore
registerTranslation('en', enGB);

const PersonalInformation = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [nameFocus, setNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [personalInformationApi, {isLoading}] =
    usePersonalInformationApiMutation();
  const dispatch = useDispatch();
  const dtToday = new Date();
  var month = dtToday.getMonth() + 1;
  var day = dtToday.getDate();
  var year = dtToday.getFullYear() - 18;
  var maxDate = new Date(`${year}-${month}-${day}`);

  const [date, setDate] = React.useState(maxDate);
  const [open, setOpen] = React.useState(false);

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    (params: any) => {
      setOpen(false);
      setDate(params.date);
      formik.setFieldValue('dob', params.date);
    },
    [setOpen, setDate],
  );

  const route: any = useRoute();

  useEffect(() => {
    const backAction = () => {
      navigation.reset({
        index: 0,
        //@ts-ignore
        routes: [{name: RouteNames.WELCOME}],
      });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (route?.params?.phone_number) {
      formik.setFieldValue(
        'mobile_no',
        route?.params?.phone_number ? `+${route?.params?.phone_number}` : '',
      );
    } else if (route?.params?.email) {
      formik.setFieldValue('email', route?.params?.email || '');
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobile_no: '',
      dob: '',
      gender: '',
    },
    validationSchema: personalInfoValidationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: values => {
      submitForm(values);
    },
  });

  const submitForm = (values: any) => {
    var params = {
      firstName: values.name,
      email: values.email,
      mobileNumber: route?.params?.phone_number
        ? route?.params?.phone_number
        : values.mobile_no,
      dob: moment(values.dob).toISOString(),
      gender: values.gender.toLowerCase(),
    };
    personalInformationApi(params)
      .unwrap()
      .then(async response => {
        if (response.responseCode < 210) {
          Toast.show({
            type: 'success',
            text2: response?.responseMessage || 'Profile updated successfully',
          });
          if (response.data) {
            dispatch(setUserInfo(response.data));
            dispatch(setToken(response?.data?.accessToken));
            await AsyncStorage.setItem(
              CONSTANTS.STORAGE.TOKEN,
              response?.data?.accessToken || '',
            );
            dispatch(setIsLogin(true));
            await AsyncStorage.setItem(CONSTANTS.STORAGE.ISLOGGED, 'true');
            await AsyncStorage.setItem(
              CONSTANTS.STORAGE.USER_DATA,
              response?.data ? JSON.stringify(response?.data) : '',
            );
          }
        }
      })
      .catch(error => {
        console.log('error', error);
        if (error.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: error?.responseMessage || error?.data || '',
          });
        }
      });
  };

  return (
    <View style={styles.container}>
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
        text={CONSTANTS.TEXT.PERSONAL_INFORMATION}
        leftIcon={<White_Left_Icon width={20} height={20} />}
        customStyle={styles.headerContainer}
        onHandleLeftPress={() => {
          navigation.reset({
            index: 0,
            //@ts-ignore
            routes: [{name: RouteNames.WELCOME}],
          });
        }}
      />
      <GTScrollView>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.inputFormContainer}>
            <GTInput
              label={CONSTANTS.TEXT.NAME}
              labelFontFamily={CONSTANTS.THEME.typography.fontFamily.Regular}
              focus={nameFocus}
              placeholder={CONSTANTS.TEXT.ENTER_NAME}
              input={formik.values.name}
              setInput={formik.handleChange('name')}
              onRightIconPress={() => {}}
              setfocus={setNameFocus}
              isError={formik.errors.name && formik.errors.name}
              inputStyle={styles.inputStyle}
              maxLength={50}
            />
            <GTInput
              label={CONSTANTS.TEXT.EMAIL}
              labelFontFamily={CONSTANTS.THEME.typography.fontFamily.Regular}
              focus={emailFocus}
              placeholder={CONSTANTS.TEXT.ENTER_EMAIL_ADDRESS}
              input={formik.values.email}
              setInput={formik.handleChange('email')}
              autoCapitalize="none"
              onRightIconPress={() => {}}
              setfocus={() => {
                setEmailFocus(true);
                setNameFocus(false);
              }}
              inputContainer={{
                backgroundColor: route?.params?.email
                  ? CONSTANTS.THEME.colors.NEUTRAL['200']
                  : CONSTANTS.THEME.colors.WHITE_COLOR,
              }}
              isError={formik.errors.email && formik.errors.email}
              inputStyle={{
                ...styles.inputStyle,
                color: route?.params?.email
                  ? 'rgba(29, 36, 51, 0.65)'
                  : CONSTANTS.THEME.colors.Dark_Gunmetal,
              }}
              keyboardType={CONSTANTS.KEYBOARD_TYPE.EMAIL_ADDRESS}
              editable={route?.params?.email ? false : true}
            />
            <GTInput
              label={CONSTANTS.TEXT.MOBILE_NUMBER}
              labelFontFamily={CONSTANTS.THEME.typography.fontFamily.Regular}
              placeholder={CONSTANTS.TEXT.MOBILE_NUMBER}
              input={formik.values.mobile_no}
              setInput={formik.handleChange('mobile_no')}
              onRightIconPress={() => {}}
              inputStyle={{
                ...styles.inputStyle,
                color: route?.params?.phone_number
                  ? 'rgba(29, 36, 51, 0.65)'
                  : CONSTANTS.THEME.colors.Dark_Gunmetal,
              }}
              inputContainer={{
                backgroundColor: route?.params?.phone_number
                  ? CONSTANTS.THEME.colors.NEUTRAL['200']
                  : CONSTANTS.THEME.colors.WHITE_COLOR,
              }}
              keyboardType={CONSTANTS.KEYBOARD_TYPE.NUMBER_PAD}
              editable={route?.params?.phone_number ? false : true}
            />
            <TouchableOpacity
              onPress={() => {
                setOpen(true);
              }}>
              <GTInput
                label={CONSTANTS.TEXT.DATE_BIRTH}
                labelFontFamily={CONSTANTS.THEME.typography.fontFamily.Regular}
                customStyle={{pointerEvents: 'none'}}
                placeholder={CONSTANTS.TEXT.SELECT_DATE}
                input={
                  formik.values.dob
                    ? moment(formik.values.dob).format('DD MMM, YYYY')
                    : ''
                }
                onRightIconPress={() => {}}
                isError={formik.errors.dob && formik.errors.dob}
                inputStyle={styles.inputStyle}
                keyboardType={CONSTANTS.KEYBOARD_TYPE.EMAIL_ADDRESS}
                rightIcon={
                  <Calender_Icon
                    width={CONSTANTS.THEME.size.s20}
                    height={CONSTANTS.THEME.size.s20}
                  />
                }
              />
            </TouchableOpacity>

            <GTGenderview
              labelOne={CONSTANTS.TEXT.MALE}
              labelTwo={CONSTANTS.TEXT.FEMALE}
              labelThree={CONSTANTS.TEXT.OTHER}
              selectedValue={formik.values.gender}
              onPress={(value: any) => {
                formik.setFieldValue('gender', value);
              }}
            />
          </View>
          <View
            style={{
              height:
                CONSTANTS.THEME.size.HEIGHT * 0.3 -
                insets.top -
                CONSTANTS.THEME.size.s60 -
                insets.bottom,
              ...styles.bottomContainer,
            }}>
            <GTButton
              text={CONSTANTS.TEXT.SAVE_DETAILS}
              color={
                formik.values.name &&
                formik.values.email &&
                formik.values.dob &&
                formik.values.gender
                  ? CONSTANTS.THEME.colors.WHITE_COLOR
                  : CONSTANTS.THEME.colors.Light_Gunmetal
              }
              backgroundColor={
                formik.values.name &&
                formik.values.email &&
                formik.values.dob &&
                formik.values.gender
                  ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                  : CONSTANTS.THEME.colors.LIGHT_WHITE
              }
              customStyle={styles.continueButton}
              disabled={
                !(
                  formik.values.name &&
                  formik.values.email &&
                  formik.values.dob &&
                  formik.values.gender
                )
              }
              onHandlePress={formik.handleSubmit}
              fontSize={CONSTANTS.THEME.size.s16}
            />
          </View>
          <DatePickerModal
            locale="en"
            mode="single"
            visible={open}
            onDismiss={onDismissSingle}
            date={date}
            onConfirm={onConfirmSingle}
            presentationStyle={'pageSheet'}
            startYear={1950}
            endYear={year}
          />
          <View style={{height: insets.bottom}} />
        </KeyboardAwareScrollView>
      </GTScrollView>

      {isLoading && <GTIndicator />}
    </View>
  );
};

export default PersonalInformation;
