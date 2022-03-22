import React, {useLayoutEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import {
  friendsGraphParse,
  mutualFriend,
} from '../../../filters/ContactsFilters';
import {useNavigation, useRoute} from '@react-navigation/native';
import {trainProfileFeed} from '../../../remote/ssbAPI';
import ItemAgent from '../home/ItemAgent';
import PeerDetailsHeader from './details/PeerDetailsHeader';

const PeerDetailsScreen = ({
  selfFeedId,
  friendsGraph,
  relations,
  peerInfoDic,
  privateMsg,
}) => {
  const {row, flex1, justifySpaceBetween, text} = SchemaStyles(),
    {textContainer, item, title, desc, btn} = styles;

  const {navigate, push, setOptions} = useNavigation(),
    {params: feedId} = useRoute();

  const isMyself = selfFeedId === feedId,
    {name, description, image} = peerInfoDic[feedId] || {},
    [myFriends, myFollowing, myFollower, myBlock, myBlocked] = relations,
    [friends, following, follower, blockList, blocked, other] =
      friendsGraphParse(friendsGraph, feedId),
    mutual = mutualFriend(friends, myFriends),
    isMyFriend = myFriends.includes(feedId),
    isMyFollowing = myFollowing.includes(feedId),
    isMyBlock = myBlock.includes(feedId);

  const [feed, setFeed] = useState([]);

  useLayoutEffect(() => {
    setOptions({title: name || feedId});
    trainProfileFeed(feedId, 0, setFeed);
  }, [feed]);

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        data={feed}
        keyExtractor={item => item.key}
        ListHeaderComponent={<PeerDetailsHeader />}
        renderItem={info => <ItemAgent info={info} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

const msp = s => {
  return {
    selfFeedId: s.user.feedId,
    relations: s.user.relations,
    friendsGraph: s.contacts.friendsGraph,
    peerInfoDic: s.contacts.peerInfoDic,
    privateMsg: s.msg.privateMsg,
  };
};

const mdp = d => {
  return {
    addPeerInfo: v => d({type: 'addPeerInfo', payload: v}),
  };
};

export default connect(msp, mdp)(PeerDetailsScreen);
