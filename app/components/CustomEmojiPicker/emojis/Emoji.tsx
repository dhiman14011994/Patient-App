import React, {memo} from 'react';
import {Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';

import shortnameToUnicode from '../helpers/shortnameToUnicode';
import {fontResize} from '../../../utils/fontResize';

const Emoji = ({item, onPress}: any) => {
  return (
    <TouchableOpacity style={styles.emojiContainer} onPress={onPress}>
      <Text style={styles.emoji}>{shortnameToUnicode[`:${item}:`]}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  emojiContainer: {
    marginHorizontal: Dimensions.get('screen').width * 0.011,
  },
  emoji: {
    fontSize: fontResize(32),
  },
});

export default memo(Emoji);
