import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: CONSTANTS.THEME.size.WIDTH,
  },
  constainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: '1%',
  },
  mainContainer: {
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
    width: CONSTANTS.THEME.size.WIDTH * 0.9,
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.05,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    padding: CONSTANTS.THEME.size.s20,
    borderRadius: CONSTANTS.THEME.size.s10,
    alignItems: 'center',
  },
  closeContainer: {
    width: CONSTANTS.THEME.size.s50,
    height: CONSTANTS.THEME.size.s50,
    borderRadius: CONSTANTS.THEME.size.s50,
    backgroundColor: CONSTANTS.THEME.colors.Dark_Gunmetal,
    marginTop: CONSTANTS.THEME.size.s10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    height: CONSTANTS.THEME.size.s44,
    borderRadius: CONSTANTS.THEME.size.s14,
    padding: CONSTANTS.THEME.size.s12,
    width: CONSTANTS.THEME.size.WIDTH * 0.84,
    borderWidth: 1,
    borderColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
    marginVertical: CONSTANTS.THEME.size.WIDTH * 0.05,
  },

  firstUserImageStyle: {
    width: CONSTANTS.THEME.size.WIDTH * 0.2,
    height: CONSTANTS.THEME.size.WIDTH * 0.2,
    borderRadius: CONSTANTS.THEME.size.WIDTH * 0.2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: CONSTANTS.THEME.colors.WHITE_COLOR,
  },
  secondUserImageStyle: {
    width: CONSTANTS.THEME.size.WIDTH * 0.2,
    height: CONSTANTS.THEME.size.WIDTH * 0.2,
    borderRadius: CONSTANTS.THEME.size.WIDTH * 0.2,
    overflow: 'hidden',
    marginLeft: -20,
    borderWidth: 2,
    borderColor: CONSTANTS.THEME.colors.WHITE_COLOR,
  },
  imageCotainerView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: CONSTANTS.THEME.size.WIDTH * 0.05,
  },
});

export default styles;
