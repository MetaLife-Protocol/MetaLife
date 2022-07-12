/**
 * Nft Item
 */
import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import ComCollectItem from './ComCollectItem';
import ListEmpty from './ListEmpty';
import {getCollectionInfo, getNFTInfos} from '../../../remote/contractOP';

const MyNftCollection = ({navigation}) => {
  const [info, setInfo] = useState({});
  useEffect(() => {
    getCollectionInfo(value => {
      setInfo(value);
      // addCollections(value);
      // getNFTInfos(undefined, nftCInfo => {
      //   getNftAssetsJson(nftCInfo.uri).then(nftJInfo => {
      //     nftJInfo.headers['content-type'] === 'application/json' &&
      //       addNft({
      //         ...nftCInfo,
      //         ...nftJInfo.data,
      //       });
      //   });
      // });
    });
  }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('NftCollectionDetail', {item: item});
        }}>
        <ComCollectItem item={item} />
      </TouchableOpacity>
    );
  };
  const emptyComponent = () => {
    return <ListEmpty />;
  };
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={[info]}
        numColumns={2}
        renderItem={renderItem}
        style={styles.flatList}
        ListEmptyComponent={emptyComponent}
        keyExtractor={(item, index) => item + index}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    marginVertical: 10,
    marginLeft: 8,
  },
});
const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    wallet: s.wallet,
  };
};

const mdp = d => {
  return {
    // addCollections: payload => d({type: 'addCollections', payload}),
    // addNft: payload => d({type: 'addNft', payload}),
  };
};

export default connect(msp, mdp)(MyNftCollection);
