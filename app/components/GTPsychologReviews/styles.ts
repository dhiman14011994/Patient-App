import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';
import {fontResize} from '../../utils/fontResize';

const styles = StyleSheet.create({
  container: {
    width: CONSTANTS.THEME.size.WIDTH * 0.94,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    padding: CONSTANTS.THEME.size.WIDTH * 0.03,
    borderWidth: 1,
    borderRadius: CONSTANTS.THEME.size.s12,
    borderColor: CONSTANTS.THEME.colors.NEUTRAL[300],
    marginBottom: CONSTANTS.THEME.size.s12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  imageStyle: {
    borderRadius: CONSTANTS.THEME.size.WIDTH * 0.1,
    overflow: 'hidden',
  },
});
export default styles;
