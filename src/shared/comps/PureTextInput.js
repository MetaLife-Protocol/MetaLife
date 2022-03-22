'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-17
 * @Project:MetaLife
 */

import React, {useCallback, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';
import {PhotonSeparator} from './PhotonSeparator';

const PureTextInput = ({
  style,
  inputStyle,
  placeholder,
  defaultValue = '',
  onChangeText,
  inputProps,
}) => {
  const {flex1, text, placeholderTextColor} = SchemaStyles(),
    {round, textInput} = styles;
  const [content, setContent] = useState(defaultValue);
  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();
  const textChange = useCallback(
    value => {
      setContent(value);
      onChangeText(value);
    },
    [onChangeText],
  );
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={isIPhoneX_deprecated ? 94 : 64}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[round, style]}>
        <TextInput
          placeholder={placeholder}
          style={[flex1, textInput, text, inputStyle]}
          value={content}
          onChangeText={textChange}
          placeholderTextColor={placeholderTextColor.color}
          {...inputProps}
        />
      </View>
      <PhotonSeparator />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  round: {
    height: 34,
  },
  textInput: {
    height: 40,
  },
});

export default PureTextInput;
