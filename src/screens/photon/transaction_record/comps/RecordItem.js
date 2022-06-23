'use strict';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ethNumberFixed, formatDate, useStyle} from 'metalife-base';
import Constants from '../../../../shared/Constants';

const RecordItem = ({amount, stateColor, stateDisplay, time, address}) => {
  const styles = useStyle(createSty);
  return (
    <View style={styles.container}>
      <View style={[styles.tabsContainer, styles.row]}>
        <Text style={[styles.tabTitle, styles.firstFlex]}>Quantity</Text>
        <Text style={[styles.tabTitle, styles.secondFlex]}>State</Text>
        <Text style={[styles.tabTitle, styles.thirdFlex]}>Time</Text>
      </View>
      <View style={[styles.valueContainer, styles.row]}>
        <Text style={[styles.tabValue, styles.firstFlex]}>
          {amount >= 0 ? '+' : ''}
          {ethNumberFixed(amount ?? 0)} SMT
        </Text>
        <Text style={[styles.tabValue, styles.secondFlex, {color: stateColor}]}>
          {stateDisplay}
        </Text>
        <Text style={[styles.tabValue, styles.thirdFlex]}>
          {formatDate({time: time ?? 0, format: 'hh:mm MM-DD'})}
        </Text>
      </View>
      <Text style={styles.address} numberOfLines={1} ellipsizeMode={'middle'}>
        Partner:{address ?? ''}
      </Text>
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {paddingVertical: 15},
    stateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    transfer: {
      fontSize: 16,
      lineHeight: 23,
      color: theme.c_000000_FFFFFF,
      fontWeight: Constants.bold,
    },
    transferState: {
      fontSize: 15,
      lineHeight: 21,
      color: theme.primary,
    },
    tabsContainer: {
      marginTop: 22,
    },
    valueContainer: {
      marginTop: 10,
    },
    tabTitle: {fontSize: 14, lineHeight: 17, color: theme.c_8E8E92},
    firstFlex: {
      flex: 160,
    },
    secondFlex: {
      flex: 150,
    },
    thirdFlex: {
      flex: 130,
      textAlign: 'right',
    },
    tabValue: {
      fontSize: 14,
      lineHeight: 17,
      color: theme.c_000000_FFFFFF,
    },
    address: {
      fontSize: 14,
      lineHeight: 17,
      color: theme.c_4E586E,
      marginTop: 8,
    },
  });
export default RecordItem;
