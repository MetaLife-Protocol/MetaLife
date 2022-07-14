'use strict';

/**
 * @Author: Richard
 * @desc:
 */

import React, {useCallback} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from '../../../../shared/comps/ComText';
import {useStyle} from '../../../../metalife-base';

const tokens = [
  {
    title: 'SMT',
    icon: require('../../../../assets/image/nft/icon_nft_smt.png'),
  },
  {
    title: 'MESH',
    icon: require('../../../../assets/image/nft/icon_nft_mesh.png'),
  },
  {
    title: 'MLT',
    icon: require('../../../../assets/image/nft/icon_nft_mlt.png'),
  },
];
const PaymentTokensView = ({selectedToken = 'SMT', onSelect}) => {
  const styles = useStyle(createSty);
  const itemViews = useCallback(() => {
    return tokens.map(item => {
      const isSelect = selectedToken === item.title;
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
          <Image style={styles.icon} source={item.icon} />
          <Text>{item.title}</Text>
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
      height: 83,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#A5ABB7',
    },
  });
export default PaymentTokensView;
