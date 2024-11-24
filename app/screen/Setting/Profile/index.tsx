import {
  View,
  Platform,
  StatusBar,
  TouchableOpacity,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GTLinearGradientView from '../../../components/GTLinearGradientView';
import CONSTANTS from '../../../utils/constants';
import GTHeader from '../../../components/GTHeader';
import {Calender_Icon, WHITE_EDIT_ICON, White_Left_Icon} from '../../../assets';
import styles from './styles';
import GTImage from '../../../components/GTImage';
import GTButtonContainer from '../../../components/GTButtonContainer';
import {useFormik} from 'formik';
import {personalInfoValidationSchema} from '../../../utils/validations';
import moment from 'moment';
import GTScrollView from '../../../components/GTScrollView';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import GTInput from '../../../components/GTInput';
import GTGenderview from '../../../components/GTGenderView';
import GTButton from '../../../components/GTButton';
import GTModal from '../../../components/GTModal';
import {useDispatch, useSelector} from 'react-redux';
import GTSelectImageView from '../../../components/GTSelectImageView';
import DeviceInfo from 'react-native-device-info';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  useLazyGetUserDataApiQuery,
  usePersonalInformationApiMutation,
  useUploadFileApiMutation,
} from '../../../redux/auth-api-slice';
import GTIndicator from '../../../components/GTIndicator';
import Toast from 'react-native-toast-message';
import {setToken, setUserInfo} from '../../../redux/app-api-slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DatePickerModal,
  enGB,
  registerTranslation,
} from 'react-native-paper-dates';

