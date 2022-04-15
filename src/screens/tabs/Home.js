import React, {useEffect, useMemo} from 'react';
import {FlatList, SafeAreaView} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import ItemAgent from './home/ItemAgent';
import {initializeHandlers} from '../../remote/SsbListeners';
import {startSSB} from '../../remote/starter';
import {useDispatch} from 'react-redux';
import {checkAddon, populateHandlers} from '../../remote/SsbHandlers';

const Home = ({verbose, feedId, feed, relations, publicMsg}) => {
  const {flex1} = SchemaStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    startSSB(dispatch).then(() => {
      initializeHandlers();
      checkAddon('launch');
    });
  });

  useMemo(
    () => populateHandlers({dispatch, feedId, feed, relations}),
    [feedId, feed],
  );

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        data={publicMsg}
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
