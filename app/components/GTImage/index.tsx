import React, {FC} from 'react';
import style from './style';
// import FastImage from 'react-native-fast-image';
import {AvatarIcon} from '../../assets';
import {Image, View} from 'react-native';

interface GTImageProps {
  uri?: any;
  imageStyle?: any;
  resizeMode?: any;
}

const GTImage: FC<GTImageProps> = ({uri, imageStyle, resizeMode}) => {
  return (
    <View style={[style.container, imageStyle]}>
      {/* <FastImage
        style={style.imageStyle}
        source={
          uri
            ? {
                uri: uri,
                priority: FastImage.priority.high,
              }
            : AvatarIcon
        }
        resizeMode={resizeMode ? resizeMode : FastImage.resizeMode.cover}
      /> */}
      <Image
        style={style.imageStyle}
        source={
          uri
            ? {
                uri: uri,
              }
            : AvatarIcon
        }
        resizeMode={resizeMode ? resizeMode : 'cover'}
      />
    </View>
  );
};

export default GTImage;
