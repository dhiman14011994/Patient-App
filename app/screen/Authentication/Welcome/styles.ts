import {Platform, StyleSheet} from 'react-native';
import CONSTANTS from '../../../utils/constants';
CONSTANTS;

const styles = StyleSheet.create({
  welcomeContainer: {
    flexDirection: 'row',
    marginVertical: '1%',
  },
  constainer: {
    marginTop: '5%',
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.05,
    width: CONSTANTS.THEME.size.WIDTH * 0.9,
  },
  buttonStyle: {
    borderRadius: CONSTANTS.THEME.size.s14,
    marginTop: CONSTANTS.THEME.size.s18,
  },
  socialContainer: {
    flexDirection: Platform.OS == 'ios' ? 'row' : 'column',
    justifyContent: Platform.OS == 'ios' ? 'space-between' : 'center',
    alignItems: 'center',
    width: CONSTANTS.THEME.size.WIDTH * 0.4,
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.25,
    marginBottom: '5%',
  },
  imageStyle: {
    width: CONSTANTS.THEME.size.WIDTH,
    height: CONSTANTS.THEME.size.HEIGHT * 0.4,
  },
});

export default styles;
