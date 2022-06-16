'use strict';

/**
 * @Author: lq
 * @Date: 2022-06-16
 * @Project:MetaLife
 */

import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {useStyle} from 'metalife-base';

const CollectionView = ({}) => {
  const styles = useStyle(styleFun);
  return (
    <>
      <View style={[styles.row, {marginTop: 20}]}>
        <Image
          style={styles.collectImg}
          source={require('../../../../assets/image/nft/icon_nft_mesh.png')}
        />
        <Text style={styles.nameText}>Name</Text>
      </View>
      <Text style={styles.descText}>
        Chimpers are a collection of 5,555 generative NFT pixel characters
        created by @TimpersHD. Chimpers are your digital identity for the
        Chimpverse and your passport to adventure. !CHIMP
      </Text>
    </>
  );
};
const styleFun = theme =>
  StyleSheet.create({
    container: {},
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    collectImg: {
      width: 40,
      height: 40,
    },
    nameText: {
      fontSize: 16,
      lineHeight: 19,
      color: theme.primary,
      marginLeft: 10,
    },
    descText: {
      fontSize: 14,
      lineHeight: 17,
      color: theme.c_8E8E92,
      marginTop: 10,
    },
  });
export default CollectionView;
