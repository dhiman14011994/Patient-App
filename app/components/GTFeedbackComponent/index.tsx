import React, {FC} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {styles} from './style';
const FeedbackComponent: FC = () => {
  return (
    <View style={styles.feedbackContaier}>
      <Text style={styles.header}>Feedback to CEO office</Text>
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Start typing here..."
          placeholderTextColor={'#1D2433'}
          multiline={true}
          numberOfLines={4}
          style={styles.textInputStyle}
        />
      </View>
      <TouchableOpacity style={styles.feedbackButtonStyle}>
        <Text style={{color: '#1D2433'}}>Send Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FeedbackComponent;
