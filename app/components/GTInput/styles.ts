import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  textStyle: {
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
    paddingVertical: CONSTANTS.THEME.size.WIDTH * 0.01,
  },
  inputContainer: {
    marginVertical: CONSTANTS.THEME.size.WIDTH * 0.0001,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: CONSTANTS.THEME.size.s8,
    borderWidth: 1,
    borderColor: CONSTANTS.THEME.colors.LIGHT_WHITE,
  },
  inputStyle: {
    borderRadius: CONSTANTS.THEME.size.s8,
    paddingHorizontal: CONSTANTS.THEME.size.s8,
    height: CONSTANTS.THEME.size.s50,
    color: CONSTANTS.THEME.colors.Dark_Gunmetal,
  },
  actionIcon: {
    marginHorizontal: CONSTANTS.THEME.size.s10,
    height: CONSTANTS.THEME.size.s20,
    width: CONSTANTS.THEME.size.s20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorStyle: {
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.01,
    paddingHorizontal: CONSTANTS.THEME.size.s16,
    color: CONSTANTS.THEME.colors.RED,
    letterSpacing: 1,
    paddingVertical: CONSTANTS.THEME.size.HEIGHT * 0.002,
  },
  errorView: {
    flexDirection: 'row',
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
    alignItems: 'center',
    marginTop: '2%',
  },
});
export default styles;
