import React, {useCallback, useEffect, useState} from 'react';
import {
  // Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Text from '../../shared/comps/ComText';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux/lib/exports';
import {
  fixWalletAddress,
  fromDateTime,
  getCurrentAccount,
  nftreviationAccount,
  pxToDp,
  screenHeight,
  screenWidth,
} from '../../utils';
import useSchemaStyles, {colorsBasics} from '../../shared/UseSchemaStyles';
import {getNftAssetsJson, ipfsBaseURL} from '../../remote/ipfsOP';
import RoundBtn from '../../shared/comps/RoundBtn';
import {
  getCollectionInfo,
  getNftItemInfo,
  getSaleInfo,
} from '../../remote/contractOP';
import {
  bigNumberFormatUnits,
  bigNumberParseUnits,
  createBigNumber,
} from 'react-native-web3-wallet';
import {contractsConstant} from '../../remote/contractsConstant';
import {financeConfig} from '../../remote/wallet/financeConfig';
import CountDown from '../../shared/comps/CountDown';
import nativeClipboard from 'react-native/Libraries/Components/Clipboard/NativeClipboard';
import Toast from 'react-native-tiny-toast';
import {
  getWBalance,
  getWBalanceByContract,
} from '../../remote/wallet/WalletAPI';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
const bg = require('../../assets/image/profiles/Profiles_backgroud.png');
const btn = require('../../assets/image/profiles/photo.png');
const down = require('../../assets/image/nft/arrow_down.png');
const uparr = require('../../assets/image/nft/up_arrow.png');
const smt = require('../../assets/image/nft/SMT.png');
const mesh = require('../../assets/image/nft/MESH.png');
const mlt = require('../../assets/image/icons/lingtuan.png');
const copy = require('../../assets/image/nft/copy.png');
const vidPlay = require('../../assets/image/nft/playVideo.png');
const vidPause = require('../../assets/image/nft/video_pause.png');

const MyNftDetailView = ({route: {params}, data, nft, wallet, navigation}) => {
  // const {item, symbol} = params;
  const {tokenId, address} = params;
  // const nftKey = Object.keys(nft).length > 0 ? Object.keys(nft)[0] : '';
  // const data =
  //   nft[nftKey].nfts && nft[nftKey].nfts.length > 0
  //     ? nft[nftKey].nfts[index]
  //     : {};
  // console.log('ddddd', item);
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();
  const [isShow, setIsShow] = useState([false]);
  const [list, setList] = useState({});
  const [earn, setEarn] = useState(0);
  const [result, setResult] = useState({
    price: createBigNumber(0).toString(),
    token: '0x0000000000000000000000000000000000000000',
  });
  const [showPrice, setShowPrice] = useState(0);
  const [collectInfo, setCollectInfo] = useState({});
  const downPress = useCallback(() => {
    setIsShow(!isShow);
  }, [isShow]);
  const [isDetail, setIsDetail] = useState([false]);
  const [accountPrice, setAccountPrice] = useState(0);
  const [originPrice, setOriginPrice] = useState(createBigNumber(0));
  // const [meshPrice, setMeshPrice] = useState(0);
  const upPress = useCallback(() => {
    setIsDetail(!isDetail);
  }, [isDetail]);
  const [playVideo, setPlayVideo] = useState(true);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [slideValue, setSlideValue] = useState(0);

  // const [height, setHeight] = useState();
  // useEffect(() => {
  //   Image.getSize(
  //     ipfsBaseURL + item?.image?.split('ipfs://')[1],
  //     (width, height) => {
  //       const heights = Math.floor((screenWidth / width) * height);
  //       setHeight(heights);
  //     },
  //   );
  // }, []);
  const currentAccount = getCurrentAccount(wallet);
  const buyNowHandler = () => {
    if (currentAccount.observer) {
      Toast.show('Observe account cannot buy');
      return;
    }
    const buyprice = originPrice;
    const accountsPrice = accountPrice;
    if (buyprice.gt(accountsPrice)) {
      Toast.show('Insufficient funds');
      return;
    }

    navigation.navigate('CompleteCheckout', {
      tokenId: tokenId,
      address: address,
      image: ipfsBaseURL + 'ipfs/' + list?.image,
      name: list?.name,
      price: showPrice,
      fee: (earn * 1) / 100 + '%',
      token: result?.token,
      iconImg:
        result?.token === '0x0000000000000000000000000000000000000000'
          ? smt
          : contractsConstant.spectrum[result?.token?.toLowerCase()].symbol ===
            'Mesh'
          ? mesh
          : mlt,
      // accountPrice: accountsPrice,
    });
  };

  async function getSaleIn() {
    const results = await getSaleInfo(tokenId.toString(), address);
    try {
      const p = bigNumberFormatUnits(
        results?.price,
        results?.token === '0x0000000000000000000000000000000000000000'
          ? financeConfig.chains.spectrum.decmis
          : contractsConstant.spectrum[results?.token?.toLowerCase()].decmis,
      );
      setOriginPrice(results?.price);
      setShowPrice(p);
      if (results?.token === '0x0000000000000000000000000000000000000000') {
        getWBalance(currentAccount.type, currentAccount.address, res => {
          console.log('smtrrrsss', res);
          setAccountPrice(res);
        });
      } else if (
        contractsConstant.spectrum[results?.token?.toLowerCase()].symbol ===
        'Mesh'
      ) {
        getWBalanceByContract(
          currentAccount.type,
          'Mesh',
          currentAccount.address,
          res => {
            console.log('Meshrrrsss', res);
            setAccountPrice(res);
          },
        );
      } else {
        getWBalanceByContract(
          currentAccount.type,
          'MLT',
          currentAccount.address,
          res => {
            console.log('mltrrrsss', res);
            setAccountPrice(res);
          },
        );
      }
    } catch (e) {
      Toast.show(e);
    }
    setResult(results);
  }

  useEffect(() => {
    getCollectionInfo(info => {
      // console.log('rrrrrttt', info, address);
      setEarn(info.royaltiesPercentageInBips);
      getNftAssetsJson(info.metaInfo).then(nftJInfo => {
        setCollectInfo(nftJInfo.data);
      });
    }, address);
    getSaleIn();
    getNftItemInfo(address, tokenId).then(res => {
      if (res) {
        getNftAssetsJson(res).then(da => {
          // console.log('dddddddd', da);
          setList(da.data);
        });
      }
    });

    return () => {
      params.callBack();
    };
  }, []);
  const clickCopy = () => {
    nativeClipboard.setString(address);
    Toast.show('Contract Address copied');
  };

  const gotoDuration = duration => {
    setDuration(duration.duration);
  };
  const setTime = data => {
    let sliderValue = parseInt(currentTime);
    setSlideValue(sliderValue);
    setCurrentTime(data.currentTime);
  };
  const formatMediaTime = durations => {
    let min = Math.floor(durations / 60);
    let second = durations - min * 60;
    min = min >= 10 ? min : '0' + min;
    second = second >= 10 ? Math.floor(second) : '0' + Math.floor(second);
    return min + ':' + second;
  };
  const clickVideo = () => {
    setPlayVideo(!playVideo);
    setPaused(!paused);
  };

  const time = new Date(result?.duetime?.toNumber() * 1000);
  // alert(result?.duetime?.toNumber());
  const due = time - new Date();
  return (
    <ScrollView style={[flex1, BG]} showsVerticalScrollIndicator={false}>
      {(list && list?.type === 'Audio' && list.cid !== undefined) ||
      (list && list?.type === 'Video' && list.cid !== undefined) ? (
        <View style={styles.videoShow}>
          <Video
            source={{
              uri: ipfsBaseURL + 'ipfs/' + list.cid,
            }}
            resizeMode={'contain'}
            paused={paused}
            onLoad={data => gotoDuration(data)}
            volume={1.0}
            onEnd={() => setPlayVideo(true)}
            playWhenInactive={true}
            onProgress={e => setTime(e)}
            // controls={false}
            style={[styles.topPlay]}
          />
          <View
            style={{
              position: 'absolute',
              zIndex: 1000,
              top: screenHeight * 0.3,
            }}>
            <Pressable style={styles.playView} onPress={clickVideo}>
              <Image source={playVideo ? vidPause : vidPlay} />
              <Text style={[text, styles.playTime]}>
                {formatMediaTime(currentTime) + '/' + formatMediaTime(duration)}
              </Text>
            </Pressable>
            <Slider
              style={{
                height: 40,
                width: screenWidth,
                alignSelf: 'center',
                backgroundColor: 'transparent',
              }}
              value={slideValue}
              maximumValue={duration}
              step={1}
              onValueChange={value => setCurrentTime(value)}
              thumbTintColor="#29DAD7"
              minimumTrackTintColor="#29DAD7"
              maximumTrackTintColor="#DADADA"
            />
          </View>
          <FastImage
            source={
              list && list?.type === 'Audio'
                ? {
                    uri: ipfsBaseURL + 'ipfs/' + list?.image,
                  }
                : null
            }
            style={[styles.topImg]}
            resizeMode="contain"
          />
        </View>
      ) : (
        <FastImage
          source={{
            uri: ipfsBaseURL + 'ipfs/' + list?.image,
          }}
          style={[styles.topImg]}
          resizeMode="contain"
        />
      )}

      <View style={[FG, styles.topView]}>
        <Text
          style={{
            color: colorsBasics.primary,
          }}>{`${collectInfo?.name || ''}`}</Text>
        <Text style={[text, styles.bend]}>{list?.name || ''}</Text>
        <Text style={[text, styles.under]}>{list?.description || ''}</Text>

        <View style={styles.saleView}>
          <Text style={[styles.priceText]}>{`Sale ends ${fromDateTime(
            time,
          )}`}</Text>
          {/*<Text*/}
          {/*  style={[*/}
          {/*    text,*/}
          {/*    styles.timeText,*/}
          {/*    styles.dueText,*/}
          {/*  ]}>{`${result?.duetime} Left`}</Text>*/}
          <CountDown
            activityTimeInfo={{
              remainingTime: time - new Date(),
            }}
          />
          <View style={styles.lines} />
          <Text style={[styles.priceText, {marginTop: 6}]}>Price</Text>
          <View style={styles.priceView}>
            <Image
              source={
                result?.token === '0x0000000000000000000000000000000000000000'
                  ? smt
                  : contractsConstant.spectrum[result?.token?.toLowerCase()]
                      .symbol === 'Mesh'
                  ? mesh
                  : mlt
              }
            />
            <Text style={[text, styles.timeText]}>{showPrice}</Text>
          </View>
        </View>
        <View style={styles.rowView}>
          {/*<FastImage source={btn} style={styles.headImg} />*/}
          <Text style={styles.create}>{'Created by'}</Text>
          <Text style={[styles.textWork]}>
            {nftreviationAccount(list?.create, 6, 4)}
          </Text>
        </View>
        <View style={styles.rowView}>
          {/*<FastImage source={btn} style={styles.headImg} />*/}
          <Text style={styles.create}>{'Owned by'}</Text>
          <Text style={[styles.textWork]}>
            {params?.ownerOf
              ? nftreviationAccount(params?.ownerOf, 6, 4)
              : nftreviationAccount(
                  fixWalletAddress(getCurrentAccount(wallet).address),
                  6,
                  4,
                )}
          </Text>
        </View>
      </View>
      <View style={[FG, styles.collectTop]}>
        <View style={styles.itemView}>
          <Text style={[text, styles.bend]}>About Collection</Text>
          <TouchableOpacity style={styles.downView} onPress={downPress}>
            <Image source={!isShow ? uparr : down} style={styles.arrImg} />
          </TouchableOpacity>
        </View>
        <View style={styles.line} />
        {isShow ? (
          <>
            <View style={styles.ghRow}>
              <Image
                source={{
                  uri: ipfsBaseURL + 'ipfs/' + collectInfo?.logoImage,
                }}
                style={styles.ghImg}
              />
              <Text style={styles.ghText}>{`${collectInfo?.name || ''}`}</Text>
            </View>
            <Text style={styles.ghDetail}>
              {collectInfo?.description || ''}
            </Text>
          </>
        ) : null}
        <View style={styles.line} />
        <View style={[styles.itemView]}>
          <Text style={[text, styles.bend]}>Details</Text>
          <TouchableOpacity style={styles.downView} onPress={upPress}>
            <Image source={!isDetail ? uparr : down} style={styles.arrImg} />
          </TouchableOpacity>
        </View>
        <View style={styles.line} />
        {isDetail ? (
          <>
            <View style={styles.detailItem}>
              <Text style={[text, styles.comText]}>Contract Address</Text>
              <Pressable
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={clickCopy}>
                <Text style={styles.address}>
                  {nftreviationAccount(address, 6, 4)}
                </Text>
                <Image source={copy} style={{marginLeft: 5}} />
              </Pressable>
            </View>
            <View style={styles.detailItem}>
              <Text style={[text, styles.comText]}>Token ID</Text>
              <Text style={styles.tokenText}>{tokenId}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[text, styles.comText]}>Token Standard</Text>
              <Text style={styles.tokenText}>ERC-721</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[text, styles.comText]}>Blockchain</Text>
              <Text style={styles.tokenText}>Spectrum</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[text, styles.comText]}>Creator Fees</Text>
              <Text style={styles.tokenText}>{(earn * 1) / 100 + '%'}</Text>
            </View>
          </>
        ) : null}
        <View style={styles.bottom} />
      </View>
      {due > 0 &&
      fixWalletAddress(params?.ownerOf.toLowerCase()) !==
        fixWalletAddress(getCurrentAccount(wallet).address.toLowerCase()) ? (
        <Pressable
          style={[styles.buyView]}
          title={'Buy now'}
          onPress={buyNowHandler}>
          <Text style={styles.buyText}>Buy now</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topImg: {
    width: '90%',
    // minHeight: 260,
    height: 345,
    alignSelf: 'center',
  },
  topView: {
    paddingHorizontal: pxToDp(15),
    paddingVertical: pxToDp(10),
    marginTop: pxToDp(10),
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: pxToDp(15),
  },
  create: {
    color: '#8E8E92',
    fontSize: 14,
    // marginLeft: pxToDp(11),
  },
  headImg: {
    width: pxToDp(30),
    height: pxToDp(30),
    borderRadius: pxToDp(15),
  },
  textWork: {
    fontSize: 14,
    color: colorsBasics.primary,
    marginLeft: pxToDp(5),
    maxWidth: 250,
  },
  bend: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemView: {
    height: pxToDp(54),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: pxToDp(15),
  },
  line: {
    width: screenWidth,
    height: pxToDp(1),
    backgroundColor: colorsBasics.black,
  },
  collectTop: {
    marginTop: pxToDp(10),
  },
  arrImg: {
    width: pxToDp(12),
    height: pxToDp(7.5),
  },
  under: {
    fontSize: 14,
  },
  ghImg: {
    width: pxToDp(40),
    height: pxToDp(40),
    borderRadius: pxToDp(20),
  },
  ghText: {
    color: colorsBasics.primary,
    fontSize: 16,
    marginLeft: pxToDp(10.5),
  },
  ghRow: {
    flexDirection: 'row',
    paddingHorizontal: pxToDp(15),
    alignItems: 'center',
    marginTop: pxToDp(20),
  },
  ghDetail: {
    color: '#8E8E92',
    fontSize: 14,
    paddingHorizontal: pxToDp(15),
    marginTop: pxToDp(10.5),
    marginBottom: pxToDp(20),
  },
  downView: {
    width: pxToDp(20),
    height: pxToDp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  address: {
    fontSize: 15,
    color: colorsBasics.primary,
    maxWidth: 250,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: pxToDp(38),
    alignItems: 'center',
    paddingHorizontal: pxToDp(15),
  },
  tokenText: {
    color: '#8E8E92',
    fontSize: 15,
  },
  comText: {
    fontSize: 15,
  },
  bottom: {
    height: pxToDp(20),
  },
  buyView: {
    height: 44,
    borderRadius: 22,
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: '#29DAD7',
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyText: {fontSize: 15, color: '#000'},
  saleView: {
    width: screenWidth - 30,
    height: 124,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4E586E',
    marginTop: 20,
    paddingVertical: 10,
    // justifyContent: 'center',
  },
  priceText: {
    fontSize: 14,
    color: '#8E8E92',
    marginLeft: 10,
  },
  lines: {
    width: screenWidth - 30,
    height: 1,
    backgroundColor: '#4E586E',
  },
  timeText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  priceView: {flexDirection: 'row', marginLeft: 10, marginTop: 6},
  dueText: {marginVertical: 7},
  topPlay: {
    width: '90%',
    // minHeight: 260,
    height: 345,
    alignSelf: 'center',
    position: 'absolute',
    // top: screenHeight * 0.3,
    zIndex: 100,
  },
  playView: {
    flexDirection: 'row',
    marginLeft: 15,
  },
  playTime: {fontSize: 17, marginLeft: 17.5},
  videoShow: {},
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
    data: {},
  };
};

export default connect(msp, mdp)(MyNftDetailView);
