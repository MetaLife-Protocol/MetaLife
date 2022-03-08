import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import SchemaStyles, {colorsSchema} from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import SearchBar from '../../shared/comps/SearchBar';
import MessageItem from './messages/item/MessageItem';

const iconDic = {
  photo: require('../../assets/image/profiles/photo.png'),
  fb: require('../../assets/image/profiles/Facebook.png'),
  nf: require('../../assets/image/profiles/NewFriends.png'),
  tt: require('../../assets/image/profiles/Twitter.png'),
};

const Messages = ({privateMsg}) => {
  const {textHolder} = colorsSchema;
  const {FG, row, text, alignItemsCenter} = SchemaStyles();
  const {searchBar, contactItemContainer, textView, nameTF, descTF} = styles;

  const snItem = ({item: {name, icon}}) => (
    <View
      style={[{marginHorizontal: 10, marginVertical: 20}, alignItemsCenter]}>
      <Image
        style={[{width: 50, height: 50}]}
        resizeMode={'stretch'}
        height={50}
        width={50}
        source={icon}
      />
      <Text style={[{color: textHolder, marginTop: 13}]}>{name}</Text>
    </View>
  );
  const recentItem = ({id, name, desc, icon}, index) => (
    <View key={index} style={[FG, row, contactItemContainer]}>
      <Image source={icon} />
      <View style={[textView]}>
        <Text style={[nameTF, text]}>{name}</Text>
        <Text style={[descTF, {color: textHolder}]}>{desc}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={FG}>
      <SearchBar style={[searchBar]} />
      {Object.keys(privateMsg).map(key => (
        <MessageItem key={key} rootKey={key} msgArr={privateMsg[key]} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contactItemContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBar: {marginVertical: 10},
  textView: {
    marginTop: 12,
    marginLeft: 15,
  },
  nameTF: {
    fontSize: 18,
    marginBottom: 10,
  },
  descTF: {
    fontSize: 15,
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    privateMsg: s.msg.privateMsg,
  };
};

const mdp = d => {
  return {
    setPublicMsg: v => d({type: 'setPublicMsg', payload: v}),
    addPublicMsg: v => d({type: 'addPublicMsg', payload: v}),
    setPrivateMsg: v => d({type: 'setPrivateMsg', payload: v}),
    addPrivateMsg: v => d({type: 'addPrivateMsg', payload: v}),
  };
};

export default connect(msp, mdp)(Messages);
