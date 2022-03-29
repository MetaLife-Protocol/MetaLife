'use strict';

/**
 * @Author: lq
 * @Date:2022-03-28
 * @desc:
 */
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useStyle, useTheme} from '../../../shared/ThemeColors';
import TransactionRecordItem from './comps/TransactionRecordItem';
import {PhotonSeparator} from '../../../shared/comps/PhotonSeparator';

const RecordPhoton = () => {
  const styles = useStyle(createSty),
    theme = useTheme();

  return (
    <FlatList
      style={styles.container}
      data={[0, 1, 2, 3]}
      renderItem={() => <TransactionRecordItem />}
      ItemSeparatorComponent={() => (
        <PhotonSeparator style={{backgroundColor: theme.c_F0F0F0_000000}} />
      )}
      keyExtractor={(item, index) => `RecordPhoton${index}`}
    />
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.c_FFFFFF_111717,
      padding: 15,
    },
  });
export default RecordPhoton;
