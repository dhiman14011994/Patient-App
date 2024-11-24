import {View, Text} from 'react-native';
import React, {FC} from 'react';
import GTLabel from '../GTLabel';
import CONSTANTS from '../../utils/constants';
import GTRadioButton from '../GTRadioButton';
import styles from './styles';

interface GTGenderviewProps {
  labelOne?: string;
  labelTwo?: string;
  labelThree?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: any;
  color?: string;
  isVisable?: boolean;
  onHandlePress?: () => void;
  onPress?: any;
  selectedValue?: string;
}

const GTGenderview: FC<GTGenderviewProps> = ({
  labelOne,
  labelTwo,
  labelThree,
  onPress,
  selectedValue,
}) => {
  return (
    <View style={styles.container}>
      <GTLabel
        text={CONSTANTS.TEXT.GENDER}
        color={CONSTANTS.THEME.colors.Dark_Gunmetal}
        fontWeight="600"
        fontSize={CONSTANTS.THEME.size.s14}
      />
      <View style={styles.containerItem}>
        <GTRadioButton
          label={labelOne}
          onHandlePress={() => onPress(labelOne)}
          isVisable={
            selectedValue?.toLocaleLowerCase() === labelOne?.toLocaleLowerCase()
          }
        />
        <GTRadioButton
          label={labelTwo}
          onHandlePress={() => onPress(labelTwo)}
          isVisable={
            selectedValue?.toLocaleLowerCase() == labelTwo?.toLocaleLowerCase()
          }
        />
        <GTRadioButton
          label={labelThree}
          onHandlePress={() => onPress(labelThree)}
          isVisable={
            selectedValue?.toLocaleLowerCase() ==
            labelThree?.toLocaleLowerCase()
          }
        />
      </View>
    </View>
  );
};

export default GTGenderview;
