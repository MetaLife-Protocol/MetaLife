/**
 * Nft Item
 */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Pressable} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import NftItem from './NftItem';
import ListEmpty from './ListEmpty';
import {
  getMyNFTSellItemListInfo,
  getNFTInfos,
  getOpenGalaxyNFTCollectionInfos,
} from '../../../remote/contractOP';
import Text from '../../../shared/comps/ComText';
import {fixWalletAddress, getCurrentAccount} from '../../../utils';
import {getNftAssetsJson} from '../../../remote/ipfsOP';
import useSchemaStyles from '../../../shared/UseSchemaStyles';
import OnSaleItem from './OnSaleItem';
import LoadingView from '../../../shared/comps/LoadingView';

const MyNftItem = ({
  wallet,
  addNftItemList,
  nft,
  collection,
  darkMode,
  emptyNftItemList,
}) => {
  console.log('nnnnnnnnffff', collection);
  const {navigate} = useNavigation();
  const myaddress = getCurrentAccount(wallet).address;
  const collectKey =
      Object.keys(collection).length > 0 ? Object.keys(collection)[0] : '',
    collectionItem = collectKey
      ? collection &&
        collection?.nftItem &&
        collection?.nftItem[myaddress] &&
        collection?.nftItem[myaddress].length > 0
        ? collection?.nftItem[myaddress]
        : []
      : [];
  // console.log('kkkkkkk', collectionItem);
  const [type, setType] = useState(0);
  const [onSaleItem, setOnSaleItem] = useState([]);
  const [showLoading, setShowLoading] = useState(
    collectionItem && collectionItem.length > 0 ? false : true,
  );
  let isEnds = true;
  // const [isEnd, setIsEnd] = useState(false);
  const renderItem = ({item, index}) => {
    return (
      <Pressable
        onPress={() =>
          navigate('MyItemDetailView', {
            tokenId: item.id,
            address: item.collectionAddress,
            ownerOf: item.ownerOf,
          })
        }>
        <NftItem
          isImage={true}
          index={index}
          item={{
            // symbol: item.name,
            image: item.image,
            name: item.name,
            id: item.id,
          }}
          symbol={' '}
        />
      </Pressable>
    );
  };
  const renderSaleItem = ({item, index}) => {
    return (
      <Pressable
        onPress={() =>
          navigate('MyItemDetailView', {
            tokenId: item.token_id.toNumber(),
            address: item.collection,
            ownerOf: item.seller,
            onSale: true,
            callback: () => fetchOnSaleData(),
          })
        }>
        <OnSaleItem isImage={true} index={index} item={item} />
      </Pressable>
    );
  };
  async function fetchOnSaleData() {
    const arrData = await getMyNFTSellItemListInfo(null, myaddress, 0, 10);
    // console.log('rrrraaaaa', arrData);
    setOnSaleItem(arrData);
    setShowLoading(false);
  }
  async function fetchData() {
    const result = await getOpenGalaxyNFTCollectionInfos();
    // console.log('resulttt', result);
    if (result.length > 0) {
      if (isEnds) {
        let newList = [];
        for (let i = 0; i < result.length; i++) {
          if (isEnds) {
            getNFTInfos(
              fixWalletAddress(getCurrentAccount(wallet).address),
              res => {
                // console.log('rrrrr', res);
                let index =
                  collectionItem && collectionItem.length > 0
                    ? collectionItem.findIndex(item => {
                        if (item.uri === res.uri) {
                          return true;
                        } else {
                          return false;
                        }
                      })
                    : -1;
                if (isEnds) {
                  if (index == -1) {
                    getNftAssetsJson(res.uri).then(collInfo => {
                      if (isEnds) {
                        setShowLoading(false);
                        collInfo.headers['content-type'] ===
                          'application/json' &&
                          addNftItemList({
                            ...res,
                            ...collInfo.data,
                            type: getCurrentAccount(wallet).address,
                          });
                      }
                    });
                  }
                }
                // for (var j = 0; j < list.length; j++) {
                //   if (list[j].uri === res.uri) {
                //     return;
                //   }
                // }
              },
              0,
              0,
              result[i].address,
            );
          }
          // newList.push(infos);
        }
      }
    }
  }

  useEffect(() => {
    if (isEnds) {
      if (type === 0) {
        fetchData();
      } else {
        setShowLoading(true);
        fetchOnSaleData();
      }
    }

    return () => {
      isEnds = false;
      // if (collectionItem && collectionItem.length == 0) {
      //   // emptyNftItemList({type: getCurrentAccount(wallet).address});
      // }
    };
  }, []);
  const emptyComponent = () => {
    return <ListEmpty />;
  };
  const onclickSale = type => {
    setType(type);
    if (type === 1) {
      fetchOnSaleData();
    } else {
      fetchData();
    }
  };
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();
  return (
    <View style={flex1}>
      <View style={[FG, styles.topView]}>
        <Pressable style={styles.notSale} onPress={() => onclickSale(0)}>
          <Text
            style={[
              styles.comText,
              {
                color: darkMode
                  ? type === 0
                    ? '#fff'
                    : '#8E8E92'
                  : type === 0
                  ? '#8E8E92'
                  : '#fff',
              },
            ]}>
            My items
          </Text>
        </Pressable>
        <Pressable style={styles.onSale} onPress={() => onclickSale(1)}>
          <Text
            style={[
              text,
              styles.comText,
              {
                color: darkMode
                  ? type === 1
                    ? '#fff'
                    : '#8E8E92'
                  : type === 1
                  ? '#8E8E92'
                  : '#fff',
              },
            ]}>
            My listings
          </Text>
        </Pressable>
      </View>
      {type === 0 ? (
        <FlatList
          data={collectionItem}
          numColumns={2}
          renderItem={renderItem}
          style={styles.flatList}
          ListEmptyComponent={emptyComponent}
          keyExtractor={(item, index) => item + index}
        />
      ) : (
        <FlatList
          data={onSaleItem}
          numColumns={2}
          renderItem={renderSaleItem}
          style={styles.flatList}
          ListEmptyComponent={emptyComponent}
          keyExtractor={(item, index) => item + index}
        />
      )}
      {showLoading && <LoadingView />}
    </View>
  );
};
const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    marginTop: 10,
  },
  item: {height: 200, width: 200, backgroundColor: '#fff'},
  topView: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
  },
  notSale: {width: 120, justifyContent: 'center', alignItems: 'center'},
  comText: {fontSize: 16},
  onSale: {width: 100, justifyContent: 'center', alignItems: 'center'},
});
const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    wallet: s.wallet,
    nft: s.nft,
    collection: s.collection,
    darkMode: s.cfg.darkMode,
  };
};

const mdp = d => {
  return {
    addNftItemList: payload => d({type: 'addNftItemList', payload}),
    emptyNftItemList: payload => d({type: 'emptyNftItemList', payload}),
  };
};

export default connect(msp, mdp)(MyNftItem);
