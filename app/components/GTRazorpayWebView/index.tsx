import {View, Text, Alert} from 'react-native';
import React, {useState, FC} from 'react';
import {WebView} from 'react-native-webview';
import styles from './styles';

interface GTRazorpayWebViewProps {
  orderId?: any;
  amount?: any;
  PaymentResponseSuccess?: any;
  PaymentResponseFailure?: any;
  userInfo?: any;
}

const GTRazorpayWebView: FC<GTRazorpayWebViewProps> = ({
  orderId,
  amount,
  PaymentResponseSuccess,
  PaymentResponseFailure,
  userInfo,
}) => {
  console.log('orderId', orderId, amount);
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Razorpay Checkout</title>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </head>
    <body>

        <script>
            var options = {
                "key": "rzp_test_4rrCmYtqWUOUvT", // Enter the Key ID generated from Razorpay Dashboard
                "amount": "${amount}", // Dynamically passed amount from React Native (in smallest currency unit)
                "currency": "INR",
                "name": "${userInfo?.firstName}",
                "description": "Test Transaction",
                "image": "${
                  userInfo?.profilePicture || 'https://example.com/your_logo'
                }",
                "order_id": "${orderId}", // Dynamically passed order ID from React Native
                "handler": function (response){
                    window.ReactNativeWebView.postMessage(JSON.stringify(response));
                },
                "prefill": {
                    "name": "${userInfo?.firstName || ''}",
                    "email": "${userInfo?.email || ''}",
                    "contact": "${userInfo?.mobileNumber || ''}"
                },
                "notes": {
                    "address": "Test Address"
                },
                "theme": {
                    "color": "#3399cc"
                }
            };
            var rzp1 = new Razorpay(options);
            rzp1.open();
        </script>
    </body>
    </html>
  `;

  const handleWebViewMessage = (event: any) => {
    const data = event.nativeEvent.data;
    try {
      const response = JSON.parse(data);
      if (response.razorpay_payment_id) {
        // Handle payment success
        PaymentResponseSuccess(response);
      } else {
        // Handle failure
        PaymentResponseFailure();
      }
    } catch (e) {
      console.error('Error parsing Razorpay response: ', e);
      PaymentResponseFailure();
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{html: htmlContent}}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
      />
    </View>
  );
};

export default GTRazorpayWebView;
