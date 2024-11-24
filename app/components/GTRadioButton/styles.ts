import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: CONSTANTS.THEME.size.s32,
    width: CONSTANTS.THEME.size.s32,
    borderRadius: CONSTANTS.THEME.size.s32,
    borderWidth: 1,

    marginRight: CONSTANTS.THEME.size.s8,
  },
  subContainer: {
    height: CONSTANTS.THEME.size.s12,
    width: CONSTANTS.THEME.size.s12,
    borderRadius: CONSTANTS.THEME.size.s12,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
  },
});
export default styles;
