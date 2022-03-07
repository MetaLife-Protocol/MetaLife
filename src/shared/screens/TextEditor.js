/**
 * Created on 07 Mar 2022 by lonmee
 */

import React, {useLayoutEffect, useRef} from 'react';
import {SafeAreaView, View} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';

const TextEditor = ({
  navigation,
  route: {
    params: {title},
  },
}) => {
  const {FG, flex1} = SchemaStyles();

  useLayoutEffect(() => {
    navigation.setOptions({title});
  }, [navigation]);

  return (
    <SafeAreaView style={[flex1]}>
      <View style={FG} />
    </SafeAreaView>
  );
};

export default TextEditor;
