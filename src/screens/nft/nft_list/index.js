'use strict';

/**
 * @Author: lq
 * @Date: 2022-05-24
 * @Project:MetaLife
 */

import React, {useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import NFTListItem from './comps/NFTListItem';

const NFTList = ({}) => {
  const renderItem = useCallback(() => {
    return <NFTListItem />;
  }, []);

  return (
    <SafeAreaView>
      <FlatList
        contentContainerStyle={{marginHorizontal: 10}}
        data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={(item, index) => index + '_'}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {},
});
export default NFTList;
