'use strict';

/**
 * @Author: lq
 * @Date: 2022-06-15
 * @Project:MetaLife
 */

import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useStyle} from 'metalife-base';

const NFTDetailNew = ({}) => {
  const styles = useStyle(styleFun);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <Image
            style={styles.img}
            // source={require('../../../assets/image/guid/guid.png')}
            source={{
              uri: 'https://gateway.pinata.cloud/ipfs/QmXbUmdTwnb93HfFHiDYuAEkUNp28N1gjFZ4bg5c2Wv6wH',
            }}
          />
          <Text style={styles.permission}>Permissionless Gallery</Text>
          <Text style={styles.nameText}>Ghost #2037</Text>
          <Text style={styles.discText}>
            The underbelly of Web3. A shadow vague, formless, but eternal.The
            underbelly of Web3.The underbelly of{' '}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styleFun = theme =>
  StyleSheet.create({
    container: {},
    contentContainer: {
      backgroundColor: theme.c_FFFFFF_000000,
      marginTop: 10,
      padding: 15,
      width: '100%',
      // alignItems: 'center',
    },
    img: {
      width: 345,
      height: 345,
      borderRadius: 12,
      marginTop: 15,
    },
    permission: {
      fontSize: 14,
      color: theme.primary,
      marginTop: 20,
      lineHeight: 17,
    },
    nameText: {
      fontSize: 16,
      color: theme.c_000000_FFFFFF,
      marginTop: 5,
      lineHeight: 19,
      fontWeight: 'bold',
    },
    discText: {
      fontSize: 14,
      color: theme.c_000000_FFFFFF,
      marginTop: 5,
      lineHeight: 17,
    },
  });
export default NFTDetailNew;
