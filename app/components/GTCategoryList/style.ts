import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

const style = StyleSheet.create({
  mainContainer: {
    width: CONSTANTS.THEME.size.WIDTH,
    marginTop: CONSTANTS.THEME.size.HEIGHT * 0.02,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    padding: CONSTANTS.THEME.size.WIDTH * 0.05,
  },
  listContainer: {
    // padding: CONSTANTS.THEME.size.WIDTH * 0.05,
    width: CONSTANTS.THEME.size.WIDTH * 0.92,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 0,
  },
  imageStyle: {
    width: CONSTANTS.THEME.size.WIDTH * 0.06,
    height: CONSTANTS.THEME.size.WIDTH * 0.06,
    overflow: 'hidden',
  },
  headerStyle: {
    marginBottom: CONSTANTS.THEME.size.HEIGHT * 0.02,
  },
  itemContainer: {
    // width: CONSTANTS.THEME.size.WIDTH * 0.25,
  },
});

export default style;
