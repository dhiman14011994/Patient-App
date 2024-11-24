import {View, Text} from 'react-native';
import React from 'react';
import {Chat_Icon, Right_Back_Icon} from '../../assets';
import CONSTANTS from '../../utils/constants';
import GTLabel from '../GTLabel';
import styles from './styles';

const GTChatAssistantView = () => {
  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Chat_Icon
          width={CONSTANTS.THEME.size.s20}
          height={CONSTANTS.THEME.size.s20}
        />
        <GTLabel
          text={CONSTANTS.TEXT.CHAT_ASSISTANT}
          fontWeight="900"
          fontSize={CONSTANTS.THEME.size.s12}
          color={CONSTANTS.THEME.colors.Dark_Gunmetal}
          customStyle={{marginLeft: CONSTANTS.THEME.size.s6}}
        />
      </View>

      <Right_Back_Icon
        width={CONSTANTS.THEME.size.s12}
        height={CONSTANTS.THEME.size.s12}
      />
    </View>
  );
};

export default GTChatAssistantView;
