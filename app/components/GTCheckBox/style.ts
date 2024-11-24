import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

export const styles = StyleSheet.create({
  checkContainer: {
    width: CONSTANTS.THEME.size.s20,
    height: CONSTANTS.THEME.size.s20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.01,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,

    elevation: 1,
  },
  itemContainer: {
    marginVertical: CONSTANTS.THEME.size.WIDTH * 0.01,
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
});
