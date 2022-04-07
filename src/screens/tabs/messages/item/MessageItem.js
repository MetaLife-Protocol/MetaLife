import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import SchemaStyles from '../../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import {PeerIcons} from '../../../../shared/Icons';
import HeadIcon from '../../../../shared/comps/HeadIcon';
import {localDate} from '../../../../utils';
import {useNavigation} from '@react-navigation/native';

const MessageItem = ({rootKey, feedId, infoDic, msgArr}) => {
  const {
      value: {
        author,
        content: {recps},
      },
    } = msgArr[0],
    recp = recps.filter(value => value !== feedId)[0],
    lastMsg = msgArr[msgArr.length - 1],
    {navigate} = useNavigation();

  const {row, flex1, text} = SchemaStyles(),
    {textContainer, item, title, desc} = styles;
  const {name = '', description = '', image = ''} = infoDic[recp] || {};
  return (
    <Pressable
      onPress={() => navigate('MessageDetailsScreen', {rootKey, recp})}>
      <View style={[item, row, flex1]}>
        <HeadIcon
          image={image ? {uri: blobIdToUrl(image)} : PeerIcons.peerIcon}
        />
        <View style={[textContainer]}>
          <Text numberOfLines={1} style={[title, text]}>
            {lastMsg.value.content.text}
          </Text>
          <Text style={[desc]}>{localDate(lastMsg.timestamp)}</Text>
        </View>
      </View>
    </Pressable>
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
    width: 400,
  },
  searchBar: {marginVertical: 10},
});

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    infoDic: s.info,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(MessageItem);
