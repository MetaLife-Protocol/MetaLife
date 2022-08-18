'use strict';

import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Text from '../../../shared/comps/ComText';
import useSchemaStyles from '../../../shared/UseSchemaStyles';
const star = require('../../../assets/image/nft/star.png');
const TitleAndTips = ({title = '', tips = '', rightView, isStar = false}) => {
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();
  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={[text, styles.title]}>{title}</Text>

          {isStar ? <Image source={star} style={styles.stars} /> : null}
          {/*<View style={{height: 30}} />*/}
        </View>
        {!!tips && <Text style={styles.tipsText}>{tips}</Text>}
      </View>
      <View>{rightView}</View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 19,
    marginTop: 20,
  },
  tipsText: {
    fontSize: 14,
    color: '#8E8E92',
    lineHeight: 17,
    marginTop: 10,
  },
  stars: {
    // position: 'absolute',
    marginTop: 20,
    // marginBottom: 10,
  },
});
export default TitleAndTips;
