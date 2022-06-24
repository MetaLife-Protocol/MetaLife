import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SchemaStyles, {colorsSchema} from '../SchemaStyles';

/**
 * Created on 08 Nov 2021 by lonmee
 */
const ControllerItem = ({children, title}) => {
  const {row, alignItemsCenter} = SchemaStyles(),
    {textHolder} = colorsSchema,
    {titleFont} = styles;
  return (
    <View
      style={[
        row,
        alignItemsCenter,
        {justifyContent: 'space-between', paddingHorizontal: 20},
      ]}>
      <Text style={[{color: textHolder}, titleFont]}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  titleFont: {
    width: '80%',
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
});

export default ControllerItem;
