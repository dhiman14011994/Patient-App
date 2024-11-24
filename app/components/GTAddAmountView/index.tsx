import {View, Text, Keyboard} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import styles from './styles';
import GTLabel from '../GTLabel';
import CONSTANTS from '../../utils/constants';
import GTSelectionSchedule from '../GTSelectionSchedule';
import GTButtonContainer from '../GTButtonContainer';
import {X_CLOSE_ICON} from '../../assets';
import GTButton from '../GTButton';
import DatePicker from 'react-native-date-picker';
import GTInput from '../GTInput';
import GTScrollView from '../GTScrollView';
import {amountList} from '../../utils/CustomData';

interface GTAddAmountViewProps {
  onClosePress?: () => void;
  amountDetail?: any;
  isLoading?: boolean;
  onPress?: any;
  setAmountDetail?: any;
  item?: any;
}

const GTAddAmountView: FC<GTAddAmountViewProps> = ({
  onClosePress,
  onPress,
  isLoading,
  item,
  amountDetail,
  setAmountDetail,
}) => {
  var isDisabled = amountDetail?.balance ? false : true;
  var name = `${item.firstName || 'abc'}${
    item?.lastName ? ' ' + item?.lastName : ''
  }`;

  const renderAmountView = ({it, index}: any) => {
    return (
      <GTButtonContainer
        key={(index + 1).toString()}
        onHandlePress={() => setAmountDetail(it)}
        customStyle={{
          ...styles.amountView,
          borderColor:
            amountDetail?.balance == it?.balance
              ? CONSTANTS.THEME.colors.PRIMARY_COLOR
              : CONSTANTS.THEME.colors.NEUTRAL[300],
          backgroundColor:
            amountDetail?.balance == it?.balance
              ? '#F0F5FF'
              : CONSTANTS.THEME.colors.WHITE_COLOR,
        }}>
        {/* <GTLabel
          text={`${it.discount}% Extra`}
          color={
            amountDetail?.balance == it?.balance
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
            amountDetail?.balance == it?.balance
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
    <View style={{...styles.container}}>
      <GTScrollView>
        <GTButtonContainer
          customStyle={styles.closeContainer}
          onHandlePress={onClosePress}>
          <X_CLOSE_ICON
            width={CONSTANTS.THEME.size.s18}
            height={CONSTANTS.THEME.size.s18}
          />
        </GTButtonContainer>
        <View>
          <View style={{...styles.mainContainer}}>
            <View style={styles.subContainer}>
              <GTLabel
                text={CONSTANTS.TEXT.RECHARGE_NOW}
                fontSize={CONSTANTS.THEME.size.s22}
                color={CONSTANTS.THEME.colors.Dark_Gunmetal}
                fontWeight={'700'}
                customStyle={{lineHeight: CONSTANTS.THEME.size.s32}}
              />
              <GTLabel
                text={CONSTANTS.TEXT.MINIMUM({
                  name: name,
                  balance: item.wageForChat || 1,
                })}
                fontSize={CONSTANTS.THEME.size.s14}
                color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
                fontWeight={'400'}
                customStyle={{
                  lineHeight: CONSTANTS.THEME.size.s22,
                  marginBottom: CONSTANTS.THEME.size.s22,
                }}
                textAlign="center"
              />
              <View style={styles.amountContainer}>
                {amountList.map((it, index) => renderAmountView({it, index}))}
              </View>

              <GTButton
                onHandlePress={onPress}
                text={CONSTANTS.TEXT.PROCEED}
                fontSize={CONSTANTS.THEME.size.s16}
                fontWeight={'600'}
                color={
                  !isDisabled
                    ? CONSTANTS.THEME.colors.WHITE_COLOR
                    : CONSTANTS.THEME.colors.Light_Gunmetal
                }
                backgroundColor={
                  !isDisabled
                    ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                    : CONSTANTS.THEME.colors.LIGHT_WHITE
                }
                disabled={isDisabled}
                customStyle={{...styles.buttonContainer}}
                isLoading={isLoading}
              />
            </View>
          </View>
        </View>
      </GTScrollView>
    </View>
  );
};

export default GTAddAmountView;
