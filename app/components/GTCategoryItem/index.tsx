import {
  TextStyle,
  ViewStyle,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import React, {FC, memo} from 'react';
import CONSTANTS from '../../utils/constants';
import GTLabel from '../GTLabel';
import {ALL_ICON, AvatarIcon, Finance_Icon} from '../../assets';

interface GTCategoryItemProps {
  uri?: any;
  imageItemStyle?: any;
  resizeMode?: any;
  text?: string;
  fontSize?: any;
  textColor?: string;
  textStyle?: TextStyle;
  container?: ViewStyle;
  onPress?: () => void;
  isView?: boolean;
  extra?: any;
}

const GTCategoryItem: FC<GTCategoryItemProps> = ({
  uri,
  imageItemStyle,
  resizeMode,
  text,
  fontSize,
  textColor = CONSTANTS.THEME.colors.Dark_Gunmetal,
  textStyle,
  container,
  onPress,
  isView,
  extra,
}) => {
  return (
    <TouchableOpacity
      style={[
        container,
        {
          flexDirection: 'column',
          borderWidth: 0,
          // backgroundColor: 'pink',
          height: 120,
          justifyContent: uri ? 'space-between' : 'center',
          overflow: 'hidden',
        },
        extra,
      ]}
      onPress={onPress}>
      {uri && (
        <View
          style={{
            borderWidth: 0,
            borderRadius: 50,
            overflow: 'hidden',
            width: 50,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {uri ? (
            <Image
              source={{uri: uri}}
              style={[
                {
                  height: CONSTANTS.THEME.size.WIDTH * 0.1,
                  width: CONSTANTS.THEME.size.WIDTH * 0.1,
                  ...imageItemStyle,
                },
                {
                  width: 50,
                  height: 50,
                },
              ]}
              resizeMode={'stretch'}
            />
          ) : (
            <View />
          )}
        </View>
      )}
      <View
        style={{
          height: 45,
          // padding: 5,
          width: '100%',
          justifyContent: uri ? 'flex-start' : 'center',
        }}>
        <GTLabel
          text={`${text}`}
          color={textColor}
          fontSize={fontSize}
          textAlign="center"
          customStyle={{
            ...textStyle,
            marginLeft: textColor.length > 8 ? 5 : 10,
            // maxWidth: isView ? '100%' : '68%',
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default memo(GTCategoryItem);
