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
    maxHeight: CONSTANTS.THEME.size.HEIGHT * 0.8,
  },
  subContainer: {
    alignItems: 'center',
    width: CONSTANTS.THEME.size.WIDTH,
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
    padding: CONSTANTS.THEME.size.s20,
  },
  closeContainer: {
    width: CONSTANTS.THEME.size.WIDTH * 0.12,
    height: CONSTANTS.THEME.size.WIDTH * 0.12,
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.44,
    borderRadius: CONSTANTS.THEME.size.s50,
    backgroundColor: CONSTANTS.THEME.colors.Dark_Gunmetal,
    marginBottom: CONSTANTS.THEME.size.s10,
    marginTop: CONSTANTS.THEME.size.WIDTH * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    height: CONSTANTS.THEME.size.s48,
    borderRadius: CONSTANTS.THEME.size.s14,
    padding: CONSTANTS.THEME.size.s12,
    marginTop: CONSTANTS.THEME.size.s20,
    marginBottom: CONSTANTS.THEME.size.s10,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: CONSTANTS.THEME.colors.Light_Gray,
    width: '100%',
    marginLeft: 0,
    fontSize: CONSTANTS.THEME.size.s16,
    fontWeight: '800',
  },
});

export default styles;
