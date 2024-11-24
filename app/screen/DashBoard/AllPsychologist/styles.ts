import {Platform, StyleSheet} from 'react-native';
import CONSTANTS from '../../../utils/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    height: CONSTANTS.THEME.size.HEIGHT,
  },
  headerContainer: {
    backgroundColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
  },
  trandingContainer: {
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.05,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    paddingTop: CONSTANTS.THEME.size.s20,
  },
  imageStyle: {
    borderRadius: CONSTANTS.THEME.size.WIDTH * 0.15,
    overflow: 'hidden',
    height: CONSTANTS.THEME.size.WIDTH * 0.15,
    width: CONSTANTS.THEME.size.WIDTH * 0.15,
  },
});
export default styles;
