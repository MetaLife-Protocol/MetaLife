'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-17
 * @Project:MetaLife
 */

import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';
import {PhotonSeparator} from './PhotonSeparator';
import useSchemaStyles from '../../../shared/UseSchemaStyles';

const PureTextInput = ({
  style,
  inputStyle,
  placeholder,
  defaultValue = '',
  onChangeText,
  inputProps,
  hasSeparator = false,
  rightComponent,
}) => {
  const {flex1, text, placeholderTextColor, row, alignItemsCenter} =
      useSchemaStyles(),
    {round, textInput} = styles;
  const [content, setContent] = useState(defaultValue);
  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();

  useEffect(() => {
    setContent(defaultValue);
  }, [defaultValue]);

  const textChange = useCallback(
    value => {
      setContent(value);
      onChangeText(value);
    },
    [onChangeText],
  );
  return (
    <>
      {/* <KeyboardAvoidingView*/}
      {/*  keyboardVerticalOffset={isIPhoneX_deprecated ? 94 : 64}*/}
      {/*   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>*/}
      <View style={[round, style, row, alignItemsCenter]}>
        <TextInput
          placeholder={placeholder}
          style={[flex1, textInput, text, inputStyle]}
          value={content}
          onChangeText={textChange}
          placeholderTextColor={placeholderTextColor.color}
          {...inputProps}
        />
        {rightComponent ? rightComponent : null}
      </View>
      {hasSeparator && <PhotonSeparator />}
      {/*</KeyboardAvoidingView>*/}
    </>
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
