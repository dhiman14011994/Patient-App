import {View, Text} from 'react-native';
import React, {FC, useState} from 'react';
import GTLabel from '../GTLabel';
import styles from './styles';
import CONSTANTS from '../../utils/constants';
import {Call_Icon, Message_Icon, VerifyIcon} from '../../assets';
import GTLinearGradientView from '../GTLinearGradientView';
interface GTPsychologistNameDetailsViewProps {
  username?: string;
  description?: string;
  data?: any;
}

const GTPsychologistNameDetailsView: FC<GTPsychologistNameDetailsViewProps> = ({
  username,
  description,
  data,
}) => {
  const [moreText, setMoreText] = useState(false);
  var textDes = data?.bio || '';
  var textArray = textDes.split('');

  const renderText = ({it, index}: any) => {
    if (!moreText && index < 112) {
      return (
        <Text
          disabled={index < 111}
          onPress={() => {
            if (index == 111) {
              setMoreText(true);
            }
          }}
          style={{
            fontSize: CONSTANTS.THEME.size.s14,
            fontFamily: CONSTANTS.THEME.typography.fontFamily.Regular,
            fontWeight: index == 111 ? '800' : '400',
            color:
              index == 111
                ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                : CONSTANTS.THEME.colors.Dark_Gunmetal,
            lineHeight: CONSTANTS.THEME.size.s22,
          }}>
          {index < 100 ? `${it}` : index < 111 ? '.' : ' Read  more'}
        </Text>
      );
    } else if (moreText) {
      return (
        <Text
          disabled={textArray.length < index + 1}
          onPress={() => {
            if (textArray.length == index + 1) {
              setMoreText(false);
            }
          }}
          style={{
            fontSize: CONSTANTS.THEME.size.s14,
            fontFamily: CONSTANTS.THEME.typography.fontFamily.Regular,
            fontWeight: textArray.length == index + 1 ? '800' : '400',
            color:
              textArray.length == index + 1
                ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                : CONSTANTS.THEME.colors.Dark_Gunmetal,
            lineHeight: CONSTANTS.THEME.size.s22,
          }}>
          {textArray.length == index + 1 ? ` Read less` : `${it}`}
        </Text>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <GTLabel
          text={username}
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
      <View style={styles.desContainer}>
        {[...textArray, ''].map((it: string, index: number) =>
          renderText({it, index}),
        )}
      </View>

      <View style={styles.nameContainer}>
        {Array.isArray(data?.language) &&
          data?.language?.length != 0 &&
          data?.language.map((it: any, i: number) => (
            <View
              style={{
                ...styles.languageContainer,
                marginLeft: i !== 0 ? CONSTANTS.THEME.size.s8 : 0,
              }}>
              <GTLabel
                text={it?.name ? it?.name : it || ''}
                fontWeight="600"
                fontSize={CONSTANTS.THEME.size.s14}
                color={CONSTANTS.THEME.colors.PRIMARY_COLOR}
                customStyle={{lineHeight: CONSTANTS.THEME.size.s22}}
              />
            </View>
          ))}
      </View>

      <View style={styles.lineContainer}>
        <GTLinearGradientView
          color2={'rgba(225, 230, 239, 1)'}
          color1={'rgba(225, 230, 239, 0)'}
          container={{
            width: '50%',
            height: 1,
          }}
        />
        <GTLinearGradientView
          color1={'rgba(225, 230, 239, 1)'}
          color2={'rgba(225, 230, 239, 0)'}
          container={{
            width: '50%',
            height: 1,
          }}
        />
      </View>

      <View style={styles.lineContainer}>
        <View
          style={{
            ...styles.messageCallContainer,
            borderRightWidth: 1,
            borderRightColor: CONSTANTS.THEME.colors.NEUTRAL[300],
          }}>
          <Message_Icon
            width={CONSTANTS.THEME.size.s20}
            height={CONSTANTS.THEME.size.s20}
          />
          <GTLabel
            text={'12,456 sms'}
            fontSize={CONSTANTS.THEME.size.s16}
            fontWeight="600"
            color={CONSTANTS.THEME.colors.Dark_Gunmetal}
            customStyle={{marginLeft: CONSTANTS.THEME.size.s16}}
          />
        </View>
        <View style={styles.messageCallContainer}>
          <Call_Icon
            width={CONSTANTS.THEME.size.s20}
            height={CONSTANTS.THEME.size.s20}
          />
          <GTLabel
            text={'12,456 sms'}
            fontSize={CONSTANTS.THEME.size.s16}
            fontWeight="600"
            color={CONSTANTS.THEME.colors.Dark_Gunmetal}
            customStyle={{marginLeft: CONSTANTS.THEME.size.s16}}
          />
        </View>
      </View>
    </View>
  );
};

export default GTPsychologistNameDetailsView;
