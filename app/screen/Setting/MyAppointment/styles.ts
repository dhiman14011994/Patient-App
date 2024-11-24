import {StyleSheet} from 'react-native';
import CONSTANTS from '../../../utils/constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
    paddingBottom: CONSTANTS.THEME.size.WIDTH * 0.05,
    marginTop: CONSTANTS.THEME.size.s20,
  },
  headerContainer: {
    backgroundColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
  },
  bottonContainer: {
    height: CONSTANTS.THEME.size.WIDTH * 0.3,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
  },
  renderContainer: {
    marginBottom: CONSTANTS.THEME.size.WIDTH * 0.03,
  },
});

export default styles;
