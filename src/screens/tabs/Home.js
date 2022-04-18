import React, {useEffect} from 'react';
import {FlatList, SafeAreaView} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import ItemAgent from './home/ItemAgent';
import {initializeHandlers} from '../../remote/SsbListeners';
import {startSSB} from '../../remote/starter';
import {useStore} from 'react-redux';
import {checkAddon} from '../../remote/SsbHandlers';

const Home = ({verbose, publicMsg, setFeedId}) => {
  const {flex1} = SchemaStyles();
  const store = useStore();
  useEffect(() => {
    window.ssb ||
      startSSB().then(ssb => {
        window.ssb = ssb;
        setFeedId(ssb.id);
        initializeHandlers(store);
        checkAddon('launch');
      });
  });

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
  };
};

const mdp = d => {
  return {setFeedId: id => d({type: 'setFeedId', payload: id})};
};

export default connect(msp, mdp)(Home);
