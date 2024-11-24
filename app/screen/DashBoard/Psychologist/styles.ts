import {Platform, StyleSheet} from 'react-native';
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
  bottomContainer: {
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    shadowRadius: 2,
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    elevation: 4,
    borderColor: CONSTANTS.THEME.colors.NEUTRAL[300],
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    width: CONSTANTS.THEME.size.WIDTH,
    paddingVertical: CONSTANTS.THEME.size.s10,
  },
  subContainer: {
    width: CONSTANTS.THEME.size.WIDTH,
  },
  chatButtonStyle: {
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    borderRadius: CONSTANTS.THEME.size.s14,
    paddingVertical: CONSTANTS.THEME.size.s10,
    paddingHorizontal: CONSTANTS.THEME.size.s20,
    borderColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
    borderWidth: 1,
    width: CONSTANTS.THEME.size.WIDTH * 0.4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: CONSTANTS.THEME.size.BUTTON_HEIGHT,
  },
  callButtonStyle: {
    borderRadius: CONSTANTS.THEME.size.s10,
    paddingVertical: CONSTANTS.THEME.size.s10,
    paddingHorizontal: CONSTANTS.THEME.size.s20,
    borderWidth: 1,
    width: CONSTANTS.THEME.size.WIDTH * 0.4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: CONSTANTS.THEME.size.BUTTON_HEIGHT,
  },
  leftStyle: {
    marginLeft: CONSTANTS.THEME.size.s10,
  },
  bottonContainer: {
    height: CONSTANTS.THEME.size.WIDTH * 0.3,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
  },
  imageStyle: {
    borderRadius: CONSTANTS.THEME.size.WIDTH * 0.15,
    overflow: 'hidden',
    height: CONSTANTS.THEME.size.WIDTH * 0.15,
    width: CONSTANTS.THEME.size.WIDTH * 0.15,
  },
  offlineText: {
    position: 'absolute',
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 2,
    bottom: -9,
  },
});

export default styles;
