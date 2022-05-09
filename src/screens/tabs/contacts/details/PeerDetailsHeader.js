import {Pressable, StyleSheet, Text, View} from 'react-native';
import HeadIcon from '../../../../shared/comps/HeadIcon';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import {PeerIcons} from '../../../../shared/Icons';
import Toast from 'react-native-tiny-toast';
import RoundBtn from '../../../../shared/comps/RoundBtn';
import {block, follow} from '../../../../remote/ssb/ssbOP';
import {markMsgCBByKey} from '../../../../store/MsgCB';
import {findRootKey} from '../../../../store/filters/MsgFilters';
import React, {useState} from 'react';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from '../../../../shared/SchemaStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  friendsGraphParse,
  mutualFriend,
} from '../../../../store/filters/ContactsFilters';
import nativeClipboard from 'react-native/Libraries/Components/Clipboard/NativeClipboard';

/**
 * Created on 22 Mar 2022 by lonmee
 */

const PeerDetailsHeader = ({
  selfFeedId,
  friendsGraph,
  relations,
  infoDic,
  privateMsg,
}) => {
  const {row, flex1, justifySpaceAround, text} = SchemaStyles(),
    {textContainer, item, title, desc, btn} = styles;

  const {navigate, push} = useNavigation(),
    {params: feedId} = useRoute();

  const isMyself = selfFeedId === feedId,
    {name, description, image} = infoDic[feedId] || {},
    [myFriends, myFollowing, myFollower, myBlock, myBlocked] = relations,
    [friends, following, follower, blockList, blocked, other] =
      friendsGraphParse(friendsGraph, feedId),
    mutual = mutualFriend(friends, myFriends),
    isMyFriend = myFriends.includes(feedId),
    isMyFollowing = myFollowing.includes(feedId),
    isMyBlock = myBlock.includes(feedId);

  const [disabledBlock, setDisabledBlock] = useState(false);
  const [disabledFollow, setDisabledFollow] = useState(false);
  const [showId, setShowId] = useState(false);
  const {setString} = nativeClipboard;

  function peerListHandler(title, list) {
    push('PeersListScreen', {title, list});
  }

  return (
    <View>
      <View style={[item, row, flex1]}>
        <Pressable
          onPressIn={() => setShowId(true)}
          onPressOut={() => setShowId(false)}
          onLongPress={() => {
            setString(feedId);
            Toast.show('ID copied');
          }}>
          <HeadIcon
            image={image ? {uri: blobIdToUrl(image)} : PeerIcons.peerGirlIcon}
          />
        </Pressable>
        <View style={[textContainer]}>
          <Text numberOfLines={1} style={[title, text]}>
            {showId ? feedId : name || feedId}
          </Text>
          {description !== '' && <Text style={[desc]}>bio: {description}</Text>}
        </View>
      </View>
      <View style={[row, flex1, justifySpaceAround]}>
        <Pressable
          onPress={() =>
            peerListHandler('following by ' + feedId.substring(0, 6), following)
          }>
          <Text style={[desc]}>following:{following.length}</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            peerListHandler('follower of ' + feedId.substring(0, 6), follower)
          }>
          <Text style={[desc]}>follower:{follower.length}</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            peerListHandler(
              'Mutual friends with ' + feedId.substring(0, 6),
              mutual,
            )
          }>
          <Text style={[desc]}>mutual:{mutual.length}</Text>
        </Pressable>
      </View>
      {isMyself || (
        <View style={[row, justifySpaceAround]}>
          <RoundBtn
            style={[btn]}
            title={isMyBlock ? 'unblock' : 'block'}
            disabled={disabledBlock}
            press={() => {
              setDisabledBlock(true);
              block(feedId, {state: !isMyBlock}, v =>
                markMsgCBByKey(v.key, () => setDisabledBlock(false)),
              );
            }}
          />
          {isMyFriend && (
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
          )}
          <RoundBtn
            style={[btn]}
            title={isMyFriend || isMyFollowing ? 'unfollow' : 'follow'}
            disabled={disabledFollow}
            press={() => {
              setDisabledFollow(true);
              follow(feedId, {state: !(isMyFriend || isMyFollowing)}, v =>
                markMsgCBByKey(v.key, () => setDisabledFollow(false)),
              );
            }}
          />
        </View>
      )}
    </View>
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
    width: 100,
    height: 30,
  },
});

const msp = s => {
  return {
    selfFeedId: s.user.feedId,
    relations: s.user.relations,
    friendsGraph: s.contact.friendsGraph,
    infoDic: s.info,
    privateMsg: s.private,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(PeerDetailsHeader);
