'use strict';

/**
 * @Author: lq
 * @Date:2022-03-28
 * @desc:
 */
import React, {useCallback} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {
  EmptyView,
  PhotonSeparator,
  useStyle,
  useTheme,
} from '../../../metalife-base';
import {useRecordPhotonData} from './hooks';
import RecordItem from './comps/RecordItem';

const RecordPhoton = () => {
  const styles = useStyle(createSty),
    theme = useTheme();
  const listData = useRecordPhotonData();

  const stateDisplay = useCallback(item => {
    let state;
    switch (item.status) {
      case 3:
        state = 'Transfer Success';
        break;
      case 4:
        state = 'Transfer Cancel';
        break;
      case 5:
        state = 'Transfer Failed';
        break;
      default:
        state = 'Transferring';
        break;
    }
    return state;
  }, []);

  return (
    <FlatList
      style={styles.container}
      data={listData}
      renderItem={({item, index}) => (
        <RecordItem
          address={item.address}
          amount={item.type === 'send' ? item.amount * -1 : item.amount}
          time={item.time}
          stateDisplay={stateDisplay(item)}
          StateColor={undefined}
          token_address={item.token_address}
        />
      )}
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
