import React from 'react';
import {Button, Pressable, StyleSheet, Text, View} from 'react-native';
import SchemaStyles from '../../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import {
  connectPeer,
  disconnectPeer,
  follow,
  getProfile,
  persistentConnectPeer,
} from '../../../../remote/ssbOP';
import {PeerIcons} from '../../../../shared/Icons';
import HeadIcon from '../../../../shared/comps/HeadIcon';
import Toast from 'react-native-tiny-toast';
import {useNavigation} from '@react-navigation/native';

const PeerItem = ({
  pObj: [address, {type, key, state = ''}],
  peerInfoDic,
  addPeerInfo,
  relations: [friends, following],
}) => {
  const isFollowing = friends.includes(key) || following.includes(key);
  const {row, flex1, text} = SchemaStyles(),
    {textContainer, item, title, desc} = styles;
  const {navigate} = useNavigation();
  const {name = '', description = '', image = ''} = peerInfoDic[key] || {};

  function connectHandler(v) {
    Toast.show('connected: ' + v.id.substring(0, 10));
  }

  function disconnectHandler(v) {
    Toast.show('disconnected');
  }

  function followHandler(v) {
    const fid = v.value.content.contact;
    getProfile(fid, v => addPeerInfo([fid, v])),
      Toast.show('Following: ' + fid.substring(0, 10));
  }

  return (
    <Pressable key={key} onPress={() => navigate('PeerDetailsScreen', key)}>
      <View style={[item, row, flex1]}>
        <HeadIcon
          image={
            type === 'lan'
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
            {state === 'connected' && (
              <Button
                title={'disconnect'}
                onPress={() => disconnectPeer(address, disconnectHandler)}
              />
            )}
            {state !== 'connected' && (
              <Button
                title={state === 'connecting' ? 'connecting' : 'connect'}
                disabled={state === 'connecting'}
                onPress={() =>
                  type === 'pub'
                    ? persistentConnectPeer(address, {type}, connectHandler)
                    : connectPeer(address, {type}, connectHandler)
                }
              />
            )}
            {isFollowing || (
              <Button
                title={'follow'}
                onPress={() => follow(key, {}, followHandler)}
              />
            )}
          </View>
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
    peerInfoDic: s.contacts.peerInfoDic,
    relations: s.user.relations,
  };
};

const mdp = d => {
  return {
    addPeerInfo: v => d({type: 'addPeerInfo', payload: v}),
  };
};

export default connect(msp, mdp)(PeerItem);
