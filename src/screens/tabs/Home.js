import React, {useEffect, useState} from 'react';
import {FlatList, Modal, SafeAreaView, StyleSheet} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import ItemAgent from './home/post/ItemAgent';
import {initializeHandlers} from '../../remote/ssb/SsbListeners';
import {startSSB} from '../../remote/ssb/starter';
import {useStore} from 'react-redux';
import {checkAddon} from '../../remote/ssb/SsbHandlers';
import SearchBar from '../../shared/comps/SearchBar';
import {searchPublicMsgByPostId} from '../../store/filters/MsgFilters';
import {useTimer} from '../../shared/Hooks';
import {getConnectedPeers} from '../../remote/ssb/ssbOP';
import ImageViewer from 'react-native-image-zoom-viewer';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

const Home = ({
  verbose,
  publicMsg,
  setFeedId,
  setConnectedPeers,
  viewImages,
  setViewImages,
}) => {
  const {flex1} = SchemaStyles(),
    {searchBar} = styles;
  const {setOptions, getState} = useNavigation();
  const route = useRoute();
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

  useFocusEffect(() => {
    setOptions({tabBarBadge: null});
  });

  useEffect(() => {
    getState().index !== 0 && setOptions({tabBarBadge: ''});
  }, [publicMsg]);

  useTimer(() => getConnectedPeers(setConnectedPeers), 10 * 1000, [], false);

  function changeTextHandler(text) {
    setKW(text);
    setResult(text ? searchPublicMsgByPostId(publicMsg, text) : []);
  }

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        ListHeaderComponent={
          <SearchBar
            style={[searchBar]}
            placeholder={'Search with message id'}
            changeTextHandler={changeTextHandler}
          />
        }
        data={result.length > 0 || KW !== '' ? result : publicMsg}
        keyExtractor={(_, index) => index}
        renderItem={info => <ItemAgent info={info} verbose={verbose} />}
      />
      <Modal visible={viewImages.imgs.length > 0} transparent={true}>
        <ImageViewer
          index={viewImages.index}
          enableSwipeDown={true}
          useNativeDriver={true}
          onSwipeDown={() => setViewImages({index: 0, imgs: []})}
          imageUrls={viewImages.imgs}
        />
      </Modal>
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
    viewImages: s.runtime.images,
  };
};

const mdp = d => {
  return {
    setFeedId: id => d({type: 'setFeedId', payload: id}),
    setStagedPeers: v => d({type: 'setStagedPeers', payload: v}),
    setConnectedPeers: v => d({type: 'setConnectedPeers', payload: v}),
    setViewImages: imgs => d({type: 'images', payload: imgs}),
  };
};

export default connect(msp, mdp)(Home);
