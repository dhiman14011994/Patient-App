import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

const styles = StyleSheet.create({
  constainer: {
    width: CONSTANTS.THEME.size.WIDTH * 0.8,
    marginRight: CONSTANTS.THEME.size.WIDTH * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    height: CONSTANTS.THEME.size.WIDTH * 0.6,
    borderRadius: CONSTANTS.THEME.size.WIDTH * 0.1,
  },
});

export default styles;
