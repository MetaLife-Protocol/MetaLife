import React, {useCallback, useEffect, useState, useLayoutEffect} from 'react';
import {
  // Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Text from '../../shared/comps/ComText';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux/lib/exports';
import {
  fixWalletAddress,
  getCurrentAccount,
  nftreviationAccount,
  pxToDp,
  screenWidth,
} from '../../utils';
import useSchemaStyles, {colorsBasics} from '../../shared/UseSchemaStyles';
import {getNftAssetsJson, ipfsBaseURL} from '../../remote/ipfsOP';
import {getNftItemInfo} from '../../remote/contractOP';
import HeaderRightBtn from '../tabs/HeaderRightBtn';
const bg = require('../../assets/image/profiles/Profiles_backgroud.png');
const btn = require('../../assets/image/profiles/photo.png');
const down = require('../../assets/image/nft/arrow_down.png');
const uparr = require('../../assets/image/nft/up_arrow.png');
const shareB = require('../../assets/image/nft/transfer_white.png');
const shareW = require('../../assets/image/nft/transfer_black.png');

const MyItemDetailView = ({route: {params}, wallet, navigation, darkMode}) => {
  const {tokenId, address} = params;
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();
  const [isShow, setIsShow] = useState([false]);
  const [list, setList] = useState({});
  const downPress = useCallback(() => {
    setIsShow(!isShow);
  }, [isShow]);
  const [isDetail, setIsDetail] = useState([false]);
  const upPress = useCallback(() => {
    setIsDetail(!isDetail);
  }, [isDetail]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: props => (
        <HeaderRightBtn
          btnIcon={darkMode ? shareB : shareW}
          btnHandler={() => {
            // !searching && setTipVisible(true);
            navigation.navigate('TransferView', {
              tokenId: tokenId,
              collectAddress: address,
              image: ipfsBaseURL + 'ipfs/' + list?.image,
              name: list?.name,
            });
          }}
        />
      ),
    });
  }, [navigation, address, list]);

  useEffect(() => {
    getNftItemInfo(address, tokenId).then(res => {
      console.log('rrrrrttt', res, address, tokenId);
      if (res) {
        getNftAssetsJson(res).then(da => {
          console.log('dddddddd', da);
          setList(da.data);
        });
      }
    });
  }, []);

  return (
    <ScrollView style={[flex1, BG]} showsVerticalScrollIndicator={false}>
      <FastImage
        source={{
          uri: ipfsBaseURL + 'ipfs/' + list?.image,
        }}
        style={[styles.topImg]}
        resizeMode="contain"
      />
      <View style={[FG, styles.topView]}>
        <Text
          style={{
            color: colorsBasics.primary,
          }}>{`${list?.name}`}</Text>
        {/*<Text style={[text, styles.bend]}>{'julie pacino:Aroud the bend'}</Text>*/}
        {/*<Text style={[text, styles.under]}>*/}
        {/*  {'The underbelly of Web3.A shadow wague,formless, but eternal'}*/}
        {/*</Text>*/}
        <View style={styles.rowView}>
          <FastImage source={btn} style={styles.headImg} />
          <Text style={styles.create}>{'Created by'}</Text>
          <Text style={[styles.textWork]}>
            {nftreviationAccount(list?.create, 6, 4)}
          </Text>
        </View>
        {/*<View style={styles.rowView}>*/}
        {/*  <FastImage source={btn} style={styles.headImg} />*/}
        {/*  <Text style={styles.create}>{'Owned by'}</Text>*/}
        {/*  <Text style={[styles.textWork]}>*/}
        {/*    {nftreviationAccount(list?.ownerOf, 6, 4)}*/}
        {/*  </Text>*/}
        {/*</View>*/}
      </View>
      <View style={[FG, styles.collectTop]}>
        <View style={styles.itemView}>
          <Text style={[text, styles.bend]}>About Collection</Text>
          <TouchableOpacity style={styles.downView} onPress={downPress}>
            <Image source={isShow ? uparr : down} style={styles.arrImg} />
          </TouchableOpacity>
        </View>
        <View style={styles.line} />
        {isShow ? (
          <>
            <View style={styles.ghRow}>
              <Image source={btn} style={styles.ghImg} />
              <Text style={styles.ghText}>{`${list?.name}`}</Text>
            </View>
            <Text style={styles.ghDetail}>{list?.description}</Text>
          </>
        ) : null}
        <View style={styles.line} />
        <View style={[styles.itemView]}>
          <Text style={[text, styles.bend]}>Details</Text>
          <TouchableOpacity style={styles.downView} onPress={upPress}>
            <Image source={isDetail ? uparr : down} style={styles.arrImg} />
          </TouchableOpacity>
        </View>
        <View style={styles.line} />
        {isDetail ? (
          <>
            <View style={styles.detailItem}>
              <Text style={[text, styles.comText]}>Contract Address</Text>
              <Text style={styles.address}>
                {nftreviationAccount(address, 6, 4)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[text, styles.comText]}>Token ID</Text>
              <Text style={styles.tokenText}>{tokenId}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[text, styles.comText]}>Token Standard</Text>
              <Text style={styles.tokenText}>ERC-721</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[text, styles.comText]}>Blockchain</Text>
              <Text style={styles.tokenText}>Spectrum</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[text, styles.comText]}>Creator Fees</Text>
              <Text style={styles.tokenText}>{list?.earning + '%'}</Text>
            </View>
          </>
        ) : null}
        <View style={styles.bottom} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topImg: {
    width: '90%',
    // minHeight: 260,
    height: 345,
    alignSelf: 'center',
  },
  topView: {
    paddingHorizontal: pxToDp(15),
    paddingVertical: pxToDp(10),
    marginTop: pxToDp(10),
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: pxToDp(15),
  },
  create: {
    color: '#8E8E92',
    fontSize: 14,
    marginLeft: pxToDp(11),
  },
  headImg: {
    width: pxToDp(30),
    height: pxToDp(30),
    borderRadius: pxToDp(15),
  },
  textWork: {
    fontSize: 14,
    color: colorsBasics.primary,
    marginLeft: pxToDp(5),
    maxWidth: 250,
  },
  bend: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemView: {
    height: pxToDp(54),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: pxToDp(15),
  },
  line: {
    width: screenWidth,
    height: pxToDp(1),
    backgroundColor: colorsBasics.black,
  },
  collectTop: {
    marginTop: pxToDp(10),
  },
  arrImg: {
    width: pxToDp(12),
    height: pxToDp(7.5),
  },
  under: {
    fontSize: 14,
  },
  ghImg: {
    width: pxToDp(40),
    height: pxToDp(40),
    borderRadius: pxToDp(20),
  },
  ghText: {
    color: colorsBasics.primary,
    fontSize: 16,
    marginLeft: pxToDp(10.5),
  },
  ghRow: {
    flexDirection: 'row',
    paddingHorizontal: pxToDp(15),
    alignItems: 'center',
    marginTop: pxToDp(20),
  },
  ghDetail: {
    color: '#8E8E92',
    fontSize: 14,
    paddingHorizontal: pxToDp(15),
    marginTop: pxToDp(10.5),
    marginBottom: pxToDp(20),
  },
  downView: {
    width: pxToDp(20),
    height: pxToDp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  address: {
    fontSize: 15,
    color: colorsBasics.primary,
    maxWidth: 250,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: pxToDp(38),
    alignItems: 'center',
    paddingHorizontal: pxToDp(15),
  },
  tokenText: {
    color: '#8E8E92',
    fontSize: 15,
  },
  comText: {
    fontSize: 15,
  },
  bottom: {
    height: pxToDp(20),
  },
});

const msp = s => {
  return {
    darkMode: s.cfg.darkMode,
    feedId: s.user.feedId,
    wallet: s.wallet,
    nft: s.nft,
  };
};

const mdp = d => {
  return {
    data: {},
  };
};

export default connect(msp, mdp)(MyItemDetailView);
