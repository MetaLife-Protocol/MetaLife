/**
 * Created on 17 Feb 2022 by lonmee
 */
import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import SchemaStyles from '../../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import {localDate} from '../../../../utils';
import PostMsgPanel from './PostMsgPannel';
import HeadIcon from '../../../../shared/comps/HeadIcon';
import {PeerIcons} from '../../../../shared/Icons';
import {useNavigation} from '@react-navigation/native';

const PostItem = ({
  item: {
    value: {author, timestamp, content},
  },
  peerInfoDic,
}) => {
  const {row, flex1, text, placeholderTextColor, justifySpaceBetween} =
      SchemaStyles(),
    {container, textContainer, contentContainer, panel} = styles;
  const {navigate} = useNavigation();
  const {
      name = author.substring(0, 10),
      description = '',
      image = '',
    } = peerInfoDic[author] || {},
    {text: cText, mentions = null} = content;
  // if (mentions && mentions.length) {
  //   const cache = [];
  //   for (const {link, name} of mentions) {
  //     cache.push(blobIdToUrl(link));
  //     // Image.getSize(
  //     //   blobIdToUrl(link),
  //     //   (w, h) => console.log(w, h),
  //     //   console.warn,
  //     // );
  //   }
  //   // Image.queryCache(cache).then(console.log).catch(console.warn);
  // }
  return (
    <View style={[row, container]}>
      <Pressable onPress={() => navigate('PeerDetailsScreen', author)}>
        <HeadIcon
          image={PeerIcons.peerIcon}
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
            <Image
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 10,
                alignSelf: i % 2 ? 'flex-end' : 'flex-start',
              }}
              height={200}
              width={200}
              key={name}
              source={{uri: link}}
            />
          ))}
        <PostMsgPanel style={[row, flex1, justifySpaceBetween, panel]} />
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
    peerInfoDic: s.contacts.peerInfoDic,
  };
};

const mdp = d => {
  return {
    addPeerInfo: v => d({type: 'addPeerInfo', payload: v}),
  };
};

export default connect(msp, mdp)(PostItem);
