/**
 * @Author: lq
 * @Date: 2022-03-18
 * @Project:MetaLife
 */
'use strict';
import React, {memo} from 'react';
import {SchemaStyles} from 'metalife-base';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const SelectDialog = ({visible = false, listData = [], style, onPress}) => {
  const {text, dialogBg} = SchemaStyles(),
    {container, itemText} = styles;

  if (!visible) {
    return null;
  }
  return (
    <View style={[dialogBg, container, style]}>
      {!!listData &&
        listData.map((item, index) => {
          return (
            <TouchableOpacity
              key={`index_${index}`}
              onPress={() => {
                onPress && onPress(item);
              }}>
              <Text style={[itemText, text]}>{item}</Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 15,
    right: 15,
    top: 47,
    borderRadius: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 16,
    lineHeight: 19,
    marginVertical: 10,
  },
});

export default memo(SelectDialog);
