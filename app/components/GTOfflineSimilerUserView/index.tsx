import {View, Animated} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import GTLabel from '../GTLabel';
import CONSTANTS from '../../utils/constants';
import GTButton from '../GTButton';
import GTButtonContainer from '../GTButtonContainer';
import {FOLDER_ICON, X_CLOSE_ICON} from '../../assets';
import GTScrollView from '../GTScrollView';
import GTUserListView from '../GTUserListView';
import PagingDotContainer from '../PagingDotContainer';

interface GTOfflineSimilerUserViewProps {
  onClosePress?: () => void;
  similarData?: any;
  leavePress?: () => void;
  name?: string;
  onChat?: any;
  onView?: any;
}

const GTOfflineSimilerUserView: FC<GTOfflineSimilerUserViewProps> = ({
  onClosePress,
  similarData,
  leavePress,
  name,
  onChat,
  onView,
}) => {
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(
    scrollX,
    CONSTANTS.THEME.size.WIDTH * 0.7 - 64,
  );
  return (
    <View style={{...styles.container}}>
      <View style={{...styles.mainContainer}}>
        <View style={styles.folderContainer}>
          <FOLDER_ICON
            width={CONSTANTS.THEME.size.s18}
            height={CONSTANTS.THEME.size.s18}
          />
        </View>
        <GTLabel
          text={CONSTANTS.TEXT.LEAVE_OF(name || 'abc')}
          fontSize={CONSTANTS.THEME.size.s22}
          color={CONSTANTS.THEME.colors.Dark_Gunmetal}
          fontWeight={'700'}
          textAlign="center"
          customStyle={{
            lineHeight: CONSTANTS.THEME.size.s32,
            marginTop: CONSTANTS.THEME.size.WIDTH * 0.03,
            marginHorizontal: CONSTANTS.THEME.size.s10,
          }}
        />
        <GTLabel
          text={CONSTANTS.TEXT.INSTEAD_OF_LEAVING(name || 'abc')}
          fontSize={CONSTANTS.THEME.size.s14}
          color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
          fontWeight={'400'}
          textAlign="center"
          customStyle={{
            lineHeight: CONSTANTS.THEME.size.s24,
            marginBottom: CONSTANTS.THEME.size.WIDTH * 0.05,
          }}
        />
        <GTScrollView
          horizontal={true}
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
            },
          )}>
          {similarData &&
            Array.isArray(similarData) &&
            similarData?.map((it: any) => (
              <GTUserListView
                key={it?._id}
                isOffline={!it?.isOnline}
                isWait={false}
                isTime={false}
                isChat={true}
                statusText={!it?.isOnline ? 'Offline' : ''}
                onPress={() => {
                  onView(it);
                }}
                item={it}
                container={{
                  width: CONSTANTS.THEME.size.WIDTH * 0.7,
                  marginRight: 10,
                }}
                chatOnPress={() => {
                  onChat(it);
                }}
              />
            ))}
        </GTScrollView>
        <View style={{marginTop: '2%'}}>
          <PagingDotContainer
            elements={similarData || []}
            position={position}
            dotColor={CONSTANTS.THEME.colors.PRIMARY_COLOR}
          />
        </View>
        <GTButton
          onHandlePress={leavePress}
          text={CONSTANTS.TEXT.LEAVE}
          backgroundColor={CONSTANTS.THEME.colors.RED}
          color={CONSTANTS.THEME.colors.WHITE_COLOR}
          fontSize={CONSTANTS.THEME.size.s16}
          fontWeight={'600'}
          customStyle={{...styles.buttonContainer}}
        />
      </View>

      <GTButtonContainer
        customStyle={styles.closeContainer}
        onHandlePress={onClosePress}>
        <X_CLOSE_ICON
          width={CONSTANTS.THEME.size.s18}
          height={CONSTANTS.THEME.size.s18}
        />
      </GTButtonContainer>
    </View>
  );
};

export default GTOfflineSimilerUserView;
