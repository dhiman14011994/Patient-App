import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CONSTANTS.THEME.size.s16,
    paddingVertical: CONSTANTS.THEME.size.s8,
    width: CONSTANTS.THEME.size.WIDTH * 0.94,
    borderWidth: 1,
    borderRadius: CONSTANTS.THEME.size.s12,
    marginBottom: CONSTANTS.THEME.size.s6,
  },
  selectedView: {
    width: CONSTANTS.THEME.size.s22,
    height: CONSTANTS.THEME.size.s22,
    borderRadius: CONSTANTS.THEME.size.s22,
    backgroundColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unSelectedView: {
    width: CONSTANTS.THEME.size.s22,
    height: CONSTANTS.THEME.size.s22,
    borderRadius: CONSTANTS.THEME.size.s22,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    borderWidth: 1,
    borderColor: CONSTANTS.THEME.colors.GRAY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
