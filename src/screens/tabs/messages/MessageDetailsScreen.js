import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useSchemaStyles, {colorsBasics} from '../../../shared/UseSchemaStyles';
import {connect} from 'react-redux/lib/exports';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import MsgInput from '../../../shared/comps/MsgInput';
import {sendMsg} from '../../../remote/ssb/ssbOP';
import {localDate} from '../../../utils';
import HeadIcon from '../../../shared/comps/HeadIcon';
import {PeerIcons as iconDic} from '../../../shared/Icons';
// let scrollView;

const MessageDetailsScreen = ({
  navigation,
  route: {
    params: {rootKey, recp},
  },
  feedId,
  infoDic,
  privateMsg,
}) => {
  const {BG, FG, row, flex1} = useSchemaStyles(),
    {itemContainer, item, itemLeft, itemRight, title, desc} = styles,
    {name = '', description = '', image = ''} = infoDic[recp] || {};

  const headerRight = () => (
    <HeadIcon
      height={30}
      width={30}
      image={image ? {uri: blobIdToUrl(image)} : iconDic.peerGirlIcon}
    />
  );

  const [rootKeyLocal, setRootKeyLocal] = useState(rootKey);

  const scrollView = useRef();

  useLayoutEffect(() => {
    navigation.setOptions(
      {
        title: name || recp,
        headerRight,
      },
      [navigation],
    );
  }, [navigation]);

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', scrollToEnd);
    return () => Keyboard.removeAllListeners('keyboardWillShow');
  }, []);

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
    scrollView.current.scrollToEnd({animated: true});
    scrollView.current.flashScrollIndicators();
  }

  return (
    <SafeAreaView style={[flex1, FG]}>
      <ScrollView
        ref={scrollView}
        style={[flex1, BG]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToEnd}>
        {privateMsg[rootKeyLocal] &&
          privateMsg[rootKeyLocal].map(
            ({key, value: {author, content, timestamp}}) => {
              return (
                <View
                  key={key}
                  style={[
                    itemContainer,
                    author === feedId ? itemLeft : itemRight,
                  ]}>
                  <View style={[item]}>
                    <Text selectable={true} style={[title]}>
                      {content.text}
                    </Text>
                    <Text style={[desc]}>{localDate(timestamp)}</Text>
                  </View>
                </View>
              );
            },
          )}
      </ScrollView>
      <MsgInput sendHandler={sendHandler} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    infoDic: s.info,
    privateMsg: s.private,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(MessageDetailsScreen);
