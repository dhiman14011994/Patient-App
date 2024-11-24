import {Platform, StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
  },
  headerContainer: {
    backgroundColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
  },
  categoriesStyle: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: CONSTANTS.THEME.size.s16,
  },
  itemContainer: {
    padding: CONSTANTS.THEME.size.WIDTH * 0.02,
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    marginRight: CONSTANTS.THEME.size.WIDTH * 0.03,
  },
  imageStyle: {
    width: CONSTANTS.THEME.size.s16,
    height: CONSTANTS.THEME.size.s16,
    overflow: 'hidden',
  },
  trandingContainer: {
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.05,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    // marginTop: CONSTANTS.THEME.size.s20,
    // height: CONSTANTS.THEME.size.HEIGHT * 0.5,
  },
  bannerView: {
    width: CONSTANTS.THEME.size.WIDTH,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    marginTop: 15,
  },
  imagesStyle: {
    borderRadius: CONSTANTS.THEME.size.WIDTH * 0.15,
    overflow: 'hidden',
    height: CONSTANTS.THEME.size.WIDTH * 0.15,
    width: CONSTANTS.THEME.size.WIDTH * 0.15,
  },
  pageContainer: {
    bottom: '8%',
    position: 'absolute',
    width: '100%',
  },
  bannerMainContainer: {
    width: CONSTANTS.THEME.size.WIDTH,
    height: CONSTANTS.THEME.size.HEIGHT * 0.25,
  },
  buyNowButton: {
    position: 'absolute',
    bottom: CONSTANTS.THEME.size.s20,
    left: CONSTANTS.THEME.size.s20,
    paddingHorizontal: CONSTANTS.THEME.size.s10,
    paddingVertical: CONSTANTS.THEME.size.s6,
    borderRadius: CONSTANTS.THEME.size.s6,
    backgroundColor: CONSTANTS.THEME.colors.ORANGE,
  },
});

export default styles;
