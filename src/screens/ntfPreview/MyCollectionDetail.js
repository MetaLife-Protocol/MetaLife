import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  // Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Text from '../../shared/comps/ComText';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../shared/UseSchemaStyles';
import FastImage from 'react-native-fast-image';
import NftItem from './comp/NftItem';
import {getCollectionInfo, getNFTInfos} from '../../remote/contractOP';
import HeaderRightBtn from '../tabs/HeaderRightBtn';
import {getNftAssetsJson, ipfsBaseURL} from '../../remote/ipfsOP';
import ListEmpty from './comp/ListEmpty';
import {screenWidth} from '../../utils';
const nftHead = require('../../assets/image/nft/nft_head.png');
const more = require('../../assets/image/nft/nft_create.png');

const MyCollectionDetail = ({route: {params}, darkMode, nft, navigation}) => {
  // const {item} = params;
  const {address} = params;
  const nftKey = Object.keys(nft).length > 0 ? Object.keys(nft)[0] : '',
    nfts = nftKey
      ? nft[nftKey].collection && nft[nftKey].collection.length > 0
        ? nft[nftKey].collection
        : []
      : [];
  const symbol = '';
  const {text, alignItemsCenter, justifyCenter, flex1, BG, FG} =
    useSchemaStyles();
  const windowWidth = useWindowDimensions().width;
  const {goBack, navigate} = useNavigation();
  const [date, setDate] = useState([]);
  const [headInfo, setHeadInfo] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: props => (
        <HeaderRightBtn
          btnIcon={more}
          btnHandler={() => {
            // !searching && setTipVisible(true);
            navigation.navigate('CreateItemNft', {address: address});
          }}
        />
      ),
    });
  }, [navigation, address]);

  useEffect(() => {
    getCollectionInfo(res => {
      // console.log('rrrrrrrffffff', res);
      getNftAssetsJson(res.metaInfo).then(nftJInfo => {
        // alert(JSON.stringify(nftJInfo.data.logoImage));
        if (nftJInfo.data) {
          setHeadInfo(nftJInfo.data);
        }
      });
    }, address);
    getNFTInfos(undefined, null, 0, 0, address).then(result => {
      if (result.length > 0) {
        let newList = [];
        for (let i = 0; i < result.length; i++) {
          getNftAssetsJson(result[i].uri).then(list => {
            // console.log('adadadadad', list);
            newList.push({...list.data, tokenId: result[i].id});
          });
        }
        setDate(newList);
      }
    });
    return () => {
      setDate([]);
      setHeadInfo({});
    };
  }, []);

  const Header = () => {
    // alert(JSON.stringify(headInfo));
    // console.log('sdsdsd', ipfsBaseURL + 'ipfs/' + headInfo.logoImage);
    return (
      <View style={[alignItemsCenter, justifyCenter, styles.listHeader]}>
        <ImageBackground
          style={[styles.header, {width: windowWidth}]}
          source={{uri: ipfsBaseURL + 'ipfs/' + headInfo?.bannerImage}}>
          {/* <Pressable onPress={() => goBack()} style={styles.arrowLeft}>
            <Image
              source={require('../../assets/image/profiles/ArrowLeft.png')}
            />
          </Pressable> */}
        </ImageBackground>
        <FastImage
          style={[styles.roundView]}
          source={{
            uri: ipfsBaseURL + 'ipfs/' + headInfo?.logoImage,
          }}
        />
        <Text style={[text, styles.title]}>{`${headInfo?.name}`}</Text>
        <Text style={[styles.desc]}>{headInfo?.description}</Text>
      </View>
    );
  };

  const emptyComponent = () => {
    return <ListEmpty />;
  };

  const renderItem = ({item, index}) => {
    return (
      <Pressable
        onPress={() =>
          // navigate('MyNftDetailView', {item: item, symbol: symbol})
          navigate('MyItemDetailView', {
            tokenId: item.tokenId,
            address: address,
          })
        }>
        <NftItem
          isImage={true}
          index={index}
          item={{
            symbol: item.name,
            image: item.image,
            name: '',
            id: item.tokenId,
          }}
          symbol={symbol}
        />
      </Pressable>
    );
  };

  return (
    <View style={flex1}>
      {/* <Header /> */}
      <FlatList
        ListHeaderComponent={<Header />}
        data={date}
        numColumns={2}
        renderItem={renderItem}
        extraData={date}
        ListEmptyComponent={emptyComponent}
        removeClippedSubviews={false}
        keyExtractor={(_, i) => i}
        style={[flex1]}
      />
    </View>
  );
};

const icons = {
  whiteBg: require('../../assets/image/nft/nft_white_bg.png'),
  blackBg: require('../../assets/image/nft/nft_dark_bg.png'),
  share: require('../../assets/image/profiles/share.png'),
};

const styles = StyleSheet.create({
  arrowLeft: {
    position: 'absolute',
    top: 50,
    left: 30,
    padding: 5,
  },
  listHeader: {
    paddingBottom: 15,
  },
  header: {
    // backgroundColor: '#7966F3',
    height: 213,
  },
  roundView: {
    height: 130,
    width: 130,
    borderRadius: 65,
    marginTop: -90,
    zIndex: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 19,
    marginTop: 13,
  },
  desc: {
    color: '#8E8E92',
    fontSize: 14,
    lineHeight: 17,
    marginTop: 5,
    marginHorizontal: 40,
    textAlign: 'center',
  },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    wallet: s.wallet,
    nft: s.nft,
    darkMode: s.cfg.darkMode,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(MyCollectionDetail);
