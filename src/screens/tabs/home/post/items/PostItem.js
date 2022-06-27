/**
 * Created on 17 Feb 2022 by lonmee
 */
import React, {useCallback} from 'react';
import {
  PixelRatio,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import useSchemaStyles, {
  colorsBasics,
} from '../../../../../shared/UseSchemaStyles';
import {localDate} from '../../../../../utils';
import PostMsgPanel from './PostMsgPannel';
import HeadIcon from '../../../../../shared/comps/HeadIcon';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import {PeerIcons} from '../../../../../shared/Icons';
import {useNavigation} from '@react-navigation/native';
import {sendMsg} from '../../../../../remote/ssb/ssbOP';
import {
  applyFilters,
  findFromComment,
  regExp,
} from '../../../../../store/filters/MsgFilters';
import Toast from 'react-native-tiny-toast';
import nativeClipboard from 'react-native/Libraries/Components/Clipboard/NativeClipboard';
import AudioElement from './AudioElement';
import ImageElement from './ImageElement';
import {connect} from 'react-redux';
import {report} from '../../../../../remote/pubOP';

const PostItem = ({
  cfg: {verbose},
  item,
  showPanel = true,
  feedId,
  publicMsg,
  commentDic,
  infoDic,
  voteDic,
  showPullMenu,
  setViewImages,
}) => {
  const {row, flex1, text, placeholderTextColor, justifySpaceBetween} =
      useSchemaStyles(),
    {container, textContainer, contentContainer, panel} = styles;
  const {setString} = nativeClipboard;
  const {
    key,
    value: {author, timestamp, content},
  } = item;

  const {navigate, push} = useNavigation();

  const {
      name = author.substring(0, 10),
      description = '',
      image = '',
      avatar = '',
    } = infoDic[author] || {},
    {text: cText, mentions = null} = content,
    commentArr = commentDic[key] || [],
    voteArr = voteDic[key] || [],
    voted = voteArr.includes(feedId);

  // apply filters
  const textArr = cText ? applyFilters(cText) : [];

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
      e.target.measure((x, y, width, height, pageX, pageY) =>
        showPullMenu({
          position: {
            x: pageX + width,
            y: pageY + height,
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
            {
              title: 'copy message content',
              handler: () => {
                setString(cText);
                Toast.show('content copied');
                showPullMenu({position: {}, buttons: []});
              },
            },
            {
              title: 'report',
              handler: () => {
                report(
                  {
                    plaintiff: feedId,
                    defendant: author,
                    messagekey: key,
                    reasons: 'sex',
                  },
                  data => Toast.show(data),
                );
                showPullMenu({position: {}, buttons: []});
              },
            },
          ],
        }),
      );
    },
    [item],
  );

  const peerPhase = id => (
    <Text
      style={[{color: colorsBasics.primary}]}
      onPress={() => navigate('PeerDetailsScreen', id)}>
      👤[contact]
    </Text>
  );
  const feedPhase = id => {
    const {name = author.substring(0, 10)} = infoDic[author] || {},
      item =
        publicMsg.filter(v => v.key === id)[0] ||
        findFromComment(commentDic, id);
    return (
      <Text
        style={[{color: colorsBasics.primary}]}
        onPress={() =>
          push('CommentEditor', {name, shownMsg: item || {key: id}})
        }>
        💬[post]
      </Text>
    );
  };

  const viewImagesHandler = i =>
    setViewImages({
      index: i,
      imgs: mentions.map(m => {
        if (
          m.name !== 'audio:recording.mp3' &&
          m.name !== 'audio:recording.mp4'
        ) {
          return {url: blobIdToUrl(m.link)};
        }
      }),
    });

  return (
    <View style={[row, container]}>
      <Pressable onPress={() => navigate('PeerDetailsScreen', author)}>
        <HeadIcon
          avatar={avatar}
          image={image ? {uri: blobIdToUrl(image)} : PeerIcons.peerGirlIcon}
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
                    {regExp.peerLink.test(phase)
                      ? peerPhase(phase)
                      : regExp.feedLink.test(phase)
                      ? feedPhase(phase)
                      : phase}
                  </Text>
                ),
            )}
        </Text>
        {mentions &&
          mentions.length > 0 &&
          mentions.map(({link, name}, i) => {
            const url = blobIdToUrl(link);
            return (
              url &&
              link.charAt(0) === '&' && (
                <View key={i}>
                  {/*<Text style={[text]}>{name}</Text>*/}
                  {name === 'audio:recording.mp3' ||
                  name === 'audio:recording.mp4' ? (
                    <AudioElement link={link} url={url} verbose={verbose} />
                  ) : (
                    <Pressable onPress={() => viewImagesHandler(i)}>
                      <ImageElement
                        index={i}
                        link={link}
                        url={url}
                        verbose={verbose}
                      />
                    </Pressable>
                  )}
                  <Text
                    style={[
                      {
                        color: colorsBasics.primary,
                        marginVertical: 4,
                        alignSelf: i % 2 ? 'flex-end' : 'flex-start',
                      },
                    ]}
                    onPress={() => {
                      setString(link);
                      Toast.show("Blob's id copied");
                    }}>
                    Copy the blob's id
                  </Text>
                </View>
              )
            );
          })}
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
  return {
    showPullMenu: menu => d({type: 'pullMenu', payload: menu}),
    setViewImages: imgs => d({type: 'images', payload: imgs}),
  };
};

export default connect(msp, mdp)(PostItem);
