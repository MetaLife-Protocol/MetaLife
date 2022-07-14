import {StyleSheet, View} from 'react-native';
import Text from '../../shared/comps/ComText';
import React from 'react';
import useSchemaStyles, {colorsSchema} from '../UseSchemaStyles';

/**
 * Created on 08 Nov 2021 by lonmee
 */
const ControllerItem = ({children, title}) => {
  const {row, alignItemsCenter} = useSchemaStyles(),
    {textHolder} = colorsSchema,
    {titleFont} = styles;
  return (
    <View
      style={[
        row,
        alignItemsCenter,
        {justifyContent: 'space-between', paddingHorizontal: 20},
      ]}>
      {title && (
        <Text numberOfLines={1} style={[{color: textHolder}, titleFont]}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  titleFont: {
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
});

export default ControllerItem;
