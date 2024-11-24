import {View, Text, Button, Alert, ActivityIndicator} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
//@ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import {useSelector} from 'react-redux';
import CONSTANTS from '../../utils/constants';
import {
  useGetOrderIdMutation,
  useUpdatePaymentMutation,
} from '../../redux/payment-api-slice';
import GTIndicator from '../../components/GTIndicator';

const PaymentConfirmation: FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const userInfo = useSelector((state: any) => state.appState.userInfo);
  const [getOrderId, {isLoading}] = useGetOrderIdMutation();
  const [updatePayment, {isLoading: paymentLoading}] =
    useUpdatePaymentMutation();

  const [orderId, setOderId] = useState('');
  const [amountValue, setAmountValue] = useState(0);
  const [isPayment, setIsPayment] = useState(false);
  const amount = route?.params?.amount;

  useEffect(() => {
    getOrderIdAPI();
  }, []);

  const getOrderIdAPI = async () => {
    try {
      let params = {currency: 'INR', amount: amount};
      getOrderId(params)
        .unwrap()
        .then((res: any) => {
          callPaymentGateway(res?.data?.id || '', res?.data?.amount || '');
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
      .catch((err: any) => {
        console.log('err>>', err, amountDue);
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
      const response: any = await updatePayment(params);
    } catch (err) {
      console.log('Error', err);
    }
  };

  return (
    <View style={{flex: 1}}>
      {isLoading || paymentLoading ? <GTIndicator /> : <></>}
    </View>
  );
};

export default PaymentConfirmation;
