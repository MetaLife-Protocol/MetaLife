'use strict';

/**
 * @Author: lq
 * @Date: 2022-05-25
 * @Project:MetaLife
 */

import React, {useState} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {useStyle} from '../../../../metalife-base';
import Constants from '../../../../shared/Constants';

const NFTListItem = ({}) => {
  const styles = useStyle(styleFun);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/image/nft/create_nft_add.png')}
        style={styles.img}
      />
      <Text style={styles.text1}>Permissionless Gallery</Text>
      <Text style={styles.text2}>julie pacino:Aroud the bend</Text>
      <View style={styles.priceContainer}>
        <Image
          source={require('../../../../assets/image/contacts/nft_icon.png')}
          style={styles.userImg}
        />
        <Text style={styles.priceText}>32721.21</Text>
      </View>
    </View>
  );
};
const styleFun = theme =>
  StyleSheet.create({
    container: {
      width: Constants.screenWidth / 2 - 20,
      marginHorizontal: 5,
      alignItems: 'center',
      marginTop: 10,
      backgroundColor: theme.c_FFFFFF_111717,
      borderRadius: 12,
      padding: 9,
    },
    img: {
      width: 150,
      height: 150,
      resizeMode: 'contain',
    },
    text1: {
      fontSize: 11,
      color: theme.c_8E8E92,
      marginTop: 15,
      lineHeight: 13,
      textAlign: 'left',
      width: '100%',
    },
    text2: {
      fontSize: 13,
      color: theme.c_000000_FFFFFF,
      marginTop: 5,
      lineHeight: 16,
      textAlign: 'left',
      width: '100%',
      fontWeight: 'bold',
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
      width: '100%',
    },
    userImg: {
      width: 22,
      height: 22,
      borderRadius: 11,
    },
    priceText: {
      fontSize: 16,
      color: theme.c_000000_FFFFFF,
      lineHeight: 19,
      fontWeight: 'bold',
      marginLeft: 5,
    },
  });
export default NFTListItem;
