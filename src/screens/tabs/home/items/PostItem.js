/**
 * Created on 17 Feb 2022 by lonmee
 */
import React, {useCallback} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import SchemaStyles from '../../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import {localDate} from '../../../../utils';
import PostMsgPanel from './PostMsgPannel';
import HeadIcon from '../../../../shared/comps/HeadIcon';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import {PeerIcons} from '../../../../shared/Icons';
import {useNavigation} from '@react-navigation/native';
import {sendMsg} from '../../../../remote/ssbOP';

const PostItem = ({
  item,
  showPanel = true,
  feedId,
  commentDic,
  infoDic,
  voteDic,
}) => {
  const {row, flex1, text, placeholderTextColor, justifySpaceBetween} =
      SchemaStyles(),
    {container, textContainer, contentContainer, panel} = styles;

  const {
    key,
    value: {author, timestamp, content},
  } = item;

  const {navigate, push} = useNavigation();

  const {
      name = author.substring(0, 10),
      description = '',
      image = '',
    } = infoDic[author] || {},
    {text: cText, mentions = null} = content,
    commentArr = commentDic[key] || [],
    voteArr = voteDic[key] || [],
    voted = voteArr.includes(feedId);

  const likeHandler = useCallback(
    function () {
      sendMsg({
        type: 'vote',
        vote: {
          link: key,
          value: !voted,
          expression: voted ? 'Unlike' : 'like',
        },
      });
    },
    [key, voted],
  );

  const commentHandler = useCallback(
    function () {
      push('PostMsgEditor', {name, shownMsg: item});
    },
    [item],
  );

  return (
    <View style={[row, container]}>
      <Pressable onPress={() => navigate('PeerDetailsScreen', author)}>
        <HeadIcon
          image={image ? {uri: blobIdToUrl(image)} : PeerIcons.peerIcon}
        />
      </Pressable>
      <View style={[textContainer]}>
        <Text>
          <Text style={[text]}>{name}</Text>
          <Text style={[placeholderTextColor]}>
            {'\n' + localDate(timestamp)}
          </Text>
        </Text>
        <Text style={[text, contentContainer]}>{cText}</Text>
        {mentions &&
          mentions.map(({link, name}, i) => (
            <View key={i}>
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 10,
                  alignSelf: i % 2 ? 'flex-end' : 'flex-start',
                }}
                height={200}
                width={200}
                source={{uri: blobIdToUrl(link)}}
              />
              <Text>name</Text>
            </View>
          ))}
        {showPanel && (
          <PostMsgPanel
            style={[row, flex1, justifySpaceBetween, panel]}
            voted={voted}
            voteArr={voteArr}
            commentArr={commentArr}
            commentHandler={commentHandler}
            likeHandler={likeHandler}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginLeft: 10,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  contentContainer: {
    paddingTop: 10,
  },
  panel: {
    paddingTop: 15,
    paddingEnd: 10,
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    commentDic: s.comment,
    infoDic: s.info,
    voteDic: s.vote,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(PostItem);
