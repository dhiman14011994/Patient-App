import {View, Text} from 'react-native';
import React, {FC} from 'react';
import GTImage from '../GTImage';
import GTLabel from '../GTLabel';
import {Star_Icon} from '../../assets';
import CONSTANTS from '../../utils/constants';
import styles from './styles';

interface GTPsychologReviewsProps {
  item?: any;
}

const GTPsychologReviews: FC<GTPsychologReviewsProps> = ({item}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.nameContainer}>
          <GTImage
            uri={item?.user?.profilePicture || ''}
            imageStyle={styles.imageStyle}
          />
          <GTLabel
            text={
              item?.user?.firstName
                ? `${item?.user?.firstName} ${item?.user?.lastName || ''}`
                : 'Martha Nalson'
            }
            fontWeight="700"
            fontSize={CONSTANTS.THEME.size.s16}
            color={CONSTANTS.THEME.colors.Dark_Gunmetal}
            customStyle={{marginLeft: 5}}
          />
        </View>

        <View style={styles.nameContainer}>
          <Star_Icon
            width={CONSTANTS.THEME.size.s10}
            height={CONSTANTS.THEME.size.s10}
          />
          <GTLabel
            text={item.rating || `4.5`}
            fontWeight="700"
            fontSize={CONSTANTS.THEME.size.s16}
            color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
            customStyle={{marginLeft: 5}}
          />
        </View>
      </View>
      <GTLabel
        text={
          item.comment ||
          'I had the privilege of working with Martha Nelson during a challenging time in my life. Their empathetic approach and deep understanding of human emotions made a significant impact.'
        }
        fontWeight="400"
        fontSize={CONSTANTS.THEME.size.s14}
        color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
        customStyle={{
          lineHeight: CONSTANTS.THEME.size.s22,
          paddingVertical: CONSTANTS.THEME.size.s14,
        }}
      />
    </View>
  );
};

export default GTPsychologReviews;
