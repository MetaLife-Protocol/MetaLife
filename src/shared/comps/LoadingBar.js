/**
 * Created on 30 Mar 2022 by lonmee
 */
import {ActivityIndicator, Text, View} from 'react-native';
import React from 'react';
import SchemaStyles from '../SchemaStyles';

const LoadingBar = ({loaded, style}) => {
  const {row, text, alignItemsCenter} = SchemaStyles();
  return (
    <View style={[row, alignItemsCenter, ...style]}>
      <ActivityIndicator size={'small'} animating={loaded < 1} />
      <Text style={[text]}>{loaded}</Text>
    </View>
  );
};

export default LoadingBar;
