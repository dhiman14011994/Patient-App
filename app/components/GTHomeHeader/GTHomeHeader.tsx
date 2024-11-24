import {View, Text, Platform, StatusBar} from 'react-native';
import React, {FC} from 'react';
import GTHeader from '../GTHeader';
import CONSTANTS from '../../utils/constants';
import {Humburger_Icon, Search_Icon, Wallet_Icon} from '../../assets';
import GTHomeHeaderIcon from '../GTHomeHeaderIcon';
import GTLinearGradientView from '../GTLinearGradientView';
import GTButtonContainer from '../GTButtonContainer';
import GTInput from '../GTInput';

interface GTHomeHeaderProps {
  customStyle?: any;
  setSearchText?: any;
  searchText?: any;
  onHandleLeftPress?: any;
  onHandlePress?: any;
  onHandleRightPress?: any;
  insets?: any;
}

const GTHomeHeader: FC<GTHomeHeaderProps> = ({
  customStyle,
  setSearchText,
  searchText,
  onHandleLeftPress,
  onHandleRightPress,
  onHandlePress,
  insets,
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
        text={CONSTANTS.TEXT.PERSONAL_INFORMATION}
        leftIcon={
          <Humburger_Icon
            width={CONSTANTS.THEME.size.s28}
            height={CONSTANTS.THEME.size.s28}
          />
        }
        rightIcon={
          <Wallet_Icon
            width={CONSTANTS.THEME.size.s28}
            height={CONSTANTS.THEME.size.s28}
          />
        }
        customStyle={customStyle}
        onHandleLeftPress={onHandleLeftPress}
        onHandleRightPress={onHandleRightPress}
        appIcon={<GTHomeHeaderIcon />}
      />
      <GTLinearGradientView
        container={{
          backgroundColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <GTLinearGradientView
            color2={CONSTANTS.THEME.colors.WHITE[50]}
            color1={CONSTANTS.THEME.colors.WHITE[0]}
            container={{
              width: '50%',
              height: 1,
            }}
          />
          <GTLinearGradientView
            color1={CONSTANTS.THEME.colors.WHITE[50]}
            color2={CONSTANTS.THEME.colors.WHITE[0]}
            container={{
              width: '50%',
              height: 1,
            }}
          />
        </View>
        <GTButtonContainer
          customStyle={{
            width: CONSTANTS.THEME.size.WIDTH * 0.94,
            marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
          }}
          onHandlePress={onHandlePress}>
          <GTInput
            customStyle={{marginVertical: '4%', pointerEvents: 'none'}}
            leftIcon={<Search_Icon width={20} height={20} />}
            placeholder="Search"
            inputContainer={{
              backgroundColor: CONSTANTS.THEME.colors.WHITE[20],
            }}
            placeholderTextColor={CONSTANTS.THEME.colors.WHITE[80]}
            input={searchText}
            setInput={(text: any) => setSearchText(text)}
            isSearch={true}
          />
        </GTButtonContainer>
      </GTLinearGradientView>
    </View>
  );
};

export default GTHomeHeader;
