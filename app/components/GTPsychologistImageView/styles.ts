import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: CONSTANTS.THEME.size.WIDTH * 0.03,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
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
    width: CONSTANTS.THEME.size.WIDTH * 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageStyle: {
    width: CONSTANTS.THEME.size.WIDTH * 0.15,
    height: CONSTANTS.THEME.size.WIDTH * 0.15,
    borderRadius: CONSTANTS.THEME.size.WIDTH * 0.15,
    overflow: 'hidden',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default styles;
