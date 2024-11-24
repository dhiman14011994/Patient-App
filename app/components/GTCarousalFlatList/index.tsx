import {View, Text, Animated as RNAnimated} from 'react-native';
import React, {FC} from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useScrollViewOffset,
  useSharedValue,
} from 'react-native-reanimated';
import GTBlogItem from '../GTBlogItem';
import PagingDotContainer from '../PagingDotContainer';
import CONSTANTS from '../../utils/constants';
import GTHomeVideoBanner from '../GTHomeVideoBanner';

interface GTCarousalFlatListProps {
  data?: any;
  renderItem?: any;
  isBlog?: boolean;
}

const GTCarousalFlatList: FC<GTCarousalFlatListProps> = ({data, isBlog}) => {
  const scrollX = useSharedValue(0);
  const scrollY = new RNAnimated.Value(0);
  const onScrollHandler = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x;
  });
  let position = RNAnimated.divide(scrollY, CONSTANTS.THEME.size.WIDTH - 64);

  const renderItem = ({item, index}: any) => {
    if (isBlog) {
      return (
        <GTBlogItem
          key={index.toString()}
          item={item}
          index={index}
          scrollX={scrollX}
        />
      );
    } else {
      return <GTHomeVideoBanner index={index} />;
    }
  };
  return (
    <View>
      <Animated.FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal
        // onScroll={onScrollHandler}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        // pagingEnabled={true}
        renderItem={renderItem}
        onScroll={RNAnimated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollY,
                },
              },
            },
          ],
          {
            useNativeDriver: false,
            listener: (event: any) => {},
          },
        )}
      />
      <View style={{marginTop: '2%'}}>
        <PagingDotContainer
          elements={data}
          position={position}
          dotColor={CONSTANTS.THEME.colors.PRIMARY_COLOR}
        />
      </View>
    </View>
  );
};

export default GTCarousalFlatList;
