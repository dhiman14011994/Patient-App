import {StyleSheet} from 'react-native';
import CONSTANTS from '../../../utils/constants';

const styles = StyleSheet.create({
  container: {
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
  imageContainer: {
    width: CONSTANTS.THEME.size.WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: CONSTANTS.THEME.size.HEIGHT * 0.05,
  },
  imageStyle: {
    width: CONSTANTS.THEME.size.WIDTH * 0.2,
    height: CONSTANTS.THEME.size.WIDTH * 0.2,
    borderRadius: CONSTANTS.THEME.size.WIDTH * 0.2,
    overflow: 'hidden',
  },
  imageViewStyle: {
    width: CONSTANTS.THEME.size.WIDTH * 0.2,
    height: CONSTANTS.THEME.size.WIDTH * 0.2,
    borderRadius: CONSTANTS.THEME.size.WIDTH * 0.2,
    // overflow: 'hidden',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 5,
  },
  inputFormContainer: {
    height: CONSTANTS.THEME.size.HEIGHT * 0.68,
    marginTop: CONSTANTS.THEME.size.HEIGHT * 0.02,
  },
  inputStyle: {
    height: CONSTANTS.THEME.size.s50,
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
  continueButton: {
    borderRadius: CONSTANTS.THEME.size.s14,
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
    width: CONSTANTS.THEME.size.WIDTH * 0.94,
  },
});

export default styles;
