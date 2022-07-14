'use strict';

/**
 * @Author: Richard
 * @desc:
 */

import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Text from '../../../../shared/comps/ComText';
import {useStyle} from '../../../../metalife-base';

const CategoryView = () => {
  const styles = useStyle(createSty);

  return (
    <View style={styles.container}>
      <Text style={styles.addTitleText}>Add category</Text>
      <Text style={styles.categoryType}>Artwork</Text>
      <Image
        style={styles.categoryTypeIcon}
        source={require('../../../../assets/image/nft/nft_add_category_type.png')}
      />
      <Image
        style={styles.arrow}
        source={require('../../../../assets/image/nft/arrow_down.png')}
      />
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: 345,
      height: 65,
      alignItems: 'center',
      backgroundColor: theme.c_FFFFFF_111717,
      borderRadius: 12,
      marginTop: 10,
      paddingHorizontal: 12,
    },
    addTitleText: {
      fontSize: 15,
      lineHeight: 18,
      color: theme.c_000000_FFFFFF,
      flex: 1,
    },
    categoryType: {
      fontSize: 15,
      lineHeight: 18,
      color: theme.c_8E8E92,
    },
    categoryTypeIcon: {width: 35, height: 35, marginLeft: 12},
    arrow: {width: 16, height: 16, marginLeft: 9},
  });
export default CategoryView;
