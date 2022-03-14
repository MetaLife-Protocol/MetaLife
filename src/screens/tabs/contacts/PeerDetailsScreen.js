import React, {useLayoutEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import {
  friendsGraphParse,
  mutualFriend,
} from '../../../filters/ContactsFilters';
import RoundBtn from '../../../shared/comps/RoundBtn';
import {findRootKey} from '../../../filters/MsgFilters';
import {PeerIcons} from '../../../shared/Icons';
import {block, follow} from '../../../remote/ssbOP';
import {markMsgCBByKey} from '../../../remote/ssb/MsgCB';
import HeadIcon from '../../../shared/comps/HeadIcon';
import Toast from 'react-native-tiny-toast';
import {useNavigation, useRoute} from '@react-navigation/native';
import nativeClipboard from 'react-native/Libraries/Components/Clipboard/NativeClipboard';

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

  const [disabledBlock, setDisabledBlock] = useState(false);
  const [disabledFollow, setDisabledFollow] = useState(false);
  const {setString} = nativeClipboard;

  useLayoutEffect(() => {
    setOptions({title: name || feedId});
  });

  function peerListHandler(title, list) {
    push('PeersListScreen', {title, list});
  }

  return (
    <SafeAreaView style={[flex1]}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={[item, row, flex1]}>
          <HeadIcon
            image={PeerIcons.peerIcon}
          />
          <Pressable
            onPress={event => {
              setString(feedId);
              Toast.show('ID copied');
            }}>
            <View style={[textContainer]}>
              <Text numberOfLines={1} style={[title, text]}>
                {name || feedId}
              </Text>
              {description !== '' && (
                <Text style={[desc]}>bio: {description}</Text>
              )}
            </View>
          </Pressable>
        </View>
        <View style={[row, flex1, justifySpaceBetween]}>
          <Pressable
            onPress={() =>
              peerListHandler(
                'following by ' + selfFeedId.substring(0, 6),
                following,
              )
            }>
            <Text style={[desc]}>following:{following.length}</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              peerListHandler(
                'follower of ' + selfFeedId.substring(0, 6),
                follower,
              )
            }>
            <Text style={[desc]}>follower:{follower.length}</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              peerListHandler(
                'Mutual friends with ' + selfFeedId.substring(0, 6),
                mutual,
              )
            }>
            <Text style={[desc]}>mutual:{mutual.length}</Text>
          </Pressable>
        </View>
        {isMyself || (
          <View style={[row]}>
            {isMyBlock || (
              <RoundBtn
                style={[btn]}
                title={'block'}
                disabled={disabledBlock}
                press={() => {
                  setDisabledBlock(true);
                  block(feedId, {}, v =>
                    markMsgCBByKey(v.key, () => setDisabledBlock(false)),
                  );
                }}
              />
            )}
            {isMyFriend ? (
              <RoundBtn
                style={[btn]}
                title={'chat'}
                press={() =>
                  navigate('MessageDetailsScreen', {
                    rootKey: findRootKey(feedId, privateMsg),
                    recp: feedId,
                  })
                }
              />
            ) : (
              isMyFollowing || (
                <RoundBtn
                  style={[btn]}
                  title={'follow'}
                  disabled={disabledFollow}
                  press={() => {
                    setDisabledFollow(true);
                    follow(feedId, {}, v =>
                      markMsgCBByKey(v.key, () => setDisabledFollow(false)),
                    );
                  }}
                />
              )
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
    height: 40,
    marginHorizontal: 20,
  },
  btn: {
    marginVertical: 10,
    width: 120,
    height: 30,
  },
});

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
