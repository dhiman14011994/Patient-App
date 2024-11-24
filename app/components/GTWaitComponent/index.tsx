import {View, Text} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import GTLabel from '../GTLabel';
import CONSTANTS from '../../utils/constants';
import GTImage from '../GTImage';
import GTButton from '../GTButton';
import GTButtonContainer from '../GTButtonContainer';
import {VerifyIcon, X_CLOSE_ICON} from '../../assets';
import GTLinearGradientView from '../GTLinearGradientView';

interface GTWaitComponentProps {
  onClosePress?: () => void;
  buttonPress?: () => void;
  isLogin?: boolean;
  cureentUser?: any;
  partnerDetails?: any;
  selectLanguage?: string;
  setSelectLanguage?: any;
}

const GTWaitComponent: FC<GTWaitComponentProps> = ({
  onClosePress,
  buttonPress,
  isLogin,
  cureentUser,
  partnerDetails,
  selectLanguage,
  setSelectLanguage,
}) => {
  var name = `${partnerDetails.firstName || 'abc'}${
    partnerDetails?.lastName ? ' ' + partnerDetails?.lastName : ''
  }`;

  const renderLineView = () => {
    return (
      <View style={styles.lineContainer}>
        <GTLinearGradientView
          color2={CONSTANTS.THEME.colors.LIGHT_LINE_COLOR[100]}
          color1={CONSTANTS.THEME.colors.LIGHT_LINE_COLOR[0]}
          container={{
            width: '50%',
            height: 1,
          }}
        />
        <GTLinearGradientView
          color1={CONSTANTS.THEME.colors.LIGHT_LINE_COLOR[100]}
          color2={CONSTANTS.THEME.colors.LIGHT_LINE_COLOR[0]}
          container={{
            width: '50%',
            height: 1,
          }}
        />
      </View>
    );
  };

  return (
    <View style={{...styles.container}}>
      <View style={{...styles.mainContainer}}>
        <GTImage
          imageStyle={styles.firstUserImageStyle}
          uri={partnerDetails?.profilePicture || ''}
        />
        <View style={styles.nameContainer}>
          <GTLabel
            text={name}
            color={CONSTANTS.THEME.colors.Dark_Gunmetal}
            fontSize={CONSTANTS.THEME.size.s16}
            fontWeight="700"
            customStyle={{textTransform: 'capitalize', marginRight: 5}}
          />
          <VerifyIcon
            width={CONSTANTS.THEME.size.s14}
            height={CONSTANTS.THEME.size.s14}
          />
        </View>

        <GTLabel
          text={CONSTANTS.TEXT.IF_YOU_JOIN_WAITLIST(name)}
          fontSize={CONSTANTS.THEME.size.s14}
          color={CONSTANTS.THEME.colors.Dark_Gunmetal}
          fontWeight={'400'}
          textAlign="center"
          customStyle={{
            lineHeight: CONSTANTS.THEME.size.s22,
            marginTop: CONSTANTS.THEME.size.s10,
            marginHorizontal: CONSTANTS.THEME.size.s10,
          }}
        />
        {renderLineView()}

        <GTLabel
          text={CONSTANTS.TEXT.SELECT_LANGUAGE}
          fontSize={CONSTANTS.THEME.size.s12}
          color={CONSTANTS.THEME.colors.Dark_Gunmetal}
          fontWeight={'700'}
          textAlign="center"
          customStyle={{
            marginBottom: CONSTANTS.THEME.size.s20,
            textTransform: 'uppercase',
          }}
        />
        <View
          style={{
            ...styles.nameContainer,
            overflow: 'hidden',
            flexWrap: 'wrap',
          }}>
          {partnerDetails?.language &&
            partnerDetails?.language.map((it: any, i: number) => (
              <GTButtonContainer
                onHandlePress={() => setSelectLanguage(it?.value)}
                key={(i + 1).toString()}
                customStyle={{
                  ...styles.languageContainer,
                  marginLeft: i == 0 ? 0 : CONSTANTS.THEME.size.s6,
                  borderColor:
                    selectLanguage == it?.value
                      ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                      : CONSTANTS.THEME.colors.NEUTRAL[300],
                }}>
                <GTLabel
                  text={it?.name ? it?.name : it || ''}
                  fontSize={CONSTANTS.THEME.size.s14}
                  color={
                    selectLanguage == it?.value
                      ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                      : CONSTANTS.THEME.colors.SECONDARY_COLOR[80]
                  }
                  customStyle={{lineHeight: CONSTANTS.THEME.size.s22}}
                />
              </GTButtonContainer>
            ))}
        </View>
        <GTButton
          onHandlePress={buttonPress}
          text={CONSTANTS.TEXT.JOIN_WAITLIST}
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

export default GTWaitComponent;
