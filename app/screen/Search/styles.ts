import {Platform, StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    height: CONSTANTS.THEME.size.HEIGHT,
  },
  headerContainer: {
    backgroundColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
  },
  enterCodeText: {
    marginVertical: '2%',
    paddingHorizontal: '5%',
  },
  continueButton: {
    borderRadius: CONSTANTS.THEME.size.s14,
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
    width: CONSTANTS.THEME.size.WIDTH * 0.94,
  },
  buttonStyle: {
    marginTop: '20%',
  },
  inputStyle: {
    height: CONSTANTS.THEME.size.s50,
  },
  inputFormContainer: {
    height: CONSTANTS.THEME.size.HEIGHT * 0.7,
  },
  bottomContainer: {
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: CONSTANTS.THEME.colors.NEUTRAL[300],
  },
  confirmContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    width: CONSTANTS.THEME.size.WIDTH * 0.3,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calenderContainer: {
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
    width: CONSTANTS.THEME.size.WIDTH * 0.94,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    padding: CONSTANTS.THEME.size.s20,
    borderRadius: CONSTANTS.THEME.size.s10,
  },
  dotContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CONSTANTS.THEME.size.WIDTH * 0.26,
    marginTop: CONSTANTS.THEME.size.HEIGHT * 0.05,
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.37,
    position: 'absolute',
    bottom: 20,
  },
  bannerView: {
    width: CONSTANTS.THEME.size.WIDTH,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    // borderRadius: CONSTANTS.THEME.size.WIDTH * 0.08,
  },
  itemContainer: {
    width: CONSTANTS.THEME.size.WIDTH * 0.28,

    paddingVertical: CONSTANTS.THEME.size.WIDTH * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: CONSTANTS.THEME.size.HEIGHT * 0.03,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: CONSTANTS.THEME.colors.NEUTRAL[300],
  },
  trandingContainer: {
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.05,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
  },
  blogContainer: {
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    paddingVertical: CONSTANTS.THEME.size.s20,
  },
  imageStyle: {
    borderRadius: CONSTANTS.THEME.size.WIDTH * 0.15,
    overflow: 'hidden',
    height: CONSTANTS.THEME.size.WIDTH * 0.15,
    width: CONSTANTS.THEME.size.WIDTH * 0.15,
  },
});

export default styles;
