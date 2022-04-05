import React, {useEffect, useMemo} from 'react';
import {FlatList, SafeAreaView} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import ItemAgent from './home/ItemAgent';
import {initializeHandlers} from '../../remote/SsbHandlers';
import {startSSB} from '../../remote/starter';
import {useDispatch, useStore} from 'react-redux';
import {checkAddon, populateListeners} from '../../remote/SsbListeners';

const Home = ({verbose, feedId, feed, relations, publicMsg}) => {
  const {flex1} = SchemaStyles();
  const dispatch = useDispatch(),
    store = useStore();
  useEffect(() => {
    startSSB(dispatch).then(() => {
      initializeHandlers(store);
      checkAddon('launch');
    });
  });

  useMemo(
    () => populateListeners({dispatch, feedId, feed, relations}),
    [feedId, feed],
  );

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        data={publicMsg.reverse()}
        keyExtractor={(_, index) => index}
        renderItem={info => <ItemAgent info={info} verbose={verbose} />}
      />
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    verbose: s.cfg.verbose,
    publicMsg: s.public,
    feedId: s.user.feedId,
    relations: s.user.relations,
    feed: s.feed,
  };
};

const mdp = (dispatch, {navigation, route}) => {
  return {};
};

export default connect(msp, mdp)(Home);
