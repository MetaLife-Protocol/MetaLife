'use strict';

/**
 * @Author: Richard
 * @desc:
 */

import React, {useCallback} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useStyle} from '../../../../metalife-base';

const tokens = [
  {
    title: 'Padded',
    icon: require('../../../../assets/image/nft/icon_nft_display_theme_show.png'),
  },
  {
    title: 'Contained',
    icon: require('../../../../assets/image/nft/icon_nft_display_theme_show.png'),
  },
  {
    title: 'Covered',
    icon: require('../../../../assets/image/nft/icon_nft_display_theme_show.png'),
  },
];
const DisplayThemeView = ({selectedToken = 'Padded', onSelect}) => {
  const styles = useStyle(createSty);
  const itemViews = useCallback(() => {
    return tokens.map(item => {
      const isSelect = selectedToken === item.title;
      let width, height;
      switch (item.title) {
        case 'Padded':
          width = '80%';
          height = '80%';
          break;
        case 'Contained':
          width = '100%';
          height = '80%';
          break;
        case 'Covered':
          width = '100%';
          height = '100%';
          break;
      }
      return (
        <TouchableOpacity
          key={item.title}
          onPress={() => {
            onSelect && onSelect(item.title);
          }}
          style={[
            styles.itemContainer,
            {backgroundColor: isSelect ? '#A5ABB7' : undefined},
          ]}>
          <View style={styles.imgContainer}>
            <View style={[{width: width, height: height}, styles.center]}>
              <Image style={styles.icon} source={item.icon} />
            </View>
          </View>

          <View style={[styles.titleContainer]}>
            <Text>{item.title}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  }, [onSelect, selectedToken, styles.icon, styles.itemContainer]);

  return <View style={styles.container}>{itemViews()}</View>;
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
      justifyContent: 'space-between',
    },
    icon: {width: 40, height: 40},
    itemContainer: {
      width: 108,
      height: 154,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#A5ABB7',
      overflow: 'hidden',
    },
    imgContainer: {
      width: 108,
      height: 108,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      backgroundColor: theme.c_F8F9FD_000000,
      borderWidth: 1,
      borderColor: '#A5ABB7',
      position: 'absolute',
      top: -1,
    },
    titleContainer: {
      height: 46,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      position: 'absolute',
      bottom: 0,
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.c_FFFFFF_111717,
    },
  });
export default DisplayThemeView;
