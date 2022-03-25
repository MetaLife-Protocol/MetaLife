'use strict';

/**
 * @Author: lq
 * @Date:2022-03-25
 * @desc:
 */

import React, {useCallback, useLayoutEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useStyle} from '../../../../shared/ThemeColors';

const PhotonAccountInfoCard = ({style}) => {
  const styles = useStyle(createSty);

  useLayoutEffect(() => {}, []);

  const itemView = useCallback(
    (title, values, style) => {
      return (
        <View style={[styles.itemContainer, style]}>
          <Text style={styles.itemTitle}>{title}</Text>
          <View>
            {values.map((item, index) => {
              return (
                <Text
                  style={[styles.itemValue, {marginTop: index ? 7 : 0}]}
                  key={index + '_unit'}>
                  {item.valueNumber}
                  {!!item.valueUnit && (
                    <Text style={styles.unit}>{' ' + item.valueUnit}</Text>
                  )}
                </Text>
              );
            })}
          </View>
        </View>
      );
    },
    [styles],
  );

  return (
    <View style={[styles.container, style]}>
      {itemView('Aries', [{valueNumber: '0xcC5D33d…0805810'}])}
      {itemView(
        'On-chain balance',
        [
          {valueNumber: '5140.00', valueUnit: 'SMT'},
          {
            valueNumber: '5140.00',
            valueUnit: 'MESH',
          },
        ],
        styles.marginTop20,
      )}
      {itemView(
        'Channel total balance',
        [
          {valueNumber: '5140.00', valueUnit: 'SMT'},
          {
            valueNumber: '5140.00',
            valueUnit: 'MESH',
          },
        ],
        styles.marginTop20,
      )}
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      marginHorizontal: 16,
      backgroundColor: theme.c_FFFFFF_111717,
      padding: 15,
      borderRadius: 12,
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    itemTitle: {fontSize: 15, color: theme.primary},
    itemValue: {fontSize: 15, color: theme.c_000000_FFFFFF},
    unit: {color: '#8E8E92'},
    marginTop20: {marginTop: 20},
  });
export default PhotonAccountInfoCard;
