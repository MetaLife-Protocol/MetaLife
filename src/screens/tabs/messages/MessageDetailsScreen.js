import React, {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SchemaStyles, {colorsBasics} from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import MsgInput from './MsgInput';
import {sendMsg} from '../../../remote/ssbOP';

const iconDic = {
  peerIcon: require('../../../assets/image/contacts/peer_icon.png'),
};
let scrollView;

const MessageDetailsScreen = ({
  navigation,
  route: {
    params: {rootKey, recp},
  },
  feedId,
  peerInfoDic,
  privateMsg,
}) => {
  const {BG, FG, row, flex1} = SchemaStyles(),
    {head, itemContainer, item, itemLeft, itemRight, title, desc} = styles,
    {name = '', description = '', image = ''} = peerInfoDic[recp] || {};

  const headerRight = () => (
    <Image
      height={30}
      width={30}
      style={[head]}
      source={image ? {uri: blobIdToUrl(image)} : iconDic.peerIcon}
    />
  );

  const [rootKeyLocal, setRootKeyLocal] = useState(rootKey);
  useEffect(() => {
    navigation.setOptions({
      title: name || recp,
      headerRight,
    });
    Keyboard.addListener('keyboardWillShow', scrollToEnd);
    return () => Keyboard.removeAllListeners('keyboardWillShow');
  });

  function sendHandler(content) {
    sendMsg(
      {
        type: 'post',
        root: rootKeyLocal,
        text: content,
        recps: [recp, feedId],
      },
      msg => {
        rootKeyLocal || setRootKeyLocal(msg.key);
        scrollToEnd();
      },
    );
  }

  function scrollToEnd() {
    scrollView.scrollToEnd({animated: true});
    scrollView.flashScrollIndicators();
  }

  return (
    <SafeAreaView style={[flex1, FG]}>
      <ScrollView
        ref={ref => {
          scrollView = ref;
        }}
        style={[flex1, BG]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToEnd}>
        {privateMsg[rootKeyLocal] &&
          privateMsg[rootKeyLocal].map(
            ({key, value: {author, content, timestamp}}) => (
              <View
                key={key}
                style={[
                  itemContainer,
                  author === feedId ? itemLeft : itemRight,
                ]}>
                <View style={[item]}>
                  <Text style={[title]}>{content.text}</Text>
                  {/*<Text style={[desc]}>{timestamp}</Text>*/}
                </View>
              </View>
            ),
          )}
      </ScrollView>
      <MsgInput sendHandler={sendHandler} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  head: {
    width: 30,
    height: 30,
  },
  itemContainer: {
    marginHorizontal: 15,
    marginVertical: 12,
    borderBottomStartRadius: 12,
    borderBottomEndRadius: 12,
    maxWidth: 293,
  },
  itemLeft: {
    alignSelf: 'flex-start',
    borderTopEndRadius: 12,
    backgroundColor: colorsBasics.white,
  },
  itemRight: {
    alignSelf: 'flex-end',
    borderTopStartRadius: 12,
    backgroundColor: colorsBasics.primary,
  },
  item: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    maxWidth: 246,
    fontFamily: 'Helvetica',
    fontSize: 14,
    color: 'black',
    marginVertical: 8,
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
    feedId: s.user.feedId,
    peerInfoDic: s.contacts.peerInfoDic,
    privateMsg: s.msg.privateMsg,
  };
};

const mdp = d => {
  return {
    addPeerInfo: v => d({type: 'addPeerInfo', payload: v}),
  };
};

export default connect(msp, mdp)(MessageDetailsScreen);
