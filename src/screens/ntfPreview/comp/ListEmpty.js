import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import {pxToDp} from '../../../utils';
import {connect} from 'react-redux/lib/exports';
const dark = require('../../../assets/image/nft/dark_empty.png');
const white = require('../../../assets/image/nft/white_empty.png');

const ListEmpty = ({darkMode}) => {
  return (
    <View style={styles.con}>
      <FastImage source={darkMode ? dark : white} style={styles.image} />
      <Text style={styles.noText}>No data</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    marginTop: pxToDp(60),
    alignItems: 'center',
  },
  image: {
    width: pxToDp(138),
    height: pxToDp(138),
  },
  noText: {color: '#8E8E92', fontSize: 15},
});

const msp = s => {
  return {
    darkMode: s.cfg.darkMode,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(ListEmpty);
