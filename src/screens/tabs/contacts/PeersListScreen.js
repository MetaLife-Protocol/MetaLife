import React, {useEffect} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import FriendItem from './item/FriendItem';

const PeersListScreen = ({
  navigation,
  route: {
    params: {title, list},
  },
}) => {
  useEffect(() => {
    navigation.setOptions({title});
  });

  return (
    <SafeAreaView>
      <FlatList
        data={list}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <FriendItem navigation={navigation} fId={item} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  descTF: {
    fontSize: 15,
  },
});

const msp = s => {
  return {
    stagedPeers: s.contacts.stagedPeers,
    setStagedPeers: s.contacts.setStagedPeers,
    connectedPeers: s.contacts.connectedPeers,
    setConnectedPeers: s.contacts.setConnectedPeers,
  };
};

const mdp = d => {
  return {
    setStagedPeers: v => d({type: 'setStagedPeers', payload: v}),
    setConnectedPeers: v => d({type: 'setConnectedPeers', payload: v}),
  };
};

export default connect(msp, mdp)(PeersListScreen);
