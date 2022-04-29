import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import ItemAgent from './home/post/ItemAgent';
import {initializeHandlers} from '../../remote/SsbListeners';
import {startSSB} from '../../remote/starter';
import {useStore} from 'react-redux';
import {checkAddon} from '../../remote/SsbHandlers';
import SearchBar from '../../shared/comps/SearchBar';
import {searchPublicMsgByPostId} from '../../store/filters/MsgFilters';
import {useTimer} from '../../shared/Hooks';
import {getConnectedPeers, getStagedPeers} from '../../remote/ssbOP';

const Home = ({
  verbose,
  publicMsg,
  setFeedId,
  setStagedPeers,
  setConnectedPeers,
}) => {
  const {flex1} = SchemaStyles(),
    {searchBar} = styles;
  const store = useStore();
  const [result, setResult] = useState([]);
  const [KW, setKW] = useState('');
  useEffect(() => {
    window.ssb ||
      startSSB().then(ssb => {
        window.ssb = ssb;
        setFeedId(ssb.id);
        initializeHandlers(store);
        checkAddon('launch');
        getConnectedPeers(setConnectedPeers);
      });
  }, []);

  useTimer(() => getConnectedPeers(setConnectedPeers), 10 * 1000, [], false);

  function changeTextHandler(text) {
    setKW(text);
    setResult(text ? searchPublicMsgByPostId(publicMsg, text) : []);
  }

  return (
    <SafeAreaView style={[flex1]}>
      <SearchBar style={[searchBar]} changeTextHandler={changeTextHandler} />
      <FlatList
        data={result.length > 0 || KW !== '' ? result : publicMsg}
        keyExtractor={(_, index) => index}
        renderItem={info => <ItemAgent info={info} verbose={verbose} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchBar: {marginVertical: 10},
});

const msp = s => {
  return {
    verbose: s.cfg.verbose,
    publicMsg: s.public,
  };
};

const mdp = d => {
  return {
    setFeedId: id => d({type: 'setFeedId', payload: id}),
    setStagedPeers: v => d({type: 'setStagedPeers', payload: v}),
    setConnectedPeers: v => d({type: 'setConnectedPeers', payload: v}),
  };
};

export default connect(msp, mdp)(Home);
