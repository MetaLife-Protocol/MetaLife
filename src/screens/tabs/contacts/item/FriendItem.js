import React, {useEffect} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import SchemaStyles from '../../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import {about} from '../../../../remote/ssbOP';
import HeadIcon from '../../../../shared/comps/HeadIcon';

const iconDic = {
  peerIcon: require('../../../../assets/image/contacts/peer_icon.png'),
  daoIcon: require('../../../../assets/image/contacts/dao_icon.png'),
  nftIcon: require('../../../../assets/image/contacts/nft_icon.png'),
};

const FriendItem = ({navigation, fId, peerInfoDic, addPeerInfo}) => {
  const {row, flex1, text} = SchemaStyles();
  const {textContainer, item, title, desc} = styles;
  // check cached
  useEffect(() => {
    peerInfoDic.hasOwnProperty(fId) || about(fId, v => addPeerInfo([fId, v]));
  }, []);
  const {name = '', description = '', image = ''} = peerInfoDic[fId] || {};
  return (
    <Pressable onPress={() => navigation.push('PeerDetailsScreen', fId)}>
      <View style={[item, row, flex1]}>
        <HeadIcon
          image={image ? {uri: blobIdToUrl(image)} : iconDic.peerIcon}
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
    cfg: s.cfg,
    peerInfoDic: s.contacts.peerInfoDic,
  };
};

const mdp = d => {
  return {
    addPeerInfo: v => d({type: 'addPeerInfo', payload: v}),
  };
};

export default connect(msp, mdp)(FriendItem);
