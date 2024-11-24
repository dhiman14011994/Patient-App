import {View, Text, ImageStyle, ViewStyle} from 'react-native';
import React, {FC} from 'react';
import GTImage from '../GTImage';
import GTLabel from '../GTLabel';
import {IMAGE_ICON, TICK_READ_ICON, VIDEO_ICON} from '../../assets';
import CONSTANTS from '../../utils/constants';
import styles from './styles';
import GTButtonContainer from '../GTButtonContainer';
import moment from 'moment';
import {compareTwoDate} from '../../utils/customFunction';
import GTButton from '../GTButton';

interface GTAppointmentListProps {
  userImage?: any;
  typeOfMessage?: string;
  message?: string;
  time?: string;
  date?: string;
  name?: string;
  tickType?: string;
  unreadMeassage?: string;
  imageStyle?: ImageStyle;
  container?: ViewStyle;
  onHandlePress?: () => void;
  item?: any;
  onPressReject?: any;
  onPressAccept?: any;
  waitData?: any;
}

const GTAppointmentList: FC<GTAppointmentListProps> = ({
  userImage,
  typeOfMessage,
  message,
  time,
  date,
  name,
  tickType = 'none',
  imageStyle,
  container,
  unreadMeassage = '0',
  onHandlePress,
  onPressReject,
  item,
  onPressAccept,
  waitData,
}) => {
  var timeFormat = moment(time).format('hh:mm A');
  var dateFormat = moment(time).format('DD/MM/YYYY');
  var todayDate = new Date();
  var isToday = compareTwoDate({
    startDate: todayDate,
    endDate: time,
  });

  return (
    <GTButtonContainer
      customStyle={{...styles.mainContainer, ...container}}
      disabled={item?.appointment == 'waitList'}
      onHandlePress={onHandlePress}>
      <View style={styles.subContainer}>
        <GTImage imageStyle={imageStyle} uri={userImage} />
        <View style={styles.nameContainer}>
          <GTLabel
            text={name || 'Abc kumar'}
            fontSize={CONSTANTS.THEME.size.s16}
            fontWeight="700"
            color={CONSTANTS.THEME.colors.Dark_Gunmetal}
          />
          {item?.appointment !== 'waitList' && (
            <View style={{...styles.subContainer, marginBottom: 4}}>
              <GTLabel
                color={CONSTANTS.THEME.colors.Light_Gunmetal}
                text={`Status: `}
                fontSize={CONSTANTS.THEME.size.s14}
                fontWeight="400"
              />
              <GTLabel
                color={
                  item.isExpireAppointment
                    ? CONSTANTS.THEME.colors.RED
                    : CONSTANTS.THEME.colors.GREEN
                }
                text={
                  item.appointmentStatus == 'cancelled'
                    ? `Rejected`
                    : item.isExpireAppointment
                    ? 'Session Close'
                    : 'Confirm'
                }
                fontSize={CONSTANTS.THEME.size.s14}
                fontWeight="400"
              />
            </View>
          )}
          {item?.appointment == 'waitList' ? (
            <View style={styles.subContainer}>
              <GTLabel
                color={CONSTANTS.THEME.colors.Light_Gunmetal}
                text={`Wait ~ ${item.waitingTime} min`}
                fontSize={CONSTANTS.THEME.size.s14}
                fontWeight="400"
              />
            </View>
          ) : (
            <View style={styles.subContainer}>
              {/* {tickType != 'none' && (
                <TICK_READ_ICON
                  width={CONSTANTS.THEME.size.s16}
                  height={CONSTANTS.THEME.size.s10}
                />
              )}
              {typeOfMessage == 'image' ? (
                <View
                  style={{
                    ...styles.mediaContainer,
                    marginLeft:
                      tickType == 'none' ? 0 : CONSTANTS.THEME.size.s6,
                  }}>
                  <IMAGE_ICON
                    width={CONSTANTS.THEME.size.s14}
                    height={CONSTANTS.THEME.size.s14}
                  />
                  <GTLabel
                    text="Image"
                    fontSize={CONSTANTS.THEME.size.s14}
                    fontWeight="400"
                    color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
                    customStyle={{marginLeft: CONSTANTS.THEME.size.s6}}
                  />
                </View>
              ) : typeOfMessage == 'video' ? (
                <View
                  style={{
                    ...styles.mediaContainer,
                    marginLeft:
                      tickType == 'none' ? 0 : CONSTANTS.THEME.size.s6,
                  }}>
                  <VIDEO_ICON
                    width={CONSTANTS.THEME.size.s16}
                    height={CONSTANTS.THEME.size.s16}
                  />
                  <GTLabel
                    fontSize={CONSTANTS.THEME.size.s14}
                    fontWeight="400"
                    color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
                    text="Video"
                    customStyle={{marginLeft: CONSTANTS.THEME.size.s6}}
                  />
                </View>
              ) : (
                <GTLabel
                  text={message || 'text message'}
                  fontSize={CONSTANTS.THEME.size.s14}
                  fontWeight="400"
                  color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
                  customStyle={{
                    ...styles.messageTextStyle,
                    marginLeft:
                      tickType == 'none' ? 0 : CONSTANTS.THEME.size.s6,
                  }}
                />
              )} */}
            </View>
          )}
        </View>
      </View>
      {item?.appointment == 'waitList' ? (
        <View
          style={{
            ...styles.WaitTimeView,
            alignItems: item?._id === waitData._id ? 'center' : 'flex-end',
          }}>
          {item?._id === waitData._id && (
            <GTButton
              onHandlePress={onPressAccept}
              customStyle={{
                borderWidth: 1,
                borderRadius: 20,
                borderColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
                height: CONSTANTS.THEME.size.s32,
                marginVertical: 10,
                width: CONSTANTS.THEME.size.WIDTH * 0.3,
              }}
              backgroundColor={CONSTANTS.THEME.colors.PRIMARY_COLOR}
              fontSize={CONSTANTS.THEME.size.s12}
              color={CONSTANTS.THEME.colors.WHITE[100]}
              text={'Accept Request'}
            />
          )}

          <GTButton
            onHandlePress={onPressReject}
            customStyle={{
              borderWidth: 1,
              borderRadius: 20,
              borderColor: CONSTANTS.THEME.colors.ORANGE,
              height: CONSTANTS.THEME.size.s32,
              width: CONSTANTS.THEME.size.WIDTH * 0.2,
            }}
            backgroundColor={CONSTANTS.THEME.colors.WHITE_COLOR}
            fontSize={CONSTANTS.THEME.size.s12}
            color={CONSTANTS.THEME.colors.ORANGE}
            text={'Cancel'}
          />
        </View>
      ) : (
        <View style={styles.timeView}>
          <GTLabel
            text={isToday ? timeFormat || '6:18 AM' : dateFormat}
            fontSize={CONSTANTS.THEME.size.s12}
            fontWeight="400"
            color={CONSTANTS.THEME.colors.PRIMARY_COLOR}
            textAlign="right"
          />
          {Number(unreadMeassage) > 0 && (
            <View style={styles.unreadView}>
              <GTLabel
                text={unreadMeassage}
                fontSize={CONSTANTS.THEME.size.s12}
                fontWeight="600"
                color={CONSTANTS.THEME.colors.WHITE_COLOR}
                customStyle={{paddingHorizontal: 0}}
              />
            </View>
          )}
        </View>
      )}
    </GTButtonContainer>
  );
};

export default GTAppointmentList;
