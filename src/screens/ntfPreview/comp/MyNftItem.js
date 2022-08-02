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

const MyNftItem = ({wallet, addNftItemList, nft}) => {
  console.log('nnnnnnnnffff', nft);
  const {navigate} = useNavigation();
  // const [list, setList] = useState([]);
  const renderItem = ({item, index}) => {
    return (
      <Pressable
        onPress={() =>
          navigate('MyItemDetailView', {
            tokenId: item.id,
            address: item.collectionAddress,
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
      console.log('resulttt', result);
      if (result.length > 0) {
        let newList = [];
        for (let i = 0; i < result.length; i++) {
          getNFTInfos(
            fixWalletAddress(getCurrentAccount(wallet).address),
            res => {
              console.log('rrrrr', res);
              const list = nft?.nftItem?.nftItem;
              if (list && list.length > 0) {
                for (var j = 0; j < list.length; j++) {
                  if (list[j].uri === res.uri) {
                    return;
                  }
                }
              }

              getNftAssetsJson(res.uri).then(collInfo => {
                collInfo.headers['content-type'] === 'application/json' &&
                  addNftItemList({
                    ...res,
                    ...collInfo.data,
                    type: 'nftItem',
                  });
              });
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
        data={nft?.nftItem?.nftItem}
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
  };
};

const mdp = d => {
  return {
    addNftItemList: payload => d({type: 'addNftItemList', payload}),
  };
};

export default connect(msp, mdp)(MyNftItem);
