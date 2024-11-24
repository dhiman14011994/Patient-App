import {TouchableOpacity, View, ViewStyle, TextInput} from 'react-native';
import React, {FC} from 'react';
import CONSTANTS from '../../utils/constants';
import styles from './styles';
import GTLabel from '../GTLabel';
import {Error_Icon} from '../../assets';
// props of inputs define here
interface GTInputProps {
  label?: string;
  labelFontSize?: number;
  labelFontFamily?: string;
  backgroundColor?: string;
  customStyle?: ViewStyle;
  labelStyle?: ViewStyle;
  onRightIconPress?: () => void;
  leftIcon?: any;
  rightIcon?: any;
  inputStyle?: any;
  placeholder?: string;
  placeholderTextColor?: string;
  focus?: boolean;
  input?: string;
  setInput?: (input: string) => void;
  setfocus?: (focus: boolean) => void;
  keyboardType?: any;
  secureTextEntry?: boolean;
  isError?: any;
  errorStyle?: ViewStyle;
  autoCapitalize?: string;
  labelColor?: string;
  labelFontWeight?: any;
  inputContainer?: ViewStyle;
  editable?: boolean;
  isSearch?: boolean;
  maxLength?: number;
}

/**
 * GTInput is component to display input with label and it supports nesting and styling.
 * @param {string} label is the title of input value that you wants to display.
 * @param {number} labelFontSize change the size of font.
 * @param {string} labelFontFamily change the size of font family.
 * @param {string} backgroundColor you can change color of text.
 * @param {ViewStyle} customStyle if you want to add custom styling.
 * @param {ViewStyle} labelStyle if you want to add custom styling of label of the input.
 * @param {Function} onRightIconPress onPress handle by this props.
 * @param {any} leftIcon if you want to add custom icon inside button left side.
 * @param {any} rightIcon if you want to add custom icon inside button right side.
 * @param {ViewStyle} inputStyle if you want to add custom styling of TextInput.
 * @param {string} placeholder message that you wants to display in input field.
 * @param {string} placeholderTextColor you can change color of text
 * @param {boolean} focus if you want to add custom styling.
 * @param {string} input if you want to add custom styling of label of the input.
 * @param {void} setInput onPress handle by this props.
 * @param {void} setFocus if you want to add custom icon inside button left side.
 * @param {string} keyboardType if you want to add custom icon inside button right side.
 * @param {boolean} secureTextEntry if you want to add custom styling of TextInput.
 * @param {any} isError message that you wants to display in input field.
 * @param {ViewStyle} errorStyle you can change color of text
 * @param {string} autoCapitalize you can change autoCapitalize value.
 * @returns The styled input
 */

// return the component
const GTInput: FC<GTInputProps> = ({
  label,
  labelFontSize = CONSTANTS.THEME.size.s14,
  labelFontFamily = CONSTANTS.THEME.typography.fontFamily.Regular,
  customStyle = {},
  labelStyle = {},
  onRightIconPress,
  leftIcon,
  rightIcon,
  inputStyle,
  placeholder,
  placeholderTextColor,
  focus,
  input,
  setInput = () => {},
  setfocus = () => {},
  keyboardType,
  secureTextEntry,
  isError,
  errorStyle,
  autoCapitalize,
  labelColor = CONSTANTS.THEME.colors.Dark_Gunmetal,
  labelFontWeight = '600',
  inputContainer,
  editable,
  isSearch,
  maxLength,
}) => {
  return (
    <View
      style={[
        styles.mainContainer,
        {
          ...customStyle,
        },
      ]}>
      {/* Title */}
      {label && (
        <GTLabel
          text={label}
          fontSize={labelFontSize}
          fontFamily={labelFontFamily}
          color={labelColor}
          fontWeight={labelFontWeight}
          customStyle={{...styles.textStyle, ...labelStyle}}
        />
      )}

      {/* Input */}
      <View
        style={{
          ...styles.inputContainer,
          ...inputContainer,
          marginHorizontal: isSearch ? 0 : CONSTANTS.THEME.size.WIDTH * 0.03,
        }}>
        {leftIcon && <View style={styles.actionIcon}>{leftIcon}</View>}
        <TextInput
          placeholder={focus ? '' : placeholder}
          placeholderTextColor={placeholderTextColor}
          value={input}
          style={[
            styles.inputStyle,
            inputStyle,
            {
              width: leftIcon
                ? rightIcon
                  ? '80%'
                  : '90%'
                : rightIcon
                ? '90%'
                : '100%',
            },
          ]}
          onChangeText={em => setInput(em)}
          onFocus={() => {
            setfocus(true);
          }}
          keyboardType={keyboardType || 'default'}
          onBlur={() => setfocus(false)}
          blurOnSubmit
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize == 'none' ? 'none' : 'words'}
          editable={editable}
          maxLength={maxLength || 10000000000}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            activeOpacity={0.8}
            style={styles.actionIcon}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {/* Error */}
      {!isSearch && isError ? (
        <View style={styles.errorView}>
          <Error_Icon
            width={CONSTANTS.THEME.size.s14}
            height={CONSTANTS.THEME.size.s14}
          />
          <GTLabel
            text={isError}
            color={CONSTANTS.THEME.colors.RED}
            fontSize={CONSTANTS.THEME.size.s12}
            fontWeight="400"
            customStyle={{marginLeft: '2%'}}
          />
        </View>
      ) : (
        !isSearch && (
          <GTLabel
            text={''}
            color={CONSTANTS.THEME.colors.RED}
            fontSize={CONSTANTS.THEME.size.s12}
            fontWeight="400"
            customStyle={{marginLeft: '2%'}}
          />
        )
      )}
    </View>
  );
};

export default GTInput;
