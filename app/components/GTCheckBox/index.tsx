import React, {FC} from 'react';
import {View, TouchableOpacity, ViewStyle} from 'react-native';
import {Active_Check_Icon} from '../../assets';
import {styles} from './style';
import GTLabel from '../GTLabel';
import CONSTANTS from '../../utils/constants';
import GTButtonContainer from '../GTButtonContainer';

interface GTCheckBoxProps {
  onPressHandle?: () => void;
  data?: any;
  container?: ViewStyle;
  checkContainer?: any;
  isViewDescription?: boolean;
}

const GTCheckBox: FC<GTCheckBoxProps> = ({
  data,
  onPressHandle,
  container,
  checkContainer,
  isViewDescription,
}) => {
  return (
    <View
      // activeOpacity={0.9}
      style={{
        ...styles.itemContainer,
        ...container,
        alignItems:
          isViewDescription && data?.description ? 'flex-start' : 'center',
      }}>
      <GTButtonContainer
        onHandlePress={onPressHandle}
        customStyle={{
          ...styles.checkContainer,
          backgroundColor: data?.isSelected
            ? CONSTANTS.THEME.colors.PRIMARY_COLOR
            : CONSTANTS.THEME.colors.WHITE_COLOR,

          shadowColor: data?.isSelected
            ? CONSTANTS.THEME.colors.PRIMARY_COLOR
            : CONSTANTS.THEME.colors.BLACK,
          borderColor: data?.isSelected
            ? CONSTANTS.THEME.colors.PRIMARY_COLOR
            : CONSTANTS.THEME.colors.GRAY_COLOR,
          ...checkContainer,
        }}>
        {data?.isSelected && (
          <Active_Check_Icon
            height={CONSTANTS.THEME.size.s12}
            width={CONSTANTS.THEME.size.s12}
          />
        )}
      </GTButtonContainer>
      <View
        style={{paddingHorizontal: 5, width: CONSTANTS.THEME.size.WIDTH * 0.6}}>
        <GTLabel
          text={data?.name}
          fontSize={CONSTANTS.THEME.size.s14}
          fontWeight={data?.isSelected ? '600' : '400'}
          color={CONSTANTS.THEME.colors.Light_Primary_Gunmetal}
          customStyle={{
            marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.01,
            lineHeight: CONSTANTS.THEME.size.s22,
          }}
        />
        {isViewDescription && data?.description && (
          <GTLabel
            text={data?.description}
            fontSize={CONSTANTS.THEME.size.s12}
            fontWeight="400"
            color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
            customStyle={{
              marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.01,
              lineHeight: CONSTANTS.THEME.size.s18,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default GTCheckBox;
