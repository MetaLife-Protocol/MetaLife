import React, {useEffect, useLayoutEffect} from 'react';
import {FlatList, Modal, SafeAreaView, StyleSheet} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import {useNavigation, useRoute} from '@react-navigation/native';
import ItemAgent from '../home/post/ItemAgent';
import PeerDetailsHeader from './details/PeerDetailsHeader';
import {trainFeed} from '../../../remote/ssb/ssbAPI';
import {batchMsgCB} from '../../../store/MsgCB';
import {useDispatch} from 'react-redux';
import ImageViewer from 'react-native-image-zoom-viewer';

const PeerDetailsScreen = ({
  verbose,
  selfFeedId,
  relations,
  info,
  feed,
  headerImg,
  setHeaderImages,
}) => {
  const {flex1} = SchemaStyles(),
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
      <Modal visible={headerImg.imgs.length > 0} transparent={true}>
        <ImageViewer
          index={headerImg.index}
          enableSwipeDown={true}
          useNativeDriver={true}
          onSwipeDown={() => setHeaderImages({index: 0, imgs: []})}
          imageUrls={headerImg.imgs}
        />
      </Modal>
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
    headerImg: s.runtime.header,
  };
};

const mdp = d => {
  return {
    setHeaderImages: imgs => d({type: 'header', payload: imgs}),
  };
};

export default connect(msp, mdp)(PeerDetailsScreen);
