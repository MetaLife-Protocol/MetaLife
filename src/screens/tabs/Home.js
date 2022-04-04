import React from 'react';
import {FlatList, SafeAreaView} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import ItemAgent from './home/ItemAgent';
import {useSsb} from '../../store/hook/SsbHook';

const Home = ({verbose, feedId, feed, publicMsg}) => {
  const {flex1} = SchemaStyles();
  console.log(feed[feedId][0][0].value.sequence || 0);
  useSsb();

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
    feedId: s.user.feedId,
    feed: s.feed,
    publicMsg: s.public,
  };
};

const mdp = (dispatch, {navigation, route}) => {
  return {};
};

export default connect(msp, mdp)(Home);
