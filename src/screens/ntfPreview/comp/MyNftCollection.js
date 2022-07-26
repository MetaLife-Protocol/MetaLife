/**
 * Nft Item
 */
import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import ComCollectItem from './ComCollectItem';
import ListEmpty from './ListEmpty';
import {
  getCollectionInfo,
  getMyNFTCollectionInfos,
  getNFTInfos,
} from '../../../remote/contractOP';
import {getNftAssetsJson} from '../../../remote/ipfsOP';
import {getCurrentAccount} from '../../../utils';
import CollectListItem from './CollectListItem';

const MyNftCollection = ({navigation, wallet, addCollectionList, nft}) => {
  // console.log('nfttttttttcccccccccc', nft);
  useEffect(() => {
    const address = getCurrentAccount(wallet).address;
    getMyNFTCollectionInfos(address, res => {
      // alert(JSON.stringify(res));
      const list = nft?.collection?.Collection;
      if (nft) {
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].uri === res.uri) {
              // console.log('ccccc', list[i].uri, res.uri);
              return;
            }
          }
        }
      }
      getNftAssetsJson(res.uri).then(collInfo => {
        collInfo.headers['content-type'] === 'application/json' &&
          addCollectionList({
            ...res,
            ...collInfo.data,
          });
      });
    });
  }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('MyCollectionDetail', {address: item.address});
        }}>
        <CollectListItem item={item} />
      </TouchableOpacity>
    );
  };
  const emptyComponent = () => {
    return <ListEmpty />;
  };
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={nft?.collection?.Collection}
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
    nft: s.nft,
  };
};

const mdp = d => {
  return {
    addCollectionList: payload => d({type: 'addCollectionList', payload}),
    // addNft: payload => d({type: 'addNft', payload}),
  };
};

export default connect(msp, mdp)(MyNftCollection);
