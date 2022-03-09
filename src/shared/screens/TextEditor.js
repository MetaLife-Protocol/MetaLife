/**
 * Created on 07 Mar 2022 by lonmee
 */

import React, {useLayoutEffect} from 'react';
import {SafeAreaView, View} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import MsgInput from '../../screens/tabs/messages/MsgInput';

const TextEditor = () => {
  const {FG, flex1} = SchemaStyles();
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
