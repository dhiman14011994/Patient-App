import {View, Platform, StatusBar, FlatList, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import CONSTANTS from '../../../utils/constants';
import styles from './styles';
import {White_Left_Icon} from '../../../assets';
import GTHeader from '../../../components/GTHeader';
import GTLinearGradientView from '../../../components/GTLinearGradientView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GTLabel from '../../../components/GTLabel';
import GTButton from '../../../components/GTButton';
import GTWithDrawalItem from '../../../components/GTWithDrawalItem';
import {useNavigation} from '@react-navigation/native';
import ListEmptyComponent from '../../../components/ListEmptyComponent/ListEmptyComponent';
import {useLazyGetAllTransactionApiQuery} from '../../../redux/payment-api-slice';
import moment from 'moment';
import {RouteNames} from '../../../utils/routesName';
import {useSelector} from 'react-redux';
import {reverseArr} from '../../../utils/customFunction';

const Wallet = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [getAllTransactionApi, {data: transactionData}] =
    useLazyGetAllTransactionApiQuery();
  const {userInfo} = useSelector((state: any) => state.appState);
  const [walletTransactionData, setWalletTransactionData] = useState([]);

  useEffect(() => {
    getAllTransaction();
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

  const getAllTransaction = () => {
    getAllTransactionApi('')
      .unwrap()
      .then((res: any) => {
        // let newData: any = reverseArr(res?.data || []);
        // setWalletTransactionData(newData || []);
      })
      .catch(e => console.log('all transaction err', e));
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
          text={CONSTANTS.TEXT.WALLET_TRANSACTIONS}
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

  const renderItem = ({item, index}: any) => {
    const dateTime = moment(item?.createdAt).format('DD MMM YYYY  h:mm a');

    const amountValue = item.isPaid
      ? Number(item?.amount) / 100
      : !Number.isInteger(item?.amount)
      ? parseFloat(item?.amount).toFixed(2)
      : item?.amount;

    return (
      <GTWithDrawalItem
        name={`${item?.userId?.firstName}${
          item?.userId?.lastName ? ' ' + item?.userId?.lastName : ''
        }`}
        isWithDrawer={item.isPaid}
        dateTime={dateTime}
        price={amountValue}
        duration={item?.duration || ''}
        walletId={item?.orderId}
        container={{marginTop: index == 0 ? '2%' : 0}}
        index={index}
      />
    );
  };

  const ListFooterComponent = () => {
    return <View style={{height: CONSTANTS.THEME.size.HEIGHT * 0.2}} />;
  };
  return (
    <View style={styles.container}>
      {hearderContainerView()}
      <FlatList
        data={transactionData?.data || []}
        renderItem={renderItem}
        keyExtractor={(item, index) => (index + 1).toString()}
        showsVerticalScrollIndicator={false}
        bounces={false}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
      />
      <View
        style={{
          ...styles.bottomContainer,
          bottom: insets.bottom,
        }}>
        <GTButton
          text={CONSTANTS.TEXT.RECHARGE}
          color={CONSTANTS.THEME.colors.WHITE_COLOR}
          backgroundColor={CONSTANTS.THEME.colors.PRIMARY_COLOR}
          customStyle={styles.continueButton}
          onHandlePress={() => {
            //@ts-ignore
            navigation.navigate(RouteNames.RECHARGE);
          }}
          fontSize={CONSTANTS.THEME.size.s16}
        />
      </View>
    </View>
  );
};

export default Wallet;
