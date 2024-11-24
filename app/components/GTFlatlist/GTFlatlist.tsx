import {View, Animated, FlatList} from 'react-native';
import React, {FC} from 'react';
import CONSTANTS from '../../utils/constants';

interface GTFlatlistProps {
  flatListref?: any;
  data?: any;
  scrollX?: any;
  setCurrentIndex?: any;
  renderItem?: any;
  scrollEnabled?: boolean;
  bounces?: boolean;
  horizontal?: boolean;
  ListFooterComponent?: any;
  ListHeaderComponent?: any;
  ListEmptyComponent?: any;
  pagingEnabled?: boolean;
  initialNumToRender?: any;
  keyExtractor?: any;
}

const GTFlatlist: FC<GTFlatlistProps> = ({
  flatListref,
  data,
  scrollX,
  initialNumToRender,
  setCurrentIndex,
  renderItem,
  scrollEnabled = true,
  bounces = true,
  horizontal = true,
  ListFooterComponent,
  ListHeaderComponent,
  ListEmptyComponent,
  pagingEnabled = false,
  keyExtractor,
}) => {
  return (
    <View>
      <FlatList
        scrollEnabled={scrollEnabled}
        ref={flatListref}
        bounces={bounces}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ],
          {
            useNativeDriver: false,
            listener: (event: any) => {
              // setCurrentIndex(
              //   Math.round(
              //     event.nativeEvent.contentOffset.x /
              //       CONSTANTS.THEME.size.WIDTH,
              //   ),
              // );
            },
          },
        )}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
        }}
        horizontal={horizontal}
        keyExtractor={keyExtractor}
        pagingEnabled={pagingEnabled}
        ListFooterComponent={ListFooterComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        initialNumToRender={initialNumToRender}
      />
    </View>
  );
};

export default GTFlatlist;
