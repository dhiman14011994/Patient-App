import {View, Text, ViewStyle} from 'react-native';
import React, {FC} from 'react';
import {TICK_ICON} from '../../assets';
import CONSTANTS from '../../utils/constants';
import GTLabel from '../GTLabel';
import GTButtonContainer from '../GTButtonContainer';
import styles from './styles';

interface GTSelectionScheduleProps {
  title?: string;
  description?: string;
  selected?: boolean;
  containerStyle?: ViewStyle;
  onPress?: () => void;
}

const GTSelectionSchedule: FC<GTSelectionScheduleProps> = ({
  title,
  description,
  selected,
  containerStyle,
  onPress,
}) => {
  return (
    <GTButtonContainer
      customStyle={{
        ...styles.container,
        ...containerStyle,
        justifyContent: 'flex-start',
      }}
      onHandlePress={onPress}>
      <View
        style={
          selected ? {...styles.selectedView} : {...styles.unSelectedView}
        }>
        {selected && (
          <TICK_ICON
            width={CONSTANTS.THEME.size.s14}
            height={CONSTANTS.THEME.size.s14}
          />
        )}
      </View>
      <View
        style={{
          marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.05,
        }}>
        <GTLabel
          text={title}
          fontSize={CONSTANTS.THEME.size.s14}
          fontWeight="600"
          color={CONSTANTS.THEME.colors.Dark_Gunmetal}
          customStyle={{lineHeight: CONSTANTS.THEME.size.s22}}
        />
        {/* <GTLabel
          text={description}
          fontSize={CONSTANTS.THEME.size.s12}
          fontWeight="400"
          color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
          customStyle={{lineHeight: CONSTANTS.THEME.size.s18}}
        /> */}
      </View>
    </GTButtonContainer>
  );
};

export default GTSelectionSchedule;
