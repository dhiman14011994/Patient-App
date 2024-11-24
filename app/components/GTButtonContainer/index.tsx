import {Pressable, ViewStyle} from 'react-native';
import React, {FC} from 'react';

// props of buttons define here
interface GTButtonContainerProps {
  children?: any;
  customStyle?: ViewStyle;
  onHandlePress?: () => void;
  disabled?: boolean;
  onHandlePressIn?: () => void;
  onHandlePressOut?: () => void;
}

const GTButtonContainer: FC<GTButtonContainerProps> = ({
  children,
  customStyle,
  onHandlePress,
  disabled = false,
  onHandlePressIn,
  onHandlePressOut,
}) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onHandlePress}
      onPressIn={onHandlePressIn}
      onPressOut={onHandlePressOut}
      style={customStyle}>
      {children}
    </Pressable>
  );
};

export default GTButtonContainer;
