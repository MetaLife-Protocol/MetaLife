/**
 * Created on 07 Jul 2022 by ella
 *
 */

import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import ComCollectItem from './comp/ComCollectItem';
import ListEmpty from './comp/ListEmpty';
import {
  getCollectionInfo,
  getNFTInfos,
  getOpenGalaxyNFTCollectionInfos,
  getOpenGalaxyNFTCollectionListInfo,
} from '../../remote/contractOP';
import {getNftAssetsJson} from '../../remote/ipfsOP';
import OnSaleItem from './comp/OnSaleItem';
import {useNavigation} from '@react-navigation/native';

const OpenGalaxyCollection = ({navigation, addCollections, addNft}) => {
  const [info, setInfo] = useState([]);
  const {navigate} = useNavigation();
  const [refreshing, setRefreshing] = useState(true);
  const [page, setPage] = useState(0);
  const getCollectionList = (isMore, pa) => {
    getOpenGalaxyNFTCollectionListInfo(null, pa, 10).then(result => {
      // console.log('rrrrrrrllllll', pa, result);

      if (result) {
        const DATA = isMore === false ? [...result] : [...info, ...result];
        setInfo(DATA);
        setRefreshing(false);
      } else {
        setRefreshing(false);
      }
      // if (page !== 0 && isMore) {
      //   let data = info;
      //   data = data.concat(result);
      //   setInfo(data);
      // } else {
      //   setInfo(result);
      // }
    });
  };
  useEffect(() => {
    getCollectionList(false, 0);
    // getCollectionInfo(value => {
    //   // console.log('ddddd', value);
    //   addCollections(value);
    //   setInfo(value);
    //   getNFTInfos(undefined, nftCInfo => {
    //     // console.log('collection got: ', nftCInfo);
    //     if (
    //       nftCInfo.id == 14 ||
    //       nftCInfo.id == 19 ||
    //       nftCInfo.id == 21 ||
    //       nftCInfo.id == 22
    //     ) {
    //       return;
    //     }
    //     getNftAssetsJson(nftCInfo.uri).then(nftJInfo => {
    //       // console.log('nft got: ', nftJInfo);
    //       nftJInfo.headers['content-type'] === 'application/json' &&
    //         addNft({
    //           ...nftCInfo,
    //           ...nftJInfo.data,
    //         });
    //     });
    //   });
    // });
  }, []);
  const renderItem = ({item, index}) => {
    // return (
    //   <TouchableOpacity
    //     onPress={() => {
    //       navigation.navigate('NftCollectionDetail', {item: item});
    //     }}>
    //     <ComCollectItem item={item} />
    //   </TouchableOpacity>
    // );
    return (
      <Pressable
        onPress={() =>
          navigate('MyNftDetailView', {
            tokenId: item.token_id.toNumber(),
            address: item.collection,
            ownerOf: item.seller,
            onSale: true,
            callBack: () => {
              // refreshPress();
            },
          })
        }>
        <OnSaleItem isImage={true} index={index} item={item} />
      </Pressable>
    );
  };
  const emptyComponent = () => {
    return <ListEmpty />;
  };
  const refreshPress = () => {
    setRefreshing(true);
    setInfo([]);
    setPage(0);
    getCollectionList(false, 0);
  };
  const endReachedPress = () => {
    setPage(page + 1);
    getCollectionList(true, page + 1);
  };
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={info}
        numColumns={2}
        renderItem={renderItem}
        style={styles.flatList}
        ListEmptyComponent={emptyComponent}
        keyExtractor={(item, index) => item + index}
        refreshing={refreshing}
        onRefresh={refreshPress}
        onEndReachedThreshold={0.1}
        onEndReached={endReachedPress}
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
    addCollections: payload => d({type: 'addCollections', payload}),
    addNft: payload => d({type: 'addNft', payload}),
  };
};

export default connect(msp, mdp)(OpenGalaxyCollection);
