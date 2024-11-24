import {Platform, StyleSheet} from 'react-native';
import CONSTANTS from '../../../utils/constants';
CONSTANTS;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONSTANTS.THEME.colors.BackgroundColor,
  },
  yourText: {
    marginTop: '15%',
    marginBottom: '2%',
  },
  makeSureText: {
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.07,
    lineHeight: CONSTANTS.THEME.size.s18,
    marginTop: '25%',
  },
  continueButton: {
    borderRadius: CONSTANTS.THEME.size.s14,
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
    width: CONSTANTS.THEME.size.WIDTH * 0.94,
    marginTop: '5%',
  },
  inputContainer: {
    marginTop: '10%',
    paddingVertical: '2%',
  },
  errorView: {
    flexDirection: 'row',
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
    alignItems: 'center',
    marginTop: '2%',
  },
});

export default styles;
