import React from 'react';

import {View} from 'react-native';
import CONSTANTS from '../../../utils/constants';
import {Composer, InputToolbar, Send} from 'react-native-gifted-chat';
import {
  ACTIVE_EMOJI_ICON,
  EMOJI_icon,
  PAPER_CLIP_ICON,
  SEND_ICON,
} from '../../../assets';
import GTButtonContainer from '../../../components/GTButtonContainer';

export const renderComposer = (props: any) => (
  <Composer
    {...props}
    textInputStyle={{
      paddingHorizontal: CONSTANTS.THEME.size.s12,
      marginLeft: 0,
      color: 'red',
      backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
      borderRadius: CONSTANTS.THEME.size.BUTTON_HEIGHT,
      paddingVertical: CONSTANTS.THEME.size.s26,
    }}
  />
);

export const renderInputToolbar = (props: any, onEmojiPress?: any) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      borderTopColor: 'gray',
    }}>
    <GTButtonContainer
      onHandlePress={onEmojiPress}
      customStyle={{
        width: '10%',
        height: CONSTANTS.THEME.size.s40,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <EMOJI_icon
        width={CONSTANTS.THEME.size.s28}
        height={CONSTANTS.THEME.size.s28}
      />
      {/* {isSelectedEmoji ? (
        <ACTIVE_EMOJI_ICON
          width={CONSTANTS.THEME.size.s28}
          height={CONSTANTS.THEME.size.s28}
        />
      ) : (
        <EMOJI_icon
          width={CONSTANTS.THEME.size.s28}
          height={CONSTANTS.THEME.size.s28}
        />
      )} */}
    </GTButtonContainer>
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: CONSTANTS.THEME.colors.TRANSPARENT,
        width: CONSTANTS.THEME.size.WIDTH * 0.9,
        borderColor: CONSTANTS.THEME.colors.TRANSPARENT,
      }}
      primaryStyle={{alignItems: 'center'}}
    />
  </View>
);

export const renderSend = (props: any) => (
  //@ts-ignore
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: CONSTANTS.THEME.size.s44,
      height: CONSTANTS.THEME.size.s44,
      borderRadius: CONSTANTS.THEME.size.s44 / 2,
      marginHorizontal: CONSTANTS.THEME.size.s4,
      backgroundColor: props.text
        ? CONSTANTS.THEME.colors.PRIMARY_COLOR
        : CONSTANTS.THEME.colors.TRANSPARENT,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    {props.text ? (
      <SEND_ICON
        width={CONSTANTS.THEME.size.s36}
        height={CONSTANTS.THEME.size.s36}
      />
    ) : (
      <PAPER_CLIP_ICON
        width={CONSTANTS.THEME.size.s28}
        height={CONSTANTS.THEME.size.s28}
      />
    )}
  </Send>
);
