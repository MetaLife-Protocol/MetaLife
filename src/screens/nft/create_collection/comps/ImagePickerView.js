'use strict';

/**
 * @Author: Richard
 * @desc:
 */

import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useStyle} from 'metalife-base';

const ImagePickerView = ({style}) => {
  const styles = useStyle(createSty);

  return (
    <TouchableOpacity style={styles.container}>
      <Image
        source={require('../../../../assets/image/nft/nft_add_icon.png')}
        style={styles.addIcon}
      />
    </TouchableOpacity>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.c_FFFFFF_111717,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addIcon: {width: 30, height: 30},
  });
export default ImagePickerView;
