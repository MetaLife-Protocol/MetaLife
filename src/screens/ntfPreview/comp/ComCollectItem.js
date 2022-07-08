import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../../shared/UseSchemaStyles';
const width = Dimensions.get('window').width;
const bg = require('../../../assets/image/profiles/Profiles_backgroud.png');
const btn = require('../../../assets/image/profiles/photo.png');
const ComCollectItem = () => {
  const {text, alignItemsCenter, justifyCenter, flex1, BG, FG} =
    useSchemaStyles();
  return (
    <View style={[styles.con, FG]}>
      <ImageBackground source={bg} style={styles.image}>
        <View style={styles.btnBg}>
          <FastImage source={btn} style={styles.imageBtn} />
        </View>
      </ImageBackground>
      <Text style={[text, styles.top]}>{'PXN:Ghost Division'}</Text>
      <Text style={styles.bottom}>Phantom</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  con: {
    width: width / 2 - 17.5,
    height: 186.5,
    borderRadius: 12,
    alignItems: 'center',
    margin: 5,
  },
  image: {
    width: 149.5,
    height: 89,
    marginTop: 10,
    borderRadius: 10,
  },
  imageBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  bottom: {
    color: '#8E8E92',
    textAlign: 'center',
    marginTop: 5,
  },
  top: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 28.5,
  },
  btnBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: -20,
    left: '40%',
    right: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    wallet: s.wallet,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(ComCollectItem);