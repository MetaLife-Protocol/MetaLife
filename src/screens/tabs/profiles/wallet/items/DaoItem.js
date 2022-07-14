import React from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '../../../../../shared/comps/ComText';
import useSchemaStyles, {
  colorsBasics,
} from '../../../../../shared/UseSchemaStyles';

const DaoItem = ({title}) => {
  const {BG, row, justifySpaceBetween, alignItemsCenter, text} =
    useSchemaStyles();
  return (
    <>
      <View
        style={[row, justifySpaceBetween, alignItemsCenter, styles.container]}>
        <Text style={[text, styles.type]}>{title}</Text>
        <Text style={[text, styles.total]}>0</Text>
      </View>
      <View style={[styles.line, BG]} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: 15,
  },
  type: {
    color: colorsBasics.primary,
    fontSize: 15,
  },
  total: {
    fontSize: 15,
  },
  line: {
    height: 1,
    marginHorizontal: 15,
  },
});

export default DaoItem;
