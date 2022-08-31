'use strict';

/**
 * @Author: Richard
 * @desc:
 */

import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import Text from '../../../shared/comps/ComText';
import useSchemaStyles from '../../../shared/UseSchemaStyles';
import {screenWidth} from '../../../utils';

const CategoryView = ({onClickItem, name, headImg}) => {
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();
  return (
    <View style={[styles.container, FG]}>
      <Text style={[text, styles.addTitleText]}>Add category</Text>
      <Text style={styles.categoryType}>{name || 'Artwork'}</Text>
      <Pressable
        onPress={onClickItem}
        style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={styles.categoryTypeIcon}
          source={
            headImg ||
            require('../../../assets/image/nft/nft_add_category_type.png')
          }
        />
        <Image
          style={styles.arrow}
          source={require('../../../assets/image/nft/arrow_down.png')}
        />
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: screenWidth - 50,
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
