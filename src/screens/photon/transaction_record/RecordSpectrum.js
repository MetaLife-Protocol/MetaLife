'use strict';

/**
 * @Author: lq
 * @Date:2022-03-28
 * @desc:
 */
import React from 'react';

import {FlatList, StyleSheet} from 'react-native';
import {
  EmptyView,
  PhotonSeparator,
  useStyle,
  useTheme,
} from '../../../metalife-base';
import TransactionRecordItem from './comps/TransactionRecordItem';
import {useContractCallTxQuery} from './hooks';

const RecordSpectrum = () => {
  const styles = useStyle(createSty),
    theme = useTheme();
  const [listData] = useContractCallTxQuery();
  console.log('RecordSpectrum listData:::', listData);
  return (
    <FlatList
      style={styles.container}
      data={listData}
      renderItem={({item}) => <TransactionRecordItem data={item} />}
      ItemSeparatorComponent={() => (
        <PhotonSeparator style={{backgroundColor: theme.c_F0F0F0_000000}} />
      )}
      keyExtractor={(item, index) => `RecordPhoton_${item.call_time}`}
      ListEmptyComponent={<EmptyView />}
    />
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.c_FFFFFF_111717,
      paddingHorizontal: 15,
    },
  });
export default RecordSpectrum;
