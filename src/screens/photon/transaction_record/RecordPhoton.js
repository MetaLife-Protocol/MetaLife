'use strict';

/**
 * @Author: lq
 * @Date:2022-03-28
 * @desc:
 */
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {EmptyView, PhotonSeparator, useStyle, useTheme} from 'metalife-base';
import TransactionRecordItem from './comps/TransactionRecordItem';
import {getSentTransfers} from 'react-native-photon';
import Toast from 'react-native-tiny-toast';

const RecordPhoton = () => {
  const styles = useStyle(createSty),
    theme = useTheme();
  const [listData, setListData] = useState([]);

  useEffect(() => {
    getSentTransfers()
      .then(res => {
        console.log('getSentTransfers res::', JSON.parse(res));
        const resJson = JSON.parse(res);
        if (resJson.error_code === 0) {
          setListData(resJson.data);
        } else {
          Toast.show(resJson.error_message);
        }
      })
      .catch(e => {
        Toast.show(e.toString());
      });
  }, []);

  return (
    <FlatList
      style={styles.container}
      data={listData}
      renderItem={() => <TransactionRecordItem data={null} />}
      ItemSeparatorComponent={() => (
        <PhotonSeparator style={{backgroundColor: theme.c_F0F0F0_000000}} />
      )}
      keyExtractor={(item, index) => `RecordPhoton${index}`}
      ListEmptyComponent={<EmptyView />}
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
