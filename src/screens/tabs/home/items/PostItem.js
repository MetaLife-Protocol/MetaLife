/**
 * Created on 17 Feb 2022 by lonmee
 */
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import SchemaStyles, {colorsSchema} from '../../../../shared/SchemaStyles';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import {PeerIcons} from '../../../../shared/Icons';
import {connect} from 'react-redux/lib/exports';
import {localDate} from '../../../../utils';
import PostMsgPanel from './PostMsgPannel';

const PostItem = ({
  item: {
    value: {author, timestamp, content},
  },
  peerInfoDic,
}) => {
  const {row, flex1, text, placeholderTextColor, justifySpaceBetween} =
      SchemaStyles(),
    {container, textContainer, contentContainer, panel} = styles;

  const {
    name = author.substring(0, 10),
    description = '',
    image = '',
  } = peerInfoDic[author] || {};
  return (
    <View style={[row, container]}>
      <Image source={image ? {uri: blobIdToUrl(image)} : PeerIcons.peerIcon} />
      <View style={[textContainer]}>
        <Text>
          <Text style={[text]}>{name}</Text>
          <Text style={[placeholderTextColor]}>{localDate(timestamp)}</Text>
        </Text>
        <Text style={[text, contentContainer]}>{content.text}</Text>
        <PostMsgPanel style={[row, flex1, justifySpaceBetween, panel]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
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
    peerInfoDic: s.contacts.peerInfoDic,
  };
};

const mdp = d => {
  return {
    addPeerInfo: v => d({type: 'addPeerInfo', payload: v}),
  };
};

export default connect(msp, mdp)(PostItem);
