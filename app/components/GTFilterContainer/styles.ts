import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: CONSTANTS.THEME.size.WIDTH,
  },
  mainContainer: {
    width: CONSTANTS.THEME.size.WIDTH,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    borderTopLeftRadius: CONSTANTS.THEME.size.s10,
    borderTopRightRadius: CONSTANTS.THEME.size.s10,
    alignItems: 'center',
    height: CONSTANTS.THEME.size.HEIGHT * 0.7,
  },
  closeContainer: {
    width: CONSTANTS.THEME.size.s50,
    height: CONSTANTS.THEME.size.s50,
    borderRadius: CONSTANTS.THEME.size.s50,
    backgroundColor: CONSTANTS.THEME.colors.Dark_Gunmetal,
    marginBottom: CONSTANTS.THEME.size.s10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    height: CONSTANTS.THEME.size.s48,
    borderRadius: CONSTANTS.THEME.size.s14,
    // padding: CONSTANTS.THEME.size.s12,
  },
  bottomContainer: {
    width: CONSTANTS.THEME.size.WIDTH,
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.05,
    height: CONSTANTS.THEME.size.HEIGHT * 0.1,
    borderTopWidth: 1,
    borderTopColor: CONSTANTS.THEME.colors.NEUTRAL[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    width: CONSTANTS.THEME.size.WIDTH,
    height: CONSTANTS.THEME.size.HEIGHT * 0.1,
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: CONSTANTS.THEME.size.s12,
    borderTopRightRadius: CONSTANTS.THEME.size.s12,
    borderBottomWidth: 1,
    borderBottomColor: CONSTANTS.THEME.colors.NEUTRAL[300],
  },
  subContainer: {
    height: CONSTANTS.THEME.size.HEIGHT * 0.5,
    width: CONSTANTS.THEME.size.WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelContainer: {
    width: CONSTANTS.THEME.size.WIDTH * 0.25,
    height: CONSTANTS.THEME.size.HEIGHT * 0.5,
    backgroundColor: CONSTANTS.THEME.colors.NEUTRAL[100],
  },
  labelValueContainer: {
    width: CONSTANTS.THEME.size.WIDTH * 0.75,
    height: CONSTANTS.THEME.size.HEIGHT * 0.5,
  },
  footer: {
    height: CONSTANTS.THEME.size.HEIGHT * 0.1,
  },
});

export default styles;
