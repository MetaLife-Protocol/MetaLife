/**
 * Created on 07 Mar 2022 by lonmee
 */

import React, {useLayoutEffect, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import useSchemaStyles, {colorsBasics} from '../UseSchemaStyles';
import {getMnemonic} from '../../remote/ssb/ssbOP';
import RoundBtn from '../comps/RoundBtn';
import Toast from 'react-native-tiny-toast';
import nativeClipboard from 'react-native/Libraries/Components/Clipboard/NativeClipboard';

const Mnemonic = () => {
  const {FG, flex1, marginTop10, text} = useSchemaStyles();
  const [mnemonic, setMnemonic] = useState();
  useLayoutEffect(() => getMnemonic(setMnemonic), []);
  return (
    <SafeAreaView style={[FG, flex1, marginTop10]}>
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
        <Text style={[text, {fontSize: 20}]}>{mnemonic}</Text>
      </View>
      <View style={[flex1]} />
      <RoundBtn
        style={[{marginBottom: 40}]}
        title={'Copy'}
        press={() => {
          nativeClipboard.setString(mnemonic);
          Toast.show('Mnemonic copied');
        }}
      />
    </SafeAreaView>
  );
};

export default Mnemonic;
