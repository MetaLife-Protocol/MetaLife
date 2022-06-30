/**
 * Created on 07 Mar 2022 by lonmee
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  View,
} from 'react-native';
import useSchemaStyles, {colorsBasics} from '../../shared/UseSchemaStyles';
import RoundBtn from '../../shared/comps/RoundBtn';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';
import nodejs from 'nodejs-mobile-react-native';
import Toast from 'react-native-tiny-toast';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux/lib/exports';

const Restore = ({setResync}) => {
  const {FG, flex1, marginTop10, text, placeholderTextColor} =
    useSchemaStyles();
  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();
  const [mnemonic, setMnemonic] = useState('');
  const {channel} = nodejs;
  const {navigate} = useNavigation();
  const listener = useRef();
  useEffect(() => {
    listener.current = channel.addListener('identity', responseHandler);
  }, []);

  function responseHandler(res) {
    switch (res) {
      case 'IDENTITY_READY':
        listener.current.remove();
        setResync(true);
        // return navigate('Resync');
        return navigate('WalletCreator', {
          type: 'spectrum',
          name: 'SPE-1',
          from: 'guid', // special implements
          target: 'Resync',
        });
      default:
        return Toast.show(res, {position: 0});
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
          press={() =>
            channel.post(
              'identity',
              `RESTORE: ${mnemonic
                .split(' ')
                .slice(0, 24)
                .map(s => s.trim().toLowerCase())
                .join(' ')}`,
            )
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    resync: s.user.resync,
  };
};

const mdp = d => {
  return {
    setResync: resync => d({type: 'setResync', payload: resync}),
  };
};

export default connect(msp, mdp)(Restore);
