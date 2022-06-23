'use strict';

/**
 * @Author: lq
 * @Date: 2022-06-16
 * @Project:MetaLife
 */

import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {useStyle} from 'metalife-base';

const PropertiesView = ({properties, style}) => {
  const styles = useStyle(styleFun);
  return (
    <View style={[styles.propertiesContentContainer, style]}>
      {properties.map((item, index) => {
        return (
          <View
            key={item.type + item.name + index}
            style={[
              styles.propertiesItemContainer,
              index !== properties.length - 1
                ? {borderBottomWidth: 1, borderBottomColor: '#A5ABB7'}
                : {},
            ]}>
            <Text style={styles.propertiesType}>{item.type}</Text>
            <Text style={styles.propertiesName}>{item.name}</Text>
          </View>
        );
      })}
    </View>
  );
};
const styleFun = theme =>
  StyleSheet.create({
    propertiesContentContainer: {
      borderWidth: 1,
      borderColor: '#A5ABB7',
      borderRadius: 12,
    },
    propertiesItemContainer: {
      padding: 10,
    },
    propertiesType: {
      fontSize: 14,
      color: theme.c_8E8E92,
      lineHeight: 17,
    },
    propertiesName: {
      fontSize: 15,
      color: theme.c_000000_FFFFFF,
      lineHeight: 18,
    },
  });
export default PropertiesView;
