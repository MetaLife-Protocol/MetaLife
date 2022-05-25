'use strict';

/**
 * @Author: lq
 * @Date: 2022-05-25
 * @Project:MetaLife
 */

import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {EmptyView, PhotonSeparator, useStyle, useTheme} from 'metalife-base';
import MyNFTListItem from './comps/MyNFTListItem';

const MyNFTListView = ({}) => {
  const styles = useStyle(createSty),
    theme = useTheme();

  return (
    <FlatList
      style={styles.container}
      data={[0, 1, 2, 3]}
      renderItem={({item}) => <MyNFTListItem data={item} />}
      ItemSeparatorComponent={() => (
        <PhotonSeparator style={{backgroundColor: theme.c_F0F0F0_000000}} />
      )}
      keyExtractor={(item, index) => `MyNFTListView_${index}`}
      ListEmptyComponent={<EmptyView />}
    />
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {},
  });
export default MyNFTListView;
