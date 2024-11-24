import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

const styles = StyleSheet.create({
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: CONSTANTS.THEME.size.WIDTH * 0.8,
    marginTop: CONSTANTS.THEME.size.s6,
  },
  container: {
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
  },
});
export default styles;
