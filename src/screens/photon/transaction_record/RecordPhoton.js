'use strict';

/**
 * @Author: lq
 * @Date:2022-03-28
 * @desc:
 */
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useStyle} from '../../../shared/ThemeColors';
import TransactionRecordItem from './comps/TransactionRecordItem';

const RecordPhoton = () => {
  const styles = useStyle(createSty);

  return (
    <FlatList
      style={styles.container}
      data={[0, 1]}
      renderItem={() => <TransactionRecordItem />}
    />
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.c_F8F9FD_000000,
      margin: 15,
    },
  });
export default RecordPhoton;
