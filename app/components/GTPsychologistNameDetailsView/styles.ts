import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';
import {fontResize} from '../../utils/fontResize';

const styles = StyleSheet.create({
  container: {
    width: CONSTANTS.THEME.size.WIDTH,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subContainer: {
    height: CONSTANTS.THEME.size.s12,
    width: CONSTANTS.THEME.size.s12,
    borderRadius: CONSTANTS.THEME.size.s12,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
  },
  languageContainer: {
    borderWidth: 1,
    borderColor: 'rgba(47, 111, 237, 0.1)',
    borderStyle: 'dotted',
    borderRadius: CONSTANTS.THEME.size.s12,
    paddingHorizontal: CONSTANTS.THEME.size.s8,
    paddingVertical: CONSTANTS.THEME.size.s4,
    backgroundColor: CONSTANTS.THEME.colors.NEUTRAL[100],
  },
  desContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginVertical: CONSTANTS.THEME.size.s6,
  },
  lineContainer: {
    flexDirection: 'row',
    marginVertical: CONSTANTS.THEME.size.s10,
  },
  messageCallContainer: {
    flexDirection: 'row',
    width: CONSTANTS.THEME.size.WIDTH * 0.47,
    justifyContent: 'center',
  },
});
export default styles;
