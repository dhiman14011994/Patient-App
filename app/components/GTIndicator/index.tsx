import {View, ActivityIndicator} from 'react-native';
import React, {FC} from 'react';
import CONSTANTS from '../../utils/constants';
import style from './style';

const GTIndicator: FC = () => {
  return (
    <View style={style.mainContainer}>
      <ActivityIndicator
        size={'large'}
        color={CONSTANTS.THEME.colors.PRIMARY_COLOR}
      />
    </View>
  );
};

export default GTIndicator;
