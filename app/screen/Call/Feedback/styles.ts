import {StyleSheet} from 'react-native';
import CONSTANTS from '../../../utils/constants';
import {fontResize} from '../../../utils/fontResize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
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
  inputStyle: {
    height: CONSTANTS.THEME.size.s50,
  },
  inputViewStyle: {
    width: '100%',
    minHeight: CONSTANTS.THEME.size.BUTTON_HEIGHT,
    fontSize: CONSTANTS.THEME.size.s14,
    color: CONSTANTS.THEME.colors.SECONDARY_COLOR[80],
    padding: '3%',
  },
  inputContainer: {
    width: CONSTANTS.THEME.size.WIDTH * 0.94,
    height: fontResize(120),
    borderWidth: 1,
    borderRadius: CONSTANTS.THEME.size.s20,
    borderColor: CONSTANTS.THEME.colors.NEUTRAL[300],
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,

    marginTop: CONSTANTS.THEME.size.s6,
  },
  rattingContainer: {
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
    marginTop: '2%',
  },
  subContainer: {
    marginTop: '3%',
    height: CONSTANTS.THEME.size.HEIGHT * 0.8,
  },
  bottomContainer: {
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: CONSTANTS.THEME.colors.NEUTRAL[300],
  },
  continueButton: {
    borderRadius: CONSTANTS.THEME.size.s14,
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
    width: CONSTANTS.THEME.size.WIDTH * 0.94,
  },
});

export default styles;
