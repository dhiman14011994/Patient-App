import {View} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import GTLabel from '../GTLabel';
import CONSTANTS from '../../utils/constants';
import GTSelectionSchedule from '../GTSelectionSchedule';
import GTButtonContainer from '../GTButtonContainer';
import {X_CLOSE_ICON} from '../../assets';
import GTButton from '../GTButton';
import DatePicker from 'react-native-date-picker';
import GTInput from '../GTInput';
import GTScrollView from '../GTScrollView';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface GTScheduleChatContainerProps {
  onClosePress?: () => void;
  selected?: boolean;
  selectedSchedule?: any;
  date?: any;
  setDate?: any;
  isLoading?: boolean;
  onPress?: any;
  selectedDate?: any;
  title?: string;
  setTitle?: any;
  isKeyboard?: boolean;
  keyboardHeight?: number;
}

const GTScheduleChatContainer: FC<GTScheduleChatContainerProps> = ({
  onClosePress,
  selected,
  selectedSchedule,
  date,
  setDate,
  onPress,
  isLoading,
  title,
  setTitle,
  selectedDate,
  isKeyboard,
  keyboardHeight,
}) => {
  var isDisabled = false;
  return (
    <View style={{...styles.container}}>
      <GTScrollView>
        <GTButtonContainer
          customStyle={styles.closeContainer}
          onHandlePress={onClosePress}>
          <X_CLOSE_ICON
            width={CONSTANTS.THEME.size.s18}
            height={CONSTANTS.THEME.size.s18}
          />
        </GTButtonContainer>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View>
            <View style={{...styles.mainContainer}}>
              <GTScrollView>
                <View style={styles.subContainer}>
                  <GTLabel
                    text={CONSTANTS.TEXT.SCHEDULE}
                    fontSize={CONSTANTS.THEME.size.s22}
                    color={CONSTANTS.THEME.colors.Dark_Gunmetal}
                    fontWeight={'700'}
                    customStyle={{lineHeight: CONSTANTS.THEME.size.s32}}
                  />
                  <GTLabel
                    text={CONSTANTS.TEXT.YOU_HAVE_OPTION}
                    fontSize={CONSTANTS.THEME.size.s14}
                    color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
                    fontWeight={'400'}
                    customStyle={{
                      lineHeight: CONSTANTS.THEME.size.s22,
                      marginBottom: CONSTANTS.THEME.size.s22,
                    }}
                    textAlign="center"
                  />

                  {/* <View
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <GTInput
                      placeholder="Enter appointment title"
                      placeholderTextColor={
                        CONSTANTS.THEME.colors.DARK_GRAY_COLOR
                      }
                      inputContainer={styles.inputContainer}
                      setInput={setTitle}
                    />
                  </View> */}
                  <GTSelectionSchedule
                    title={CONSTANTS.TEXT.NOW}
                    description={CONSTANTS.TEXT.SCHEDULE_LOREM}
                    selected={selected}
                    onPress={() => selectedSchedule(true)}
                  />
                  <GTSelectionSchedule
                    title={CONSTANTS.TEXT.SCHEDULE}
                    description={CONSTANTS.TEXT.SCHEDULE_LOREM}
                    selected={!selected}
                    onPress={() => selectedSchedule(false)}
                  />
                  {!selected && (
                    <View
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        pointerEvents: 'box-none',
                      }}>
                      <DatePicker
                        theme={'light'}
                        modal={false}
                        minimumDate={new Date()}
                        date={date}
                        // onConfirm={date => {
                        //   setDate(date);
                        // }}
                        onDateChange={date => {
                          setDate(date);
                        }}
                        onCancel={() => {}}
                      />
                    </View>
                  )}

                  <GTButton
                    onHandlePress={onPress}
                    text={CONSTANTS.TEXT.PROCEED}
                    fontSize={CONSTANTS.THEME.size.s16}
                    fontWeight={'600'}
                    color={
                      !isDisabled
                        ? CONSTANTS.THEME.colors.WHITE_COLOR
                        : CONSTANTS.THEME.colors.Light_Gunmetal
                    }
                    backgroundColor={
                      !isDisabled
                        ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                        : CONSTANTS.THEME.colors.LIGHT_WHITE
                    }
                    disabled={isDisabled}
                    customStyle={{...styles.buttonContainer}}
                    isLoading={isLoading}
                  />
                  {/* {isKeyboard && (
                    <View style={{height: CONSTANTS.THEME.size.WIDTH}} />
                  )} */}
                </View>
                {/* </KeyboardAwareScrollView> */}
              </GTScrollView>
            </View>
            {isKeyboard && <View style={{height: keyboardHeight}} />}
          </View>
        </KeyboardAwareScrollView>
      </GTScrollView>
    </View>
  );
};

export default GTScheduleChatContainer;
