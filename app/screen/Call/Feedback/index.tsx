import {
  View,
  Text,
  Platform,
  StatusBar,
  TextInput,
  BackHandler,
} from 'react-native';
import React, {useEffect} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GTLinearGradientView from '../../../components/GTLinearGradientView';
import CONSTANTS from '../../../utils/constants';
import GTHeader from '../../../components/GTHeader';
import {White_Left_Icon} from '../../../assets';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useFormik} from 'formik';
import styles from './styles';
import {feedbackValidationSchema} from '../../../utils/validations';
import GTInput from '../../../components/GTInput';
import GTLabel from '../../../components/GTLabel';
import CStar from '../../../components/CStar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import {RouteNames} from '../../../utils/routesName';
import {useAppointmentfeedbackApiMutation} from '../../../redux/filter-api-slice';
import GTIndicator from '../../../components/GTIndicator';
import GTButton from '../../../components/GTButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Feedback = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route: any = useRoute();
  const [appointmentfeedbackApi, {isLoading: feedbackLoading}] =
    useAppointmentfeedbackApiMutation();

  useEffect(() => {
    const backAction = () => {
      updateStatusValue();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      ratting: '',
      comment: '',
    },
    validationSchema: feedbackValidationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: values => {
      submitComment(values);
    },
  });

  const submitComment = (values: any) => {
    var param = {
      rating: values?.ratting || 1,
      comment: values?.comment || '',
      email: values?.email || '',
    };
    appointmentfeedbackApi({
      id: route?.params?.id || route?.params?._id,
      data: param,
    })
      .unwrap()
      .then((res: any) => {
        Toast.show({
          type: 'success',
          text2: res?.responseMessage || 'Feedback add successfully',
        });
        updateStatusValue();
      })
      .catch((err: any) => {
        console.log('error', err);
        Toast.show({
          type: 'error',
          text2: err?.data?.responseMessage || 'error',
        });
      });
  };

  const updateStatusValue = async () => {
    await AsyncStorage.setItem(CONSTANTS.STORAGE.IS_UPDATE, '1');
    navigation.reset({
      index: 0,
      //@ts-ignore
      routes: [{name: RouteNames.HOME_STACK}],
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
          text={'Feedback'}
          leftIcon={
            <White_Left_Icon
              width={CONSTANTS.THEME.size.s20}
              height={CONSTANTS.THEME.size.s20}
            />
          }
          customStyle={styles.headerContainer}
          textStyle={{textAlign: 'left'}}
          onHandleLeftPress={() => {
            // navigation.goBack();
            updateStatusValue();
          }}
        />
      </>
    );
  };
  return (
    <View style={styles.container}>
      {hearderContainerView()}

      <KeyboardAwareScrollView
        extraScrollHeight={100}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled">
        <View style={styles.subContainer}>
          <GTInput
            label={CONSTANTS.TEXT.EMAIL}
            labelFontFamily={CONSTANTS.THEME.typography.fontFamily.Regular}
            labelFontSize={CONSTANTS.THEME.size.s14}
            labelColor={CONSTANTS.THEME.colors.Dark_Gunmetal}
            placeholder={CONSTANTS.TEXT.ENTER_EMAIL_ADDRESS}
            input={formik.values.email}
            setInput={formik.handleChange('email')}
            autoCapitalize="none"
            onRightIconPress={() => {}}
            inputContainer={{
              backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
            }}
            isError={formik.errors.email && formik.errors.email}
            inputStyle={{
              ...styles.inputStyle,
              color: CONSTANTS.THEME.colors.Dark_Gunmetal,
            }}
            keyboardType={CONSTANTS.KEYBOARD_TYPE.EMAIL_ADDRESS}
            editable={true}
          />
          <View style={styles.rattingContainer}>
            <GTLabel
              text={'Please rate your experience'}
              fontSize={CONSTANTS.THEME.size.s14}
              fontFamily={CONSTANTS.THEME.typography.fontFamily.Regular}
              color={CONSTANTS.THEME.colors.Dark_Gunmetal}
              fontWeight={'600'}
              customStyle={{marginBottom: '2%'}}
            />
            <CStar
              ratting={formik.values.ratting}
              onPress={(value: any) => {
                formik.setFieldValue('ratting', value);
              }}
            />

            <GTLabel
              text={CONSTANTS.TEXT.ADDITIONAL_COMMENT}
              fontSize={CONSTANTS.THEME.size.s14}
              color={CONSTANTS.THEME.colors.Dark_Gunmetal}
              fontWeight={'600'}
              customStyle={{
                lineHeight: CONSTANTS.THEME.size.s22,
                marginTop: '5%',
              }}
            />
            <View style={styles.inputContainer}>
              <TextInput
                value={formik.values.comment}
                style={styles.inputViewStyle}
                onChangeText={text => {
                  formik.setFieldValue('comment', text);
                  // if (isError) {
                  //   setIsError(false);
                  // }
                }}
                multiline
                placeholder={'Enter Comment'}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            paddingVertical: CONSTANTS.THEME.size.s10,
            ...styles.bottomContainer,
          }}>
          <GTButton
            text={CONSTANTS.TEXT.SAVE_DETAILS}
            color={
              formik.values.email &&
              formik.values.ratting &&
              formik.values.comment
                ? CONSTANTS.THEME.colors.WHITE_COLOR
                : CONSTANTS.THEME.colors.Light_Gunmetal
            }
            backgroundColor={
              formik.values.email &&
              formik.values.ratting &&
              formik.values.comment
                ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                : CONSTANTS.THEME.colors.LIGHT_WHITE
            }
            customStyle={styles.continueButton}
            disabled={
              !(
                formik.values.email &&
                formik.values.ratting &&
                formik.values.comment
              )
            }
            onHandlePress={formik.handleSubmit}
            fontSize={CONSTANTS.THEME.size.s16}
          />
        </View>
        {feedbackLoading && <GTIndicator />}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Feedback;
