import {View, Text, ImageBackground} from 'react-native';
import React, {FC} from 'react';
import {Home_Banner} from '../../assets';
import styles from './styles';
import GTLabel from '../GTLabel';
import GTButtonContainer from '../GTButtonContainer';
import GTButton from '../GTButton';
import CONSTANTS from '../../utils/constants';

interface GTHomeBannerProps {
  uri?: string;
  container?: any;
  title?: string;
  description?: string;
  onHandlePress?: any;
}

const GTHomeBanner: FC<GTHomeBannerProps> = ({
  uri,
  container,
  title = 'Psychology Services',
  description = 'Psychology Services to individuals, couples, and families.',
  onHandlePress,
}) => {
  return (
    <ImageBackground
      source={uri ? {uri: uri} : Home_Banner}
      resizeMode="cover"
      style={{...container, ...styles.container}}>
      <View style={styles.subContainer}>
        <GTLabel
          text={title}
          fontSize={CONSTANTS.THEME.size.s16}
          fontWeight="800"
          color={'white' || CONSTANTS.THEME.colors.PRIMARY_COLOR}
          customStyle={{
            textTransform: 'uppercase',
            lineHeight: CONSTANTS.THEME.size.s20,
          }}
        />
        <GTLabel
          text={description}
          fontSize={CONSTANTS.THEME.size.s14}
          fontWeight="400"
          customStyle={{
            lineHeight: CONSTANTS.THEME.size.s18,
            marginVertical: CONSTANTS.THEME.size.s4,
          }}
          color={'#E1E6EF' || CONSTANTS.THEME.colors.Dark_Gunmetal}
        />
        <GTButton
          customStyle={{...styles.buttonStyle}}
          text={CONSTANTS.TEXT.BOOK_NOW}
          color={CONSTANTS.THEME.colors.WHITE_COLOR}
          fontSize={CONSTANTS.THEME.size.s14}
          fontFamily={CONSTANTS.THEME.typography.fontFamily.Regular}
          fontWeight={'400'}
          onHandlePress={() => {
            console.log('Book Now is pressed!');
            onHandlePress();
          }}
        />
      </View>
    </ImageBackground>
  );
};

export default GTHomeBanner;
