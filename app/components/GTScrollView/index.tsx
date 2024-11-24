import {View, Text, ScrollView} from 'react-native';
import React, {FC} from 'react';

// props of ScrollView define here
interface GTScrollProps {
  children?: any;
  horizontal?: boolean;
  onScroll?: any;
  container?: any;
}
const GTScrollView: FC<GTScrollProps> = ({
  children,
  horizontal = false,
  onScroll,
  container,
}) => {
  return (
    <ScrollView
      horizontal={horizontal}
      onScroll={onScroll}
      style={container}
      bounces={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
};

export default GTScrollView;
