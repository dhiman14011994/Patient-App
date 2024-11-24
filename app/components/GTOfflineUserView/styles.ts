import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

const styles = StyleSheet.create({
  container: {
    width: CONSTANTS.THEME.size.WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CONSTANTS.THEME.colors.TRANSPARENT,
    paddingVertical: CONSTANTS.THEME.size.WIDTH * 0.02,
    position: 'absolute',
    bottom: 25,
  },
  subContainer: {
    width: CONSTANTS.THEME.size.WIDTH * 0.9,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CONSTANTS.THEME.colors.DARK_ORANGE,
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.05,
    borderRadius: CONSTANTS.THEME.size.WIDTH * 0.05,
    borderWidth: 1,
    borderColor: CONSTANTS.THEME.colors.ORANGE,
    shadowRadius: 2,
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowColor: 'rgba(17, 17, 26, 0.1)',
    shadowOpacity: 0.1,
    elevation: 4,
    paddingVertical: CONSTANTS.THEME.size.s10,
    flexDirection: 'row',
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.02,
  },
  imageStyle: {
    width: CONSTANTS.THEME.size.WIDTH * 0.15,
    height: CONSTANTS.THEME.size.WIDTH * 0.15,
    borderRadius: CONSTANTS.THEME.size.WIDTH * 0.1,
    overflow: 'hidden',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userContainer: {
    marginLeft: CONSTANTS.THEME.size.s10,
  },
  userSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameUserStyle: {
    maxWidth: CONSTANTS.THEME.size.WIDTH * 0.3,
    marginRight: CONSTANTS.THEME.size.s8,
  },
  lineStyle: {
    width: 1,
    height: CONSTANTS.THEME.size.s14,
    backgroundColor: 'rgba(29, 36, 51, 0.2)',
  },
  chatContainer: {
    flexDirection: 'row',
    paddingHorizontal: CONSTANTS.THEME.size.s8,
    alignItems: 'center',
  },
  offlineTextName: {
    maxWidth: CONSTANTS.THEME.size.WIDTH * 0.55,
    lineHeight: CONSTANTS.THEME.size.s18,
  },
});

export default styles;
