import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

const styles = StyleSheet.create({
  mainContainer: {
    width: CONSTANTS.THEME.size.WIDTH,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    padding: CONSTANTS.THEME.size.WIDTH * 0.03,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  subContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  mediaContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  nameContainer: {
    marginLeft: CONSTANTS.THEME.size.s10,
    justifyContent: 'space-between',
  },
  textStyle: {
    paddingHorizontal: CONSTANTS.THEME.size.s2,
  },
  unreadView: {
    backgroundColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
    borderRadius: CONSTANTS.THEME.size.s20,
    alignItems: 'center',
    justifyContent: 'center',
    width: CONSTANTS.THEME.size.s30,
    height: CONSTANTS.THEME.size.s24,
    alignSelf: 'flex-end',
    marginVertical: CONSTANTS.THEME.size.s4,
  },
  messageTextStyle: {
    width: CONSTANTS.THEME.size.WIDTH * 0.5,
  },
  timeView: {
    width: CONSTANTS.THEME.size.WIDTH * 0.2,
  },
  WaitTimeView: {
    width: CONSTANTS.THEME.size.WIDTH * 0.3,
  },
});
export default styles;
