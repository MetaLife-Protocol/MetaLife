import React, {useLayoutEffect} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import {useNavigation, useRoute} from '@react-navigation/native';
import {trainProfileFeed} from '../../../remote/ssbAPI';
import ItemAgent from '../home/ItemAgent';
import PeerDetailsHeader from './details/PeerDetailsHeader';
import {batchMsgCB} from '../../../store/MsgCB';

const PeerDetailsScreen = ({
  verbose,
  selfFeedId,
  relations,
  infoDic,
  feedDic,
  mergeFeedDic,
}) => {
  const {flex1} = SchemaStyles(),
    {} = styles;

  const {setOptions} = useNavigation(),
    {params: feedId} = useRoute();

  const isMyself = selfFeedId === feedId,
    {name} = infoDic[feedId] || {},
    myBlock = relations[3],
    isMyBlock = myBlock.includes(feedId);

  useLayoutEffect(() => {
    setOptions({title: name || feedId});
    isMyBlock ||
      (console.log('peer details addon ->'),
      trainProfileFeed(
        feedId,
        feedDic[feedId],
        idFeed =>
          idFeed.feed.length && (batchMsgCB(idFeed.feed), mergeFeedDic(idFeed)),
      ));
  }, []);

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        data={feedDic[feedId]}
        keyExtractor={(_, i) => i}
        ListHeaderComponent={<PeerDetailsHeader />}
        renderItem={info => <ItemAgent info={info} verbose={verbose} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

const msp = s => {
  return {
    verbose: s.cfg.verbose,
    selfFeedId: s.user.feedId,
    relations: s.user.relations,
    infoDic: s.info.dic,
    feedDic: s.feed,
  };
};

const mdp = d => {
  return {
    mergeFeedDic: v => d({type: 'mergeFeedDic', payload: v}),
  };
};

export default connect(msp, mdp)(PeerDetailsScreen);
