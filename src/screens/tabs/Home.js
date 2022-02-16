import React, {useEffect} from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import SchemaStyles, {
  colorsBasics,
  colorsSchema,
} from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import * as ssbOP from '../../remote/ssbOP';
import {
  addPrivateUpdatesListener,
  addPublicUpdatesListener,
  loadMsg,
  reqStartSSB,
} from '../../remote/ssbOP';

const Home = ({
  navigation,
  feedId,
  setFeedId,
  publicMsg,
  addPublicMsg,
  setPrivateMsg,
}) => {
  const {barStyle, FG, flex1} = SchemaStyles();
  useEffect(() => {
    // ssb initialize
    window.ssb
      ? (ssbOP.ssb = window.ssb)
      : reqStartSSB(ssb => {
          window.ssb = ssb;
          // set feedId
          setFeedId(ssb.id);
          // start & stage self
          ssb.starter.startAndStage((e, v) =>
            console.log(v ? 'start' : 'started yet'),
          );
          // listening for public & private msg
          addPublicUpdatesListener(key => loadMsg(key, false, addPublicMsg));
          // addPrivateUpdatesListener(key => loadMsg(key, true, addPrivateMsg));
          addPrivateUpdatesListener(key => loadMsg(key, true, setPrivateMsg));
        });
  }, []);

  return (
    <SafeAreaView style={[flex1]}>
      <StatusBar barStyle={barStyle} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <ScrollView>
          {publicMsg.map(({key, value: {author, timestamp, content}}) => (
            <View key={key}>
              <Text style={{color: colorsSchema.primary}}>
                author: {author}
              </Text>
              <Text selectable={true} style={{color: colorsBasics.light}}>
                type: {content.type}
              </Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    feedId: s.user.feedId,
    publicMsg: s.msg.publicMsg,
  };
};

const mdp = d => {
  return {
    setFeedId: v => d({type: 'setFeedId', payload: v}),
    setPublicMsg: v => d({type: 'setPublicMsg', payload: v}),
    addPublicMsg: v => d({type: 'addPublicMsg', payload: v}),
    setPrivateMsg: v => d({type: 'setPrivateMsg', payload: v}),
    addPrivateMsg: v => d({type: 'addPrivateMsg', payload: v}),
  };
};

export default connect(msp, mdp)(Home);
