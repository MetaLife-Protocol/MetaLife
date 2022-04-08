'use strict';

/**
 * @Author: lq
 * @desc:
 */

import React from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {useStyle} from 'metalife-base';
import AddressContactItem from './comps/AddressContactItem';

const PhotonAddressContact = () => {
  const styles = useStyle(createSty);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pageContainer}>
        <FlatList
          data={[0, 1, 3]}
          renderItem={(item, index) => <AddressContactItem />}
        />
      </View>
    </SafeAreaView>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.c_F8F9FD_000000,
    },
    pageContainer: {
      marginTop: 10,
      flex: 1,
      backgroundColor: theme.c_FFFFFF_111717,
      paddingHorizontal: 15,
    },
  });
export default PhotonAddressContact;
