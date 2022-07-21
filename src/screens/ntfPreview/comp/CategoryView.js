'use strict';

/**
 * @Author: Richard
 * @desc:
 */

import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Text from '../../../shared/comps/ComText';
import useSchemaStyles from '../../../shared/UseSchemaStyles';

const CategoryView = () => {
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();
  return (
    <View style={[styles.container, FG]}>
      <Text style={[text, styles.addTitleText]}>Add category</Text>
      <Text style={styles.categoryType}>Artwork</Text>
      <Image
        style={styles.categoryTypeIcon}
        source={require('../../../assets/image/nft/nft_add_category_type.png')}
      />
      <Image
        style={styles.arrow}
        source={require('../../../assets/image/nft/arrow_down.png')}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 345,
    height: 65,
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 10,
    paddingHorizontal: 12,
  },
  addTitleText: {
    fontSize: 15,
    lineHeight: 18,
    flex: 1,
  },
  categoryType: {
    fontSize: 15,
    lineHeight: 18,
    color: '#8E8E92',
  },
  categoryTypeIcon: {width: 35, height: 35, marginLeft: 12},
  arrow: {width: 16, height: 16, marginLeft: 9},
});
export default CategoryView;
