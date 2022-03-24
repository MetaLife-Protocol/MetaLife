import React, {useLayoutEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import {useNavigation, useRoute} from '@react-navigation/native';
import {trainProfileFeed} from '../../../remote/ssbAPI';
import ItemAgent from '../home/ItemAgent';
import PeerDetailsHeader from './details/PeerDetailsHeader';

const PeerDetailsScreen = ({selfFeedId, relations, peerInfoDic}) => {
  const {flex1} = SchemaStyles(),
    {} = styles;

  const {setOptions} = useNavigation(),
    {params: feedId} = useRoute();

  const isMyself = selfFeedId === feedId,
    {name} = peerInfoDic[feedId] || {},
    myBlock = relations[3],
    isMyBlock = myBlock.includes(feedId);

  const [feed, setFeed] = useState([]);

  useLayoutEffect(() => {
    setOptions({title: name || feedId});
    trainProfileFeed(feedId, 0, setFeed);
  }, [feed, feedId]);

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        data={feed}
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
  };
};

const mdp = d => {
  return {
    addPeerInfo: v => d({type: 'addPeerInfo', payload: v}),
  };
};

export default connect(msp, mdp)(PeerDetailsScreen);
