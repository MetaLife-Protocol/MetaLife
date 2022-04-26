/**
 * Created on 17 Feb 2022 by lonmee
 */
import React, {useCallback} from 'react';
import {
  Image,
  PixelRatio,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import SchemaStyles, {colorsBasics} from '../../../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import {localDate} from '../../../../../utils';
import PostMsgPanel from './PostMsgPannel';
import HeadIcon from '../../../../../shared/comps/HeadIcon';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import {PeerIcons} from '../../../../../shared/Icons';
import {useNavigation} from '@react-navigation/native';
import {sendMsg} from '../../../../../remote/ssbOP';
import {applyFilters} from '../../../../../store/filters/MsgFilters';
import Toast from 'react-native-tiny-toast';
import nativeClipboard from 'react-native/Libraries/Components/Clipboard/NativeClipboard';

const PostItem = ({
  item,
  showPanel = true,
  feedId,
  publicMsg,
  commentDic,
  infoDic,
  voteDic,
  showPullMenu,
}) => {
  const {row, flex1, text, placeholderTextColor, justifySpaceBetween} =
      SchemaStyles(),
    {container, textContainer, contentContainer, panel} = styles;
  const {setString} = nativeClipboard;
  const {
    key,
    value: {author, timestamp, content},
  } = item;

  const {navigate, push} = useNavigation();

  const {scale} = useWindowDimensions();

  const {
      name = author.substring(0, 10),
      description = '',
      image = '',
    } = infoDic[author] || {},
    {text: cText, mentions = null} = content,
    commentArr = commentDic[key] || [],
    voteArr = voteDic[key] || [],
    voted = voteArr.includes(feedId);

  // apply filters
  const textArr = applyFilters(cText);

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
      push('CommentEditor', {name, shownMsg: item});
    },
    [item],
  );

  const forwardHandler = useCallback(
    function (e) {
      showPullMenu({
        position: {
          x: PixelRatio.getPixelSizeForLayoutSize(e.nativeEvent.pageX / scale),
          y: PixelRatio.getPixelSizeForLayoutSize(e.nativeEvent.pageY / scale),
        },
        buttons: [
          {
            title: 'copy message id',
            handler: () => {
              setString(key);
              Toast.show('id copied');
              showPullMenu({position: {}, buttons: []});
            },
          },
        ],
      });
    },
    [item],
  );

  const peerPhase = id => (
    <Text
      style={[{color: colorsBasics.primary}]}
      onPress={() => navigate('PeerDetailsScreen', id)}>
      👤[${id.substring(1, 8)}...]
    </Text>
  );
  const feedPhase = id => {
    const {name = author.substring(0, 10)} = infoDic[author] || {},
      item =
        publicMsg.filter(v => v.key === id)[0] ||
        Object.values(commentDic).filter(msgs =>
          msgs.filter(v => v.key === id),
        )[0][0];

    return (
      <Text
        style={[{color: colorsBasics.primary}]}
        onPress={() => push('CommentEditor', {name, shownMsg: item})}>
        💬[${id.substring(1, 8)}...]
      </Text>
    );
  };

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
        <Text style={[text, contentContainer]}>
          {textArr.length > 0 &&
            textArr.map(
              (phase, i) =>
                phase && (
                  <Text style={[text]} key={i}>
                    {phase.charAt(0) === '@'
                      ? peerPhase(phase)
                      : phase.charAt(0) === '%'
                      ? feedPhase(phase)
                      : phase}
                  </Text>
                ),
            )}
        </Text>
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
            forwardHandler={forwardHandler}
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
    publicMsg: s.public,
  };
};

const mdp = d => {
  return {showPullMenu: menu => d({type: 'pullMenu', payload: menu})};
};

export default connect(msp, mdp)(PostItem);
