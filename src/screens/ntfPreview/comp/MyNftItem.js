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
  getNFTInfos,
  getOpenGalaxyNFTCollectionInfos,
} from '../../../remote/contractOP';
import {fixWalletAddress, getCurrentAccount} from '../../../utils';
import {getNftAssetsJson} from '../../../remote/ipfsOP';

const MyNftItem = ({wallet, addNftItemList, nft, collection}) => {
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
  const renderItem = ({item, index}) => {
    return (
      <Pressable
        onPress={() =>
          navigate('MyItemDetailView', {
            tokenId: item.id,
            address: item.collectionAddress,
            ownerOf: item.ownerOf,
            transfer: true,
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
  useEffect(() => {
    fetchData();
    async function fetchData() {
      const result = await getOpenGalaxyNFTCollectionInfos();
      // console.log('resulttt', result);
      if (result.length > 0) {
        let newList = [];
        for (let i = 0; i < result.length; i++) {
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
              if (index == -1) {
                getNftAssetsJson(res.uri).then(collInfo => {
                  collInfo.headers['content-type'] === 'application/json' &&
                    addNftItemList({
                      ...res,
                      ...collInfo.data,
                      type: getCurrentAccount(wallet).address,
                    });
                });
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
          // newList.push(infos);
        }
        // const date = newList.flat();
        // console.log('dddd', date);
        // for (let j = 0; j < date.length; j++) {
        //   const list = nft?.nftItem?.nftItem;
        //   if (list && list.length > 0) {
        //     let da = date[j].uri;
        //     for (let li = 0; li < list.length; li++) {
        //       if (list[li].uri === da) {
        //         return;
        //       } else {
        //         getNftAssetsJson(date[j].uri).then(collInfo => {
        //           collInfo.headers['content-type'] === 'application/json' &&
        //             addNftItemList({
        //               ...date[j],
        //               ...collInfo.data,
        //               type: 'nftItem',
        //             });
        //         });
        //       }
        //     }
        //   }
        //
        //   // newData.push(list);
        // }
        // setList(newData);
        // console.log('rrrrrrreeeedd', newData);
      }
    }
    // getOpenGalaxyNFTCollectionInfos().then(async result => {
    //
    // });
  }, []);
  const emptyComponent = () => {
    return <ListEmpty />;
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={collectionItem}
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
    marginTop: 10,
  },
  item: {height: 200, width: 200, backgroundColor: '#fff'},
});
const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    wallet: s.wallet,
    nft: s.nft,
    collection: s.collection,
  };
};

const mdp = d => {
  return {
    addNftItemList: payload => d({type: 'addNftItemList', payload}),
  };
};

export default connect(msp, mdp)(MyNftItem);
