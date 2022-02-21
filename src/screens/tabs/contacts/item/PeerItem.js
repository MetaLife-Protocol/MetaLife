import React from 'react';
import {Button, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import SchemaStyles from '../../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import * as ssbOP from '../../../../remote/ssbOP';
import {connectPeer, follow} from '../../../../remote/ssbOP';
import {PeerIcons} from '../../../../shared/Icons';

const PeerItem = ({
  navigation,
  pObj: [address, {type, key, state = ''}],
  peerInfoDic,
  addPeerInfo,
}) => {
  const {row, flex1, text} = SchemaStyles();
  const {head, textContainer, item, title, desc} = styles;
  // check cached
  // useEffect(() => {
  //   console.log('check info');
  //   peerInfoDic.hasOwnProperty(key) ||
  //     ssb.aboutSelf.get(key, (e, v) => v.name && addPeerInfo([key, v]));
  // });

  const {name = '', description = '', image = ''} = peerInfoDic[key] || {};

  function connectHandler(v) {
    alert('connected: ' + v.id.substring(0, 10));
  }

  function followHandler(v) {
    alert('Following: ' + v.key.substring(0, 10));
  }

  return (
    <Pressable
      key={key}
      onPress={() => navigation.navigate('PeerDetailsScreen')}>
      <View style={[item, row, flex1]}>
        <Image
          height={60}
          width={60}
          style={[head]}
          source={
            image
              ? {uri: blobIdToUrl(image)}
              : type == 'lan'
              ? PeerIcons.peerIcon
              : type == 'pub'
              ? PeerIcons.daoIcon
              : PeerIcons.nftIcon
          }
        />
        <View style={[textContainer]}>
          <Text numberOfLines={1} style={[title, text]}>
            {name || key}
          </Text>
          {description !== '' && <Text style={[desc]}>bio: {description}</Text>}
          <View style={[row]}>
            {state === 'connected' || (
              <Button
                title={'connect'}
                onPress={() => connectPeer(address, {}, connectHandler)}
              />
            )}
            <Button
              title={'follow'}
              onPress={() => follow(key, {}, followHandler)}
            />
          </View>
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

export default connect(msp, mdp)(PeerItem);
