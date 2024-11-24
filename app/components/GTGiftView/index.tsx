import {View, Text} from 'react-native';
import React from 'react';
import styles from './styles';
import {
  CHOCOLATES_ICON,
  CROWN_ICON,
  FLOWERS_ICON,
  GiftIcon,
  HEART_ICON,
} from '../../assets';
import GTLabel from '../GTLabel';
import CONSTANTS from '../../utils/constants';

const GTGiftView = () => {
  const giftData = [
    {
      id: '1',
      title: 'Flowers',
      image: (
        <FLOWERS_ICON
          width={CONSTANTS.THEME.size.s16}
          height={CONSTANTS.THEME.size.s16}
        />
      ),
    },
    {
      id: '2',
      title: 'Chocolates',
      image: (
        <CHOCOLATES_ICON
          width={CONSTANTS.THEME.size.s16}
          height={CONSTANTS.THEME.size.s16}
        />
      ),
    },
    {
      id: '3',
      title: 'Heart',
      image: (
        <HEART_ICON
          width={CONSTANTS.THEME.size.s16}
          height={CONSTANTS.THEME.size.s16}
        />
      ),
    },
    {
      title: 'Crown',
      image: (
        <CROWN_ICON
          width={CONSTANTS.THEME.size.s16}
          height={CONSTANTS.THEME.size.s16}
        />
      ),
    },
  ];

  const renderItem = ({it, index}: any) => {
    return (
      <View key={it?.id} style={styles.giftItemContainer}>
        {it.image}
        <GTLabel
          customStyle={{marginVertical: CONSTANTS.THEME.size.s6}}
          fontWeight="400"
          fontSize={CONSTANTS.THEME.size.s12}
          text={it.title}
          color={CONSTANTS.THEME.colors.Dark_Gunmetal}
        />
        <GTLabel
          text={'₹15'}
          fontWeight="400"
          fontSize={CONSTANTS.THEME.size.s14}
          color={CONSTANTS.THEME.colors.Dark_Gunmetal}
          customStyle={{marginBottom: CONSTANTS.THEME.size.s6}}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.nameContainer}>
          <GiftIcon
            width={CONSTANTS.THEME.size.s20}
            height={CONSTANTS.THEME.size.s20}
          />
          <GTLabel
            text={`${CONSTANTS.TEXT.SEND_GIFT_TO} Abc`}
            fontWeight="900"
            fontSize={CONSTANTS.THEME.size.s12}
            color={CONSTANTS.THEME.colors.Dark_Gunmetal}
            customStyle={{marginLeft: CONSTANTS.THEME.size.s6}}
          />
        </View>

        <GTLabel
          text={'₹15'}
          fontWeight="600"
          fontSize={CONSTANTS.THEME.size.s14}
          color={CONSTANTS.THEME.colors.PRIMARY_COLOR}
        />
      </View>
      <View
        style={{...styles.subContainer, marginTop: CONSTANTS.THEME.size.s10}}>
        {giftData.map(it => renderItem({it}))}
      </View>
    </View>
  );
};

export default GTGiftView;
