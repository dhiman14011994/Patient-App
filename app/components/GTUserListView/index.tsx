import {
  View,
  Text,
  ImageStyle,
  ViewStyle,
  Touchable,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React, {FC, memo} from 'react';
import GTImage from '../GTImage';
import GTLabel from '../GTLabel';
import {
  Bag_Icon,
  Call_UnActive,
  Chat_Inactive,
  GREEN_CALL_ICON,
  GREEN_CHAT_ICON,
  PhoneIcon,
  PhoneIcon2,
  Star_Icon,
  VerifyIcon,
} from '../../assets';
import CONSTANTS from '../../utils/constants';
import styles from './styles';
import GTButtonContainer from '../GTButtonContainer';
import {ChatButton, CallButton} from '../../assets';
import {ChatIcon, CallIcon, ChatIcon2} from '../../assets';

interface GTUserListViewProps {
  username?: string;
  uri?: any;
  imageStyle?: ImageStyle;
  item?: any;
  isTopChoice?: any;
  isOffline?: boolean;
  isWait?: boolean;
  isTime?: boolean;
  statusText?: string;
  onPress?: () => void;
  chatOnPress?: any;
  container?: ViewStyle;
  userBalance?: number;
  topContainer?: any;
  nameDetailContainer?: any;
  nameContainer?: any;
  userStyle?: any;
  isOnline?: boolean;
  isChat?: boolean;
  isCall?: boolean;
}

const GTUserListView: FC<GTUserListViewProps> = ({
  uri,
  imageStyle,
  username = 'Martha Nelson',
  item,
  isTopChoice,
  isOffline,
  isWait,
  isTime,
  statusText,
  onPress,
  chatOnPress,
  container,
  userBalance = 0,
  topContainer,
  nameDetailContainer,
  nameContainer,
  userStyle,
  isOnline,
  isChat,
  isCall,
}) => {
  const isAmount = userBalance > item?.wageForChat;
  const buttonData = [{}, {}];
  const {width, height} = Dimensions.get('window');
  return (
    <GTButtonContainer
      customStyle={{...styles.container, ...container}}
      onHandlePress={onPress}>
      {isTopChoice && (
        <View style={[styles.topChoice]}>
          <GTLabel
            color={CONSTANTS.THEME.colors.WHITE_COLOR}
            text={CONSTANTS.TEXT.TOP_CHOICE}
            fontSize={CONSTANTS.THEME.size.s12}
            fontWeight="600"
          />
        </View>
      )}
      <View
        style={[
          {
            ...styles.topContainer,
            alignItems: isTopChoice ? 'center' : 'flex-start',
            ...topContainer,
          },
        ]}>
        <View style={[styles.nameDetailsContainer, nameDetailContainer]}>
          <GTImage uri={item?.profilePicture || ''} imageStyle={imageStyle} />
          <View style={[styles.userStyle, userStyle]}>
            <View style={[styles.nameContainer, nameContainer]}>
              <GTLabel
                text={
                  item?.firstName
                    ? `${item?.firstName} ${!isOnline ? item?.lastName : ''}`
                    : username
                }
                color={CONSTANTS.THEME.colors.Dark_Gunmetal}
                fontSize={CONSTANTS.THEME.size.s16}
                fontWeight="700"
                customStyle={{
                  textTransform: 'capitalize',
                  marginRight: 5,
                  maxWidth: CONSTANTS.THEME.size.WIDTH * 0.5,
                }}
              />
              <VerifyIcon
                width={CONSTANTS.THEME.size.s14}
                height={CONSTANTS.THEME.size.s14}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <View
                style={{
                  ...styles.nameContainer,
                  marginTop: CONSTANTS.THEME.size.s6,
                  // justifyContent: 'center',
                }}>
                <Bag_Icon
                  width={CONSTANTS.THEME.size.s14}
                  height={CONSTANTS.THEME.size.s14}
                />
                <GTLabel
                  color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
                  text={`${item?.experience || 0} Years`}
                  fontSize={CONSTANTS.THEME.size.s12}
                  fontWeight="600"
                  customStyle={{marginLeft: 5}}
                />
              </View>

              {isOnline && (
                <View
                  style={{
                    marginTop: 5,
                    justifyContent: 'center',
                    // alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: 'black',
                      position: 'relative',
                      right: 20,
                    }}>{`₹${item?.wageForChat || 5}/min`}</Text>
                </View>
              )}
            </View>
            {/* <View style={[styles.nameContainer]}>
              <View
                style={{
                  ...styles.nameContainer,
                  borderRightWidth: 1,
                  borderRightColor: CONSTANTS.THEME.colors.RED,
                  marginVertical: CONSTANTS.THEME.size.s6,
                  // justifyContent: 'center',
                }}>
                <Star_Icon
                  width={CONSTANTS.THEME.size.s14}
                  height={CONSTANTS.THEME.size.s14}
                />
                <GTLabel
                  text={`${
                    item?.averageRating ? parseInt(item?.averageRating) : '0'
                  }`}
                  color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
                  customStyle={{marginHorizontal: 5}}
                />
              </View>
              <GTLabel
                text={`${item?.totalSessions || item?.total_order || 0} orders`}
                color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
                customStyle={{marginLeft: 5}}
              />
            </View> */}
          </View>
        </View>
        {isOnline != true && (
          <GTLabel
            text={`₹${item?.wageForChat || 5}/min`}
            color={CONSTANTS.THEME.colors.Dark_Gunmetal}
            fontWeight="700"
          />
        )}
      </View>
      <View
        style={[
          styles.buttonContainer,
          // isOnline == true ? {height: '20%'} : null,
        ]}>
        <View
          style={{
            ...styles.nameContainer,
            width: '70%',
            overflow: 'hidden',
            flexWrap: 'wrap',
            margin: 0,
          }}>
          {item?.language &&
            item?.language.map((it: any, i: number) => (
              <>
                <View
                  key={(i + 1).toString()}
                  style={{
                    ...styles.languageContainer,
                    marginLeft: i == 0 ? 0 : CONSTANTS.THEME.size.s6,
                    marginTop: i == 0 ? 0 : CONSTANTS.THEME.size.s6,
                  }}>
                  <GTLabel
                    text={it?.name ? it?.name : it || ''}
                    fontSize={CONSTANTS.THEME.size.s12}
                    color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
                    customStyle={{lineHeight: CONSTANTS.THEME.size.s22}}
                  />
                </View>
              </>
            ))}
        </View>
        {!isOnline && (isChat || isCall) && (
          <GTButtonContainer
            customStyle={{
              ...styles.chatButton,
              borderColor: statusText
                ? isWait
                  ? CONSTANTS.THEME.colors.ORANGE
                  : CONSTANTS.THEME.colors.LIGHT_WHITE
                : isOffline
                ? CONSTANTS.THEME.colors.LIGHT_WHITE
                : isAmount
                ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                : CONSTANTS.THEME.colors.GREEN,
            }}
            // disabled={statusText != ''}
            onHandlePress={() => {
              chatOnPress(isCall ? 'call' : 'chat');
            }}>
            <GTLabel
              text={isCall ? CONSTANTS.TEXT.CALL : CONSTANTS.TEXT.CHAT}
              color={
                isWait
                  ? CONSTANTS.THEME.colors.ORANGE
                  : isOffline || isTime
                  ? CONSTANTS.THEME.colors.Light_Gunmetal
                  : userBalance > item?.wageForChat
                  ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                  : CONSTANTS.THEME.colors.GREEN
              }
            />
            {statusText && (
              <GTLabel
                text={statusText || ''}
                customStyle={styles.offlineText}
                fontSize={CONSTANTS.THEME.size.s12}
                color={
                  isWait
                    ? CONSTANTS.THEME.colors.ORANGE
                    : isTime
                    ? 'rgba(8, 135, 93, 0.7)'
                    : 'rgba(224, 45, 60, 0.7)'
                }
              />
            )}
          </GTButtonContainer>
        )}
      </View>
      {!isChat && !isCall && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            // backgroundColor: 'pink',
            width: '100%',
            marginTop: 10,
          }}>
          {isOnline
            ? buttonData.map((item, index) => {
                return (
                  <TouchableOpacity
                    style={{
                      borderColor: '#2F6FED',
                      // borderWidth: 1,
                      width: '45%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 20,
                      padding: 2,
                      // height: '10%',
                      backgroundColor: index == 0 ? '#2F6FED' : '#08875D',
                      height: 40,
                    }}
                    onPress={() => {
                      chatOnPress(index == 0 ? 'chat' : 'call');
                    }}>
                    {index == 0 ? <ChatIcon2 /> : <PhoneIcon2 />}
                  </TouchableOpacity>
                );
              })
            : !isChat &&
              buttonData.map((it, index) => {
                return (
                  <TouchableOpacity
                    style={{
                      borderColor: statusText
                        ? isWait
                          ? CONSTANTS.THEME.colors.ORANGE
                          : CONSTANTS.THEME.colors.LIGHT_WHITE
                        : isOffline
                        ? CONSTANTS.THEME.colors.LIGHT_WHITE
                        : isAmount
                        ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                        : CONSTANTS.THEME.colors.GREEN,
                      borderWidth: 1,
                      width: '40%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 20,
                      padding: 2,
                      flexDirection: 'row',
                      height: 40,
                    }}
                    disabled={isOffline}
                    onPress={() => {
                      chatOnPress(index == 0 ? 'chat' : 'call');
                    }}>
                    {index == 0 ? (
                      isOffline ? (
                        <Chat_Inactive width={18} height={18} />
                      ) : isAmount ? (
                        <ChatIcon width={18} height={18} />
                      ) : (
                        <GREEN_CHAT_ICON width={18} height={18} />
                      )
                    ) : isOffline ? (
                      <Call_UnActive width={18} height={18} />
                    ) : isAmount ? (
                      <PhoneIcon width={18} height={18} />
                    ) : (
                      <GREEN_CALL_ICON width={18} height={18} />
                    )}
                    <Text
                      style={{
                        color: isWait
                          ? CONSTANTS.THEME.colors.ORANGE
                          : isOffline || isTime
                          ? CONSTANTS.THEME.colors.Light_Gunmetal
                          : userBalance > item?.wageForChat
                          ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                          : CONSTANTS.THEME.colors.GREEN,
                        fontSize: 20,
                        marginLeft: 5,
                      }}>
                      {index == 0 ? 'Chat' : 'Call'}
                    </Text>
                    {statusText && (
                      <GTLabel
                        text={statusText || ''}
                        customStyle={styles.offlineText}
                        fontSize={CONSTANTS.THEME.size.s12}
                        color={
                          isWait
                            ? CONSTANTS.THEME.colors.ORANGE
                            : isTime
                            ? 'rgba(8, 135, 93, 0.7)'
                            : 'rgba(224, 45, 60, 0.7)'
                        }
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
        </View>
      )}
    </GTButtonContainer>
  );
};

export default memo(GTUserListView);
