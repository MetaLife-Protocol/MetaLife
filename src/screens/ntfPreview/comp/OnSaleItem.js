/**
 * @Author: amy
 * @Date: 2022-07-06
 */

import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, useWindowDimensions} from 'react-native';
import Text from '../../../shared/comps/ComText';
import useSchemaStyles from '../../../shared/UseSchemaStyles';
import FastImage from 'react-native-fast-image';
import {getNftAssetsJson, ipfsBaseURL} from '../../../remote/ipfsOP';
import {getNftItemInfo} from '../../../remote/contractOP';
// const gateways = 'metalife.mypinata.cloud';
// const ipfsBaseURL = `https://${gateways}/ipfs/`;

const OnSaleItem = ({item, index, symbol, isImage}) => {
  const windowWidth = useWindowDimensions().width;
  const {text, FG} = useSchemaStyles();

  const itemWidth = windowWidth / 2 - 15;
  const imageWidth = itemWidth - 18;
  const itemMargin =
    index % 2 === 0
      ? {marginLeft: 10, marginRight: 5}
      : {marginLeft: 5, marginRight: 10};
  const [info, setInfo] = useState({});
  useEffect(() => {
    getNftItemInfo(item.collection, item.token_id).then(res => {
      getNftAssetsJson(res).then(collInfo => {
        // console.log('ccccsss', collInfo);
        collInfo.headers['content-type'] === 'application/json' &&
          setInfo(collInfo.data);
      });
    });
  }, []);
  // console.log('ddddd', ipfsBaseURL + item.image.split('ipfs://')[1]);
  return (
    <View style={[styles.container, FG, {width: itemWidth}, itemMargin]}>
      <FastImage
        source={info?.image ? {uri: ipfsBaseURL + 'ipfs/' + info?.image} : null}
        style={[
          styles.img,
          {
            height: imageWidth,
            width: imageWidth,
          },
        ]}
        resizeMode="contain"
      />
      <Text style={styles.text1}>{`${info.name}`}</Text>
      <Text style={[text, styles.text2]}>{`#${item.token_id.toNumber()}`}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#0ff',
    padding: 9,
    borderRadius: 12,
    marginVertical: 5,
  },
  img: {
    borderRadius: 12,
  },
  text1: {
    color: '#8E8E92',
    fontSize: 11,
    lineHeight: 13,
    marginTop: 10,
  },
  text2: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 17,
    marginTop: 5,
  },
});
export default OnSaleItem;
