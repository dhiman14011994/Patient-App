import {View, Text} from 'react-native';
import React, {FC} from 'react';
import GTImage from '../GTImage';
import GTLabel from '../GTLabel';
import styles from './styles';
import CONSTANTS from '../../utils/constants';

interface GTPsychologistImageViewProps {
  image?: string;
  experience?: string;
  rating?: string;
  orders?: string;
}

const GTPsychologistImageView: FC<GTPsychologistImageViewProps> = ({
  image,
  experience,
  rating,
  orders,
}) => {
  const renderDetailsView = ({value, valueName}: any) => {
    return (
      <View style={styles.textContainer}>
        <GTLabel
          text={value}
          color={CONSTANTS.THEME.colors.Dark_Gunmetal}
          fontWeight="800"
          fontSize={CONSTANTS.THEME.size.s22}
          customStyle={{lineHeight: CONSTANTS.THEME.size.s34}}
        />
        <GTLabel
          text={valueName}
          color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
          fontWeight="400"
          fontSize={CONSTANTS.THEME.size.s12}
          customStyle={{lineHeight: CONSTANTS.THEME.size.s18}}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <GTImage uri={image} imageStyle={styles.imageStyle} />
      <View style={styles.subContainer}>
        {renderDetailsView({
          value: experience || '10',
          valueName: 'Experience',
        })}
        {renderDetailsView({value: rating || '4.5', valueName: 'Rating'})}
        {renderDetailsView({value: orders || '1253', valueName: 'Orders'})}
      </View>
    </View>
  );
};

export default GTPsychologistImageView;
