import React, {useLayoutEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import {useNavigation, useRoute} from '@react-navigation/native';
import {trainProfileFeed} from '../../../remote/ssbAPI';
import ItemAgent from '../home/ItemAgent';
import PeerDetailsHeader from './details/PeerDetailsHeader';

const PeerDetailsScreen = ({
  selfFeedId,
  relations,
  peerInfoDic,
  feedDic,
  addFeedDic,
}) => {
  const {flex1} = SchemaStyles(),
    {} = styles;

  const {setOptions} = useNavigation(),
    {params: feedId} = useRoute();

  const isMyself = selfFeedId === feedId,
    {name} = peerInfoDic[feedId] || {},
    myBlock = relations[3],
    isMyBlock = myBlock.includes(feedId);

  useLayoutEffect(() => {
    setOptions({title: name || feedId});
    trainProfileFeed(feedId, 0, addFeedDic);
  }, [feedId]);

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        data={feedDic[feedId]}
        keyExtractor={item => item.key}
        ListHeaderComponent={<PeerDetailsHeader />}
        renderItem={info => <ItemAgent info={info} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

const msp = s => {
  return {
    selfFeedId: s.user.feedId,
    relations: s.user.relations,
    peerInfoDic: s.contacts.peerInfoDic,
    feedDic: s.msg.feedDic,
  };
};

const mdp = d => {
  return {
    addFeedDic: v => d({type: 'addFeedDic', payload: v}),
  };
};

export default connect(msp, mdp)(PeerDetailsScreen);
