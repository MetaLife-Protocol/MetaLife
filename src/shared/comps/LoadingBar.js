/**
 * Created on 30 Mar 2022 by lonmee
 */
import {ActivityIndicator, Text, View} from 'react-native';
import React from 'react';
import useSchemaStyles from '../UseSchemaStyles';

const LoadingBar = ({loaded, style}) => {
  const {row, text, alignItemsCenter} = useSchemaStyles();
  return (
    <View style={[row, alignItemsCenter, ...style]}>
      <ActivityIndicator size={'small'} animating={loaded < 1} />
      <Text style={[text]}>{loaded}</Text>
    </View>
  );
};

export default LoadingBar;
