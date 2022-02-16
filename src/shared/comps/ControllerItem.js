import {Text, View} from 'react-native';
import React from 'react';
import SchemaStyles from '../SchemaStyles';

/**
 * Created on 08 Nov 2021 by lonmee
 */
const ControllerItem = ({children, title}) => {
  const {row, alignItemsCenter, text} = SchemaStyles();
  return (
    <View
      style={[
        row,
        alignItemsCenter,
        {justifyContent: 'space-between', paddingHorizontal: 20},
      ]}>
      <Text style={[text]}>{title}</Text>
      {children}
    </View>
  );
};

export default ControllerItem;
