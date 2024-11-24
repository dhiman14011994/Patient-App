import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

const style = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CONSTANTS.THEME.size.WIDTH * 0.9,
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.05,
    marginTop: CONSTANTS.THEME.size.HEIGHT * 0.05,
  },
  animatedView: {
    borderRadius: 10,
  },
});

export default style;
