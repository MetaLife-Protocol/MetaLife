/**
 * Created on 22 Feb 2022 by lonmee
 */
import * as React from 'react';
import {FlatList, SafeAreaView} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from '../../../shared/SchemaStyles';
import {friendsGraphParse} from '../../../filters/ContactsFilters';
import FriendItem from '../contacts/item/FriendItem';

const FriendList = ({navigation, feedId, friendsGraph}) => {
  const {BG} = SchemaStyles();
  const relations = friendsGraphParse(friendsGraph, feedId, false);
  return (
    <SafeAreaView style={[BG]}>
      <FlatList data={relations[0]} renderItem={FriendItem} />
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    friendsGraph: s.contacts.friendsGraph,
  };
};

const mdp = d => {
  return {
    addPeerInfo: v => d({type: 'addPeerInfo', payload: v}),
  };
};

export default connect(msp, mdp)(FriendList);
