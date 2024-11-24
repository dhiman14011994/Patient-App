import {View, Text} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import GTLabel from '../GTLabel';
import CONSTANTS from '../../utils/constants';

const GTORView = () => {
  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={['rgba(225, 230, 239, 0)', 'rgba(225, 230, 239, 1)']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.lineContainer}
      />
      <GTLabel
        text={CONSTANTS.TEXT.OR}
        fontSize={CONSTANTS.THEME.size.s12}
        fontWeight="600"
        color={CONSTANTS.THEME.colors.Light_Primary_Gunmetal}
      />

      <LinearGradient
        colors={['rgba(225, 230, 239, 1)', 'rgba(225, 230, 239, 0)']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.lineContainer}
      />
    </View>
  );
};

export default GTORView;