//@ts-ignore
registerTranslation('en', enGB);

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocus = useIsFocused();
  const [nameFocus, setNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const insets = useSafeAreaInsets();
  const userInfo = useSelector((state: any) => state?.appState.userInfo);
  const [isModal, setModal] = useState(false);
  const [imageData, setImageData] = useState('');
  const [uploadFileApi, {data, isLoading}] = useUploadFileApiMutation();
  const [personalInformationApi, {data: userData, isLoading: updateLoading}] =
    usePersonalInformationApiMutation();
  const [getUserDataApi, {isLoading: getUserLoading}] =
    useLazyGetUserDataApiQuery();
  const dtToday = new Date();
  var month = dtToday.getMonth() + 1; // jan=0; feb=1 .......
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

  useEffect(() => {
    if (userInfo) {
      formik.setFieldValue('name', userInfo?.firstName || '');
      formik.setFieldValue('email', userInfo?.email || '');
      formik.setFieldValue('mobile_no', userInfo?.mobileNumber || '');
      formik.setFieldValue('dob', userInfo?.dob || '');
      formik.setFieldValue('gender', userInfo?.gender || '');
      formik.setFieldValue('userImage', userInfo?.profilePicture || '');
      var oldDate = moment(userInfo?.dob).toDate();
      var mDate = new Date(
        `${oldDate.getFullYear()}-${
          oldDate.getMonth() + 1
        }-${oldDate.getDate()}`,
      );

      setDate(mDate);
    }
  }, []);

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
          text={'Profile'}
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

  const submitForm = (values: any) => {
    if (imageData != '') {
      var formData = new FormData();
      formData.append('profile_picture', {
        uri: values.userImage,
        type: 'image/png',
        name: 'image.png',
      });
      uploadFileApi(formData)
        .unwrap()
        .then(res => {
          var params = {
            firstName: values.name,
            email: values.email,
            mobileNumber: values.mobile_no,
            dob: moment(values.dob).toISOString(),
            gender: values.gender.toLowerCase(),
            profilePicture: res?.data?.url || res?.data[0]?.url || '',
          };
          updateUserInfo(params);
        })
        .catch(e => {
          console.log('upload err', JSON.stringify(e));
        });
    } else {
      var params = {
        firstName: values.name,
        email: values.email,
        mobileNumber: values.mobile_no,
        dob: moment(values.dob).toISOString(),
        gender: values.gender.toLowerCase(),
        profilePicture: values.userImage,
      };
      updateUserInfo(params);
    }
  };

  const updateUserInfo = (params: any) => {
    personalInformationApi(params)
      .unwrap()
      .then(async res => {
        dispatch(setToken(res?.data?.accessToken));

        await AsyncStorage.setItem(
          CONSTANTS.STORAGE.TOKEN,
          res?.data?.accessToken || '',
        );
        getUserInfoData();
        Toast.show({
          type: 'success',
          text2: res?.responseMessage || 'Profile updated successfully',
        });
      })
      .catch(e => {
        console.log('error>>', JSON.stringify(e));
      });
  };

  const getUserInfoData = () => {
    getUserDataApi(userInfo?._id || userInfo?.id)
      .unwrap()
      .then(async res => {
        dispatch(setUserInfo(res.data));
        await AsyncStorage.setItem(
          CONSTANTS.STORAGE.USER_DATA,
          JSON.stringify(res.data),
        );

        navigation.goBack();
      })
      .catch(e => {
        console.log('error', JSON.stringify(e));
      });
  };

  const selectImage = async (type: string) => {
    try {
      let isCameraPermitted = await requestCameraPermission();
      let isStoragePermitted = await requestExternalWritePermission();
      let options: any = {
        maxWidth: CONSTANTS.THEME.size.WIDTH * 2,
        maxHeight: CONSTANTS.THEME.size.HEIGHT * 2,
        allowsEditing: false,
        noData: true,
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        quality: 1,
      };
      if (isCameraPermitted && isStoragePermitted) {
        if (type === 'camera') {
          launchCamera(options, async (res: any) => {
            if (res?.assets && res?.assets[0]) {
              setModal(false);
              setImageData(res?.assets[0]);
              formik.setFieldValue('userImage', res?.assets[0]?.uri);
            }
            setModal(false);
          }).catch(_ => {
            setModal(false);
          });
        } else {
          launchImageLibrary(options, async (response: any) => {
            if (response?.assets && response?.assets[0]) {
              setModal(false);
              setImageData(response?.assets[0]);
              formik.setFieldValue('userImage', response?.assets[0]?.uri);
            }
            setModal(false);
          }).catch(_ => {
            setModal(false);
          });
        }
      } else {
        setModal(false);
      }
    } catch (error) {
      setModal(false);
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          //@ts-ignore
          {
            title: CONSTANTS.TEXT.CAMERA_PERMISSION,
            message: CONSTANTS.TEXT.PERMISSION_MESSAGE,
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        let systemVersion: any = DeviceInfo.getSystemVersion();
        const granted = await request(
          systemVersion > 12
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
      }
      return false;
    } else {
      return true;
    }
  };

  const formik = useFormik({
    initialValues: {
      userImage: '',
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

  return (
    <View style={styles.container}>
      {hearderContainerView()}
      <GTScrollView>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <View style={styles.imageViewStyle}>
              <GTImage
                imageStyle={styles.imageStyle}
                uri={formik.values.userImage}
              />
              <GTButtonContainer
                customStyle={styles.editButton}
                onHandlePress={() => {
                  setModal(true);
                }}>
                <WHITE_EDIT_ICON
                  width={CONSTANTS.THEME.size.s18}
                  height={CONSTANTS.THEME.size.s18}
                />
              </GTButtonContainer>
            </View>
          </View>
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
              maxLength={40}
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
                backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
              }}
              isError={formik.errors.email && formik.errors.email}
              inputStyle={styles.inputStyle}
              keyboardType={CONSTANTS.KEYBOARD_TYPE.EMAIL_ADDRESS}
            />
            <GTInput
              label={CONSTANTS.TEXT.MOBILE_NUMBER}
              labelFontFamily={CONSTANTS.THEME.typography.fontFamily.Regular}
              placeholder={CONSTANTS.TEXT.MOBILE_NUMBER}
              input={formik.values.mobile_no}
              setInput={formik.handleChange('mobile_no')}
              onRightIconPress={() => {}}
              inputStyle={styles.inputStyle}
              inputContainer={{
                // backgroundColor: route?.params?.phone_number
                //   ? CONSTANTS.THEME.colors.NEUTRAL['200']
                //   : CONSTANTS.THEME.colors.WHITE_COLOR,
                backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
              }}
              keyboardType={CONSTANTS.KEYBOARD_TYPE.NUMBER_PAD}
              maxLength={15}
              editable={false}
            />
            <TouchableOpacity
              onPress={() => {
                // setVisble(true);
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
                // setInput={}
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
              paddingVertical: CONSTANTS.THEME.size.s10,
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
        </KeyboardAwareScrollView>
        <View
          style={{
            height: 100,
            marginBottom:
              insets.bottom == 0 ? CONSTANTS.THEME.size.s50 : insets.bottom,
            backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
          }}
        />
      </GTScrollView>

      <GTModal container={{justifyContent: 'flex-end'}} visible={isModal}>
        <GTSelectImageView
          onSelectImageType={selectImage}
          profileText={CONSTANTS.TEXT.CHOOSE_PROFILE_PHOTO}
          galleryText={CONSTANTS.TEXT.CHOOSE_FROM_GALLERY}
          cameraText={CONSTANTS.TEXT.CHOOSE_FROM_CAMERA}
          cancelText={CONSTANTS.TEXT.CANCEL}
          onClosePress={() => {
            setModal(false);
          }}
        />
      </GTModal>
      {(isLoading || updateLoading || getUserLoading) && <GTIndicator />}
    </View>
  );
};

export default Profile;
