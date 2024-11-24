import {View, Text} from 'react-native';
import React, {FC} from 'react';
import GTButtonContainer from '../GTButtonContainer';
import GTLabel from '../GTLabel';
import CONSTANTS from '../../utils/constants';
import styles from './styles';

interface GTRadioButtonProps {
  label?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: any;
  color?: string;
  isVisable?: boolean;
  onHandlePress?: () => void;
}

const GTRadioButton: FC<GTRadioButtonProps> = ({
  label,
  fontSize = CONSTANTS.THEME.size.s14,
  fontWeight = '400',
  color = CONSTANTS.THEME.colors.DARK_GRAY_COLOR,
  isVisable,
  onHandlePress,
}) => {
  return (
    <View style={styles.container}>
      <GTButtonContainer
        onHandlePress={onHandlePress}
        customStyle={{
          ...styles.mainContainer,
          borderColor: isVisable
            ? CONSTANTS.THEME.colors.PRIMARY_COLOR
            : CONSTANTS.THEME.colors.NEUTRAL['300'],
          backgroundColor: isVisable
            ? CONSTANTS.THEME.colors.PRIMARY_COLOR
            : CONSTANTS.THEME.colors.WHITE_COLOR,
        }}>
        {isVisable && <View style={styles.subContainer} />}
      </GTButtonContainer>
      <GTLabel
        text={label}
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color}
      />
    </View>
  );
};

export default GTRadioButton;
