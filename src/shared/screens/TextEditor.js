/**
 * Created on 07 Mar 2022 by lonmee
 */

import React, {useLayoutEffect} from 'react';
import {SafeAreaView, View} from 'react-native';
import useSchemaStyles from '../UseSchemaStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import MsgInput from '../comps/MsgInput';

const TextEditor = () => {
  const {FG, flex1} = useSchemaStyles();
  const {setOptions} = useNavigation(),
    {
      params: {title},
    } = useRoute();

  useLayoutEffect(() => {
    setOptions({title});
  }, [title]);

  return (
    <SafeAreaView style={[flex1]}>
      <View style={FG} />
      <MsgInput sendHandler={null} />
    </SafeAreaView>
  );
};

export default TextEditor;
