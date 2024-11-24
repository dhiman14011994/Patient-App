import {StyleSheet} from 'react-native';
import CONSTANTS from '../../utils/constants';

const styles = StyleSheet.create({
  constainer: {
    width: CONSTANTS.THEME.size.WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '5%',
    marginTop: '2%',
    backgroundColor: CONSTANTS.THEME.colors.BackgroundColor,
  },
});

export default styles;
