import {useNavigation} from '@react-navigation/native';
import React from 'react';
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
const nftHead = require('../../assets/image/nft/nft_head.png');

const NftCollectionDetail = ({route: {params}, darkMode, nft}) => {
  const {item} = params;
  const nftKey = Object.keys(nft).length > 0 ? Object.keys(nft)[0] : '',
    nfts = nftKey
      ? nft[nftKey].nfts && nft[nftKey].nfts.length > 0
        ? nft[nftKey].nfts
        : []
      : [];
  const info = nft[nftKey]?.metaInfo;
  const symbol = nft[nftKey]?.symbol;
  const name = nft[nftKey]?.name;
  // console.log('nftnftnft', nft);
  const {text, alignItemsCenter, justifyCenter, flex1, BG, FG} =
    useSchemaStyles();
  const windowWidth = useWindowDimensions().width;
  const {goBack, navigate} = useNavigation();

  const Header = () => {
    return (
      <View style={[alignItemsCenter, justifyCenter, styles.listHeader]}>
        <ImageBackground
          style={[styles.header, {width: windowWidth}]}
          source={darkMode ? icons.blackBg : icons.whiteBg}>
          {/* <Pressable onPress={() => goBack()} style={styles.arrowLeft}>
            <Image
              source={require('../../assets/image/profiles/ArrowLeft.png')}
            />
          </Pressable> */}
        </ImageBackground>
        <FastImage style={[styles.roundView]} source={nftHead} />
        <Text style={[text, styles.title]}>{`${item?.symbol || symbol}: ${
          item?.name || name
        }`}</Text>
        <Text style={[styles.desc]}>{item?.metaInfo || info}</Text>
      </View>
    );
  };

  return (
    <View style={[flex1]}>
      {/* <Header /> */}
      <FlatList
        ListHeaderComponent={<Header />}
        data={nfts}
        numColumns={2}
        renderItem={({item, index}) => (
          <Pressable
            onPress={() =>
              navigate('MyNftDetailView', {item: item, symbol: symbol})
            }>
            <NftItem index={index} item={item} symbol={symbol} />
          </Pressable>
        )}
        keyExtractor={(_, i) => i}
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
    backgroundColor: '#7966F3',
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

export default connect(msp, mdp)(NftCollectionDetail);
