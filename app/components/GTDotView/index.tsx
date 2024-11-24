import {View, Animated} from 'react-native';
import React, {FC} from 'react';
import style from './style';

interface CDotViewProps {
  currentIndex?: number;
  data?: any;
  selectedColor?: string;
  unSelectColor?: string;
  width?: any;
  isCurrentSelected?: boolean;
  containerStyle?: any;
  height?: any;
}

const GTDotView: FC<CDotViewProps> = ({
  currentIndex = 0,
  data,
  selectedColor,
  unSelectColor,
  width,
  isCurrentSelected,
  containerStyle,
  height,
}) => {
  return (
    <View style={[style.imageContainer, containerStyle]}>
      {data &&
        data?.map((item: any, index: number) => {
          return (
            <Animated.View
              key={`${index}`}
              style={[
                {
                  width: currentIndex === index ? width + 10 : width,
                  height: height,
                  backgroundColor: isCurrentSelected
                    ? currentIndex === index
                      ? selectedColor
                      : unSelectColor
                    : currentIndex >= index
                    ? selectedColor
                    : unSelectColor,
                },
                style.animatedView,
              ]}
            />
          );
        })}
    </View>
  );
};

export default GTDotView;
