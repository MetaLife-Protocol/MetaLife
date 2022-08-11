import React, {useEffect, useState} from 'react';
import {
  // Text,
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import Text from '../../../shared/comps/ComText';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../../shared/UseSchemaStyles';
import {getNFTInfos, getNftItemInfo} from '../../../remote/contractOP';
import {getNftAssetsJson, ipfsBaseURL} from '../../../remote/ipfsOP';
const width = Dimensions.get('window').width;
const bg = require('../../../assets/image/nft/collection_bg.png');
const btn = require('../../../assets/image/nft/tiny_head.png');
const ComCollectItem = ({item}) => {
  const {text, alignItemsCenter, justifyCenter, flex1, BG, FG} =
    useSchemaStyles();
  const [info, setInfo] = useState({});
  useEffect(() => {
    getNftItemInfo(item.collection, item.token_id).then(res => {
      getNftAssetsJson(res).then(collInfo => {
        console.log('ccccsss', collInfo);
        collInfo.headers['content-type'] === 'application/json' &&
          setInfo(collInfo.data);
      });
    });
  }, []);
  return (
    <View style={[styles.con, FG]}>
      <ImageBackground
        source={info?.image ? {uri: ipfsBaseURL + 'ipfs/' + info?.image} : bg}
        style={[styles.image]}>
        <View style={styles.btnBg}>
          <FastImage source={btn} style={styles.imageBtn} />
        </View>
      </ImageBackground>
      <Text style={[text, styles.top]}>{info.name || 'GGT'}</Text>
      {/*<Text style={styles.bottom}>{item.name || 'Genesis GWEITEST'}</Text>*/}
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
    // borderWidth: 1,
  },
  imageBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
