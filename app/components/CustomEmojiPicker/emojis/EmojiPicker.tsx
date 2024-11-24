import React, {useState, memo, useCallback, useMemo} from 'react';
import {
  FlatList,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import categories from '../data/categories';

import Animated from 'react-native-reanimated';
import {fontResize} from '../../../utils/fontResize';
import {emojisByCategory} from '../data/emojis';
import Emoji from './Emoji';
import shortnameToUnicode from '../helpers/shortnameToUnicode';

const EmojiPicker = ({selectedEmoji}: any) => {
  const layout = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [index, setIndex] = useState(0);
  const routes = categories?.tabs?.map(tab => ({
    key: tab.category,
    title: tab.tabLabel,
  }));

  // const renderScene = useCallback(({route}: any) => {
  //   return <EmojiCategory category={route.key} selectedEmoji={selectedEmoji} />;
  // }, []);
  // const scrollX = useSharedValue(0);

  const renderItem: ListRenderItem<any> = ({item, index}) => {
    return (
      <View>
        <Animated.Text
          style={[
            styles.tab,
            {
              marginLeft: 12,
              fontSize: fontResize(26),
              opacity: currentIndex === index ? 1 : 0.5,
            },
          ]}
          onPress={() => setCurrentIndex(index)}>
          {item?.title || ''}
        </Animated.Text>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        horizontal
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        data={routes}
        renderItem={renderItem}
      />

      <ScrollView contentContainerStyle={styles.scrollEmoji}>
        {emojisByCategory[routes[currentIndex].key].map((item, index) => {
          return (
            <Emoji
              key={index.toString()}
              item={item}
              onPress={() => selectedEmoji(shortnameToUnicode[`:${item}:`])}
            />
          );
        })}
      </ScrollView>

      {/* <FlatList
        horizontal

        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        data={emojisByCategory[routes[currentIndex].key]}
        renderItem={renderEmoji}
      /> */}
    </View>

    // <TabView
    //   renderTabBar={(props: any) => }
    //   navigationState={{index, routes}}
    //   onIndexChange={setIndex}
    //   renderScene={renderScene}
    //   initialLayout={{width: layout.width}}
    // />
  );
};
const styles = StyleSheet.create({
  container: {
    height: fontResize(45),
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
  scrollEmoji: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 80,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
  },
});

export default memo(EmojiPicker);
// export default EmojiPicker;
