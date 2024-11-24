import {
  View,
  Text,
  StatusBar,
  Platform,
  BackHandler,
  Modal,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import GTLinearGradientView from '../../../components/GTLinearGradientView';
import CONSTANTS from '../../../utils/constants';
import GTLabel from '../../../components/GTLabel';
import {White_Left_Icon} from '../../../assets';
import GTHeader from '../../../components/GTHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import styles from './styles';
//@ts-ignore
import {useDispatch, useSelector} from 'react-redux';
import GTButton from '../../../components/GTButton';
import {amountList} from '../../../utils/CustomData';
import GTButtonContainer from '../../../components/GTButtonContainer';
import {useLazyGetUserDataApiQuery} from '../../../redux/auth-api-slice';
import {
  useGetOrderIdMutation,
  useUpdatePaymentMutation,
} from '../../../redux/payment-api-slice';
//@ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import Toast from 'react-native-toast-message';
import {setUserInfo} from '../../../redux/app-api-slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GTModal from '../../../components/GTModal';
import GTRazorpayWebView from '../../../components/GTRazorpayWebView';

const Recharge = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {userInfo} = useSelector((state: any) => state.appState);
  const [amount, setAmount] = React.useState<any>({});
  const [getUserDataApi, {isLoading: getUserLoading}] =
    useLazyGetUserDataApiQuery();
  const [getOrderId, {isLoading: orderLoading}] = useGetOrderIdMutation();
  const [updatePayment, {isLoading: paymentLoading}] =
    useUpdatePaymentMutation();
  const isFocus = useIsFocused();
  const [orderId, setOderId] = useState('');
  const [amountValue, setAmountValue] = useState(0);
  const [isPayment, setIsPayment] = useState(false);

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

  const getOrderIdAPI = async (amount: any) => {
    try {
      let params = {currency: 'INR', amount: amount};
      getOrderId(params)
        .unwrap()
        .then((res: any) => {
          // callPaymentGateway(res?.data?.id || '', res?.data?.amount || '');

          if (res?.data?.id) {
            setOderId(res?.data?.id);
            setAmountValue(res?.data?.amount);
            setIsPayment(true);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log('Error', err);
    }
  };

  const callPaymentGateway = (order_id: string, amountDue: string) => {
    var options = {
      description: '',
      image: userInfo?.profilePicture || '',
      currency: 'INR',
      key: 'rzp_test_4rrCmYtqWUOUvT', // Your api key
      amount: amountDue,
      order_id: order_id,
      name: userInfo?.firstName || '',
      prefill: {
        email: userInfo?.email || '',
        contact: userInfo?.mobileNumber || '',
        name: userInfo?.firstName || '',
      },
      theme: {color: CONSTANTS.THEME.colors.PRIMARY_COLOR},
    };

    RazorpayCheckout.open(options)
      .then((data: any) => {
        // handle success
        const {razorpay_payment_id, razorpay_order_id} = data;
        updatePaymentAPI(razorpay_payment_id, razorpay_order_id);
      })
      .catch(() => {
        // handle failure
        setTimeout(() => {
          // navigation.goBack();
        }, 500);
        // Alert.alert(`Errasync or: ${error.code} | ${error.description}`);
      });
  };

  const updatePaymentAPI = async (paymentId: string, orderId: string) => {
    try {
      let params = {orderId: orderId, paymentId: paymentId};
      updatePayment(params)
        .unwrap()
        .then(response => {
          getUserInfoData();
          Toast.show({
            type: 'success',
            text2: 'Payment updated successfully',
          });
        })
        .catch(error => {
          console.log('Error', error);
        });
    } catch (err) {
      console.log('Error', err);
    }
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
      })
      .catch(e => {
        console.log('error', JSON.stringify(e));
      });
  };

  const hearderContainerView = () => {
    return (
      <>
        {Platform.OS == 'android' ? (
          <GTLinearGradientView>
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
        <GTLinearGradientView
          container={{
            height:
              insets.top < 35
                ? insets.top
                : Platform.OS == 'android'
                ? insets.top
                : 35,
            backgroundColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
          }}
        />

        <GTHeader
          text={CONSTANTS.TEXT.ADD_MONEY}
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
        <GTLinearGradientView
          container={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: CONSTANTS.THEME.size.s10,
          }}>
          <GTLabel
            text={`₹${
              userInfo?.balance ? parseFloat(userInfo?.balance).toFixed(2) : 0
            }`}
            fontSize={CONSTANTS.THEME.size.s32}
            color={CONSTANTS.THEME.colors.WHITE[100]}
            fontWeight="700"
            customStyle={{lineHeight: CONSTANTS.THEME.size.s40}}
          />
          <GTLabel
            text={CONSTANTS.TEXT.AVAILABLE_BALANCE}
            fontSize={CONSTANTS.THEME.size.s14}
            color={CONSTANTS.THEME.colors.WHITE[80]}
            fontWeight="400"
            customStyle={{lineHeight: CONSTANTS.THEME.size.s22}}
          />
        </GTLinearGradientView>
      </>
    );
  };

  const renderAmountView = ({it, index}: any) => {
    return (
      <GTButtonContainer
        key={(index + 1).toString()}
        onHandlePress={() => setAmount(it)}
        customStyle={{
          ...styles.amountView,
          borderColor:
            amount?.balance == it?.balance
              ? CONSTANTS.THEME.colors.PRIMARY_COLOR
              : CONSTANTS.THEME.colors.NEUTRAL[300],
          backgroundColor:
            amount?.balance == it?.balance
              ? '#F0F5FF'
              : CONSTANTS.THEME.colors.WHITE_COLOR,
        }}>
        {/* <GTLabel
          text={`${it.discount}% Extra`}
          color={
            amount?.balance == it?.balance
              ? CONSTANTS.THEME.colors.Dark_Gunmetal
              : CONSTANTS.THEME.colors.SECONDARY_COLOR[80]
          }
          fontSize={CONSTANTS.THEME.size.s12}
          customStyle={{lineHeight: CONSTANTS.THEME.size.s14}}
          fontWeight="400"
        /> */}
        <GTLabel
          text={`₹${it.balance}`}
          color={
            amount?.balance == it?.balance
              ? CONSTANTS.THEME.colors.PRIMARY_COLOR
              : CONSTANTS.THEME.colors.Dark_Gunmetal
          }
          fontWeight="700"
          fontSize={CONSTANTS.THEME.size.s14}
          customStyle={{
            lineHeight: CONSTANTS.THEME.size.s18,
            marginTop: CONSTANTS.THEME.size.s4,
          }}
        />
      </GTButtonContainer>
    );
  };

  return (
    <View style={styles.container}>
      {hearderContainerView()}

      <View style={styles.amountContainer}>
        {[...amountList, {balance: 10000, discount: 12}].map((it, index) =>
          renderAmountView({it, index}),
        )}
      </View>
      <View
        style={{
          ...styles.bottomContainer,
          bottom: insets.bottom,
        }}>
        <GTButton
          disabled={amount?.balance == undefined}
          text={CONSTANTS.TEXT.PROCEED}
          color={
            amount?.balance
              ? CONSTANTS.THEME.colors.WHITE_COLOR
              : CONSTANTS.THEME.colors.Light_Gunmetal
          }
          backgroundColor={
            amount?.balance
              ? CONSTANTS.THEME.colors.PRIMARY_COLOR
              : CONSTANTS.THEME.colors.LIGHT_WHITE
          }
          customStyle={styles.continueButton}
          onHandlePress={() => {
            getOrderIdAPI(amount?.balance);
          }}
          fontSize={CONSTANTS.THEME.size.s16}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPayment}
        onRequestClose={() => {
          setIsPayment(false);
        }}>
        <GTRazorpayWebView
          orderId={orderId}
          amount={amountValue}
          PaymentResponseSuccess={(response: any) => {
            updatePaymentAPI(
              response?.razorpay_payment_id,
              response?.razorpay_order_id,
            );
            setIsPayment(false);
          }}
          PaymentResponseFailure={() => {
            Toast.show({
              type: 'error',
              text1: 'Payment Failed',
              text2: 'Payment failed, please try again.',
            });
            setIsPayment(false);
          }}
          userInfo={userInfo}
        />
      </Modal>
    </View>
  );
};

export default Recharge;
