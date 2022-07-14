'use strict';

/**
 * @Author: lq
 * @Date: 2022-05-25
 * @Project:MetaLife
 */

import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import Text from '../../../../shared/comps/ComText';
import {useStyle} from '../../../../metalife-base';

const MyNFTListItem = ({}) => {
  const styles = useStyle(createFun);
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/image/contacts/nft_icon.png')}
        style={styles.img}
      />
      <Text style={styles.text}>CloneX #16655</Text>
    </View>
  );
};
const createFun = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 15,
    },
    img: {width: 60, height: 60, borderRadius: 4},
    text: {
      fontSize: 16,
      color: theme.c_000000_FFFFFF,
      marginLeft: 10,
      lineHeight: 19,
    },
  });
export default MyNFTListItem;
