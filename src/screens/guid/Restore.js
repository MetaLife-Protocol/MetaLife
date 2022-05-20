/**
 * Created on 07 Mar 2022 by lonmee
 */

import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  View,
} from 'react-native';
import SchemaStyles, {colorsBasics} from '../../shared/SchemaStyles';
import RoundBtn from '../../shared/comps/RoundBtn';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';
import nodejs from 'nodejs-mobile-react-native';
import Toast from 'react-native-tiny-toast';

const Restore = () => {
  const {FG, flex1, marginTop10, text, placeholderTextColor} = SchemaStyles();
  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();
  const [mnemonic, setMnemonic] = useState('');
  const {channel} = nodejs;

  useEffect(() => {
    const listener = channel.addListener('identity', responseHandler);
    return () => listener.remove();
  }, []);

  function responseHandler(res) {
    console.log(res);
    switch (res) {
      case 'OVERWRITE_RISK':
      case 'TOO_SHORT':
      case 'TOO_LONG':
      case 'WRONG_LENGTH':
      case 'INCORRECT':
        return Toast.show('Incorrect mnemonic', {position: 0});
      case 'IDENTITY_READY':
        return Toast.show('Restore succeed', {position: 0});
    }
  }

  return (
    <SafeAreaView style={[FG, flex1, marginTop10]}>
      <KeyboardAvoidingView
        style={[flex1]}
        keyboardVerticalOffset={isIPhoneX_deprecated ? 94 : 64}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <View
          style={[
            {
              marginTop: 40,
              borderWidth: 2,
              borderRadius: 8,
              padding: 10,
              borderColor: colorsBasics.primary,
              marginHorizontal: 30,
            },
          ]}>
          <TextInput
            keyboardType={'ascii-capable'}
            autoCapitalize={'none'}
            multiline={true}
            textAlign={'left'}
            value={mnemonic}
            placeholder={'Input recovery phrase'}
            placeholderTextColor={placeholderTextColor.color}
            onChangeText={setMnemonic}
            style={[text, {fontSize: 20, height: 120}]}
          />
        </View>
        <View style={[flex1]} />
        <RoundBtn
          style={[{marginBottom: 40}]}
          title={'Restore'}
          disabled={!mnemonic}
          press={() => {
            channel.post(
              'identity',
              `RESTORE: ${mnemonic
                .split(' ')
                .slice(0, 24)
                .map(s => s.trim().toLowerCase())
                .join(' ')}`,
            );
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Restore;
