import React, {useEffect, useLayoutEffect} from 'react';
import {FlatList, Modal, SafeAreaView, StyleSheet} from 'react-native';
import useSchemaStyles from '../../../shared/UseSchemaStyles';
import {connect} from 'react-redux/lib/exports';
import {useNavigation, useRoute} from '@react-navigation/native';
import ItemAgent from '../home/post/ItemAgent';
import PeerDetailsHeader from './details/PeerDetailsHeader';
import {trainFeed} from '../../../remote/ssb/ssbAPI';
import {batchMsgCB} from '../../../store/MsgCB';
import {useDispatch} from 'react-redux';

const PeerDetailsScreen = ({verbose, selfFeedId, relations, info, feed}) => {
  const {flex1} = useSchemaStyles(),
    {} = styles;

  const {setOptions} = useNavigation(),
    {params: feedId} = useRoute(),
    dispatch = useDispatch();

  const isMyself = selfFeedId === feedId,
    {name} = info[feedId] || {},
    myBlock = relations[3],
    isMyBlock = myBlock.includes(feedId);

  useLayoutEffect(() => {
    setOptions({title: name || feedId});
  }, []);

  useEffect(() => {
    isMyBlock ||
      trainFeed(feedId, feed, idMsgs =>
        dispatch({
          type: 'appendFeed',
          payload: batchMsgCB(idMsgs),
        }),
      );
  }, [isMyBlock]);

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        data={feed[feedId]}
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
    info: s.info,
    feed: s.feed,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(PeerDetailsScreen);
