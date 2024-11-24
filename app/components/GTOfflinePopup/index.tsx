import {Image, View} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import GTLabel from '../GTLabel';
import CONSTANTS from '../../utils/constants';
import GTButtonContainer from '../GTButtonContainer';
import {HeaderIcon, X_CLOSE_ICON} from '../../assets';
import GTButton from '../GTButton';
import GTImage from '../GTImage';

interface GTOfflinePopupProps {
  onClosePress?: () => void;
  buttonPress?: () => void;
  isLogin?: boolean;
  cureentUser?: any;
  partnerDetails?: any;
}

const GTOfflinePopup: FC<GTOfflinePopupProps> = ({
  onClosePress,
  buttonPress,
  isLogin,
  cureentUser,
  partnerDetails,
}) => {
  var name = `${partnerDetails.firstName || 'abc'}${
    partnerDetails?.lastName ? ' ' + partnerDetails?.lastName : ''
  }`;
  return (
    <View style={{...styles.container}}>
      <View style={{...styles.mainContainer}}>
        <GTLabel
          text={CONSTANTS.TEXT.YOU_ALL_SET}
          fontSize={CONSTANTS.THEME.size.s22}
          color={CONSTANTS.THEME.colors.Dark_Gunmetal}
          fontWeight={'700'}
          textAlign="center"
          customStyle={{
            lineHeight: CONSTANTS.THEME.size.s32,
            marginVertical: CONSTANTS.THEME.size.WIDTH * 0.05,
            marginHorizontal: CONSTANTS.THEME.size.s10,
          }}
        />
        <View style={styles.imageCotainerView}>
          <GTImage
            imageStyle={styles.firstUserImageStyle}
            uri={partnerDetails?.profilePicture || ''}
          />
          <GTImage
            imageStyle={styles.secondUserImageStyle}
            uri={cureentUser?.profilePicture || ''}
          />
        </View>
        <GTLabel
          text={CONSTANTS.TEXT.CURRENTLT_OFFLINE(name)}
          fontSize={CONSTANTS.THEME.size.s16}
          color={CONSTANTS.THEME.colors.Dark_Gunmetal}
          fontWeight={'700'}
          textAlign="center"
          customStyle={{
            marginVertical: CONSTANTS.THEME.size.s4,
          }}
        />
        <GTLabel
          text={CONSTANTS.TEXT.AS_PER_WAIT(name)}
          fontSize={CONSTANTS.THEME.size.s14}
          color={CONSTANTS.THEME.colors.Dark_Gunmetal}
          fontWeight={'400'}
          textAlign="center"
          customStyle={{
            lineHeight: CONSTANTS.THEME.size.s22,
            marginVertical: CONSTANTS.THEME.size.s4,
            marginHorizontal: CONSTANTS.THEME.size.s10,
          }}
        />
        <GTButton
          onHandlePress={buttonPress}
          text={CONSTANTS.TEXT.OKAY}
          backgroundColor={CONSTANTS.THEME.colors.PRIMARY_COLOR}
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

export default GTOfflinePopup;
