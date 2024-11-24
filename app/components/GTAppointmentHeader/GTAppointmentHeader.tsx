import {View, Text, StatusBar, Platform} from 'react-native';
import React, {FC} from 'react';
import GTLinearGradientView from '../GTLinearGradientView';
import CONSTANTS from '../../utils/constants';
import GTHeader from '../GTHeader';
import {Humburger_Icon, White_Left_Icon} from '../../assets';

interface GTAppointmentHeaderProps {
  insets?: any;
  onHandleLeftPress?: any;
  headerText?: string;
  isBackIcon?: boolean;
}

const GTAppointmentHeader: FC<GTAppointmentHeaderProps> = ({
  insets,
  onHandleLeftPress,
  headerText,
  isBackIcon,
}) => {
  return (
    <View>
      {Platform.OS == 'android' ? (
        <GTLinearGradientView container={{height: insets.top}}>
          <StatusBar
            translucent={true}
            backgroundColor={CONSTANTS.THEME.colors.TRANSPARENT}
          />
        </GTLinearGradientView>
      ) : (
        <GTLinearGradientView
          container={{
            height: insets.top,
            backgroundColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
          }}
        />
      )}
      <GTHeader
        text={headerText || ''}
        leftIcon={
          isBackIcon ? (
            <White_Left_Icon
              width={CONSTANTS.THEME.size.s28}
              height={CONSTANTS.THEME.size.s28}
            />
          ) : (
            <Humburger_Icon
              width={CONSTANTS.THEME.size.s28}
              height={CONSTANTS.THEME.size.s28}
            />
          )
        }
        customStyle={{backgroundColor: CONSTANTS.THEME.colors.PRIMARY_COLOR}}
        onHandleLeftPress={onHandleLeftPress}
      />
    </View>
  );
};

export default GTAppointmentHeader;
