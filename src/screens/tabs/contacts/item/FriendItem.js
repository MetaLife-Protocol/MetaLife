import React, {useEffect} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import SchemaStyles from '../../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import * as ssbOP from '../../../../remote/ssbOP';

const iconDic = {
  peerIcon: require('../../../../assets/image/contacts/peer_icon.png'),
  daoIcon: require('../../../../assets/image/contacts/dao_icon.png'),
  nftIcon: require('../../../../assets/image/contacts/nft_icon.png'),
};

const FriendItem = ({navigation, fId, peerInfoDic, addPeerInfo}) => {
  const {row, flex1, text} = SchemaStyles();
  const {head, textContainer, item, title, desc} = styles;
  // check cached
  useEffect(() => {
    console.log('check info');
    //fixme: won't sync change if cached
    peerInfoDic.hasOwnProperty(fId) ||
      ssbOP.ssb.aboutSelf.get(fId, (e, v) => v.name && addPeerInfo([fId, v]));
  });
  const {name = '', description = '', image = ''} = peerInfoDic[fId] || {};
  return (
    <Pressable onPress={() => navigation.navigate('PeerDetailsScreen', fId)}>
      <View style={[item, row, flex1]}>
        <Image
          height={60}
          width={60}
          style={[head]}
          source={image ? {uri: blobIdToUrl(image)} : iconDic.peerIcon}
        />
        <View style={[textContainer]}>
          <Text numberOfLines={1} style={[title, text]}>
            {name || fId}
          </Text>
          {description !== '' && <Text style={[desc]}>bio: {description}</Text>}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  head: {
    width: 60,
    height: 60,
  },
  item: {
    height: 80,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  textContainer: {
    marginHorizontal: 15,
    marginVertical: 12,
  },
  title: {
    fontFamily: 'Helvetica',
    fontSize: 17,
    width: 240,
  },
  desc: {
    marginTop: 4,
    fontFamily: 'Helvetica',
    fontSize: 15,
    color: '#4E586E',
    width: 400,
  },
  searchBar: {marginVertical: 10},
});

const msp = s => {
  return {
    peerInfoDic: s.contacts.peerInfoDic,
  };
};

const mdp = d => {
  return {
    addPeerInfo: v => d({type: 'addPeerInfo', payload: v}),
  };
};

export default connect(msp, mdp)(FriendItem);
