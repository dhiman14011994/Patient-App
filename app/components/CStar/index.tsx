import {View, Text, TouchableOpacity, ViewStyle} from 'react-native';
import React, {FC} from 'react';
import {StarIcon, UnStarIcon} from '../../assets';
import CONSTANTS from '../../utils/constants';

interface CStarProps {
  ratting?: any;
  disabled?: boolean;
  size?: any;
  onPress?: any;
  starStyle?: ViewStyle;
  container?: ViewStyle;
}

const CStar: FC<CStarProps> = ({
  size = CONSTANTS.THEME.size.s24,
  ratting = 5,
  disabled = false,
  onPress,
  starStyle,
  container,
}) => {
  const starData = [1, 2, 3, 4, 5];
  return (
    <View style={[{flexDirection: 'row'}, container]}>
      {starData.map(item => (
        <TouchableOpacity
          key={item.toString()}
          style={[{margin: 1}, starStyle]}
          onPress={() => onPress(item)}
          disabled={disabled}>
          {item <= ratting ? (
            <StarIcon width={size} height={size} />
          ) : (
            <UnStarIcon width={size} height={size} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CStar;
