import {View, Text} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import GTImage from '../GTImage';
import GTButtonContainer from '../GTButtonContainer';
import {RED_CHAT_ICON, WHITE_CANCEL_ICON} from '../../assets';
import CONSTANTS from '../../utils/constants';
import GTLabel from '../GTLabel';
interface GTOfflineUserViewProps {
  data?: any;
  onExitPress?: any;
  customStyle?: any;
}

const GTOfflineUserView: FC<GTOfflineUserViewProps> = ({
  data,
  onExitPress,
  customStyle,
}) => {
  const userName = data?.firstName
    ? `${data?.firstName} ${data?.lastName}`
    : 'Abc';
  return (
    <View style={{...styles.container, ...customStyle}}>
      <View style={styles.subContainer}>
        <View style={styles.userInfoContainer}>
          <GTImage
            imageStyle={styles.imageStyle}
            uri={data?.profilePicture || ''}
          />
          <View style={styles.userContainer}>
            <View style={styles.userSubContainer}>
              <GTLabel
                text={userName}
                fontSize={CONSTANTS.THEME.size.s14}
                fontWeight="700"
                color={CONSTANTS.THEME.colors.Dark_Gunmetal}
                customStyle={styles.nameUserStyle}
                numberOfLines={1}
              />
              <View style={styles.lineStyle} />
              <View style={styles.chatContainer}>
                <RED_CHAT_ICON
                  width={CONSTANTS.THEME.size.s14}
                  height={CONSTANTS.THEME.size.s14}
                />
                <GTLabel
                  text={`₹${data?.wageForChat || 5}/min`}
                  fontSize={CONSTANTS.THEME.size.s12}
                  fontWeight="600"
                  color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
                  customStyle={{marginLeft: CONSTANTS.THEME.size.s8}}
                />
              </View>
            </View>
            <GTLabel
              text={CONSTANTS.TEXT.IS_OFFLINE_DELAY(userName)}
              fontSize={CONSTANTS.THEME.size.s12}
              color={CONSTANTS.THEME.colors.RED}
              fontWeight="400"
              customStyle={styles.offlineTextName}
            />
          </View>
        </View>
        <GTButtonContainer onHandlePress={onExitPress}>
          <WHITE_CANCEL_ICON
            width={CONSTANTS.THEME.size.s30}
            height={CONSTANTS.THEME.size.s30}
          />
        </GTButtonContainer>
      </View>
    </View>
  );
};

export default GTOfflineUserView;
