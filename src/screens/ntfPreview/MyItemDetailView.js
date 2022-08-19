import React, {useCallback, useEffect, useState, useLayoutEffect} from 'react';
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
  formTimeUtil,
  fromDateTime,
  getCurrentAccount,
  nftreviationAccount,
  pxToDp,
  savePicture,
  screenHeight,
  screenWidth,
} from '../../utils';
import useSchemaStyles, {colorsBasics} from '../../shared/UseSchemaStyles';
import {getNftAssetsJson, ipfsBaseURL} from '../../remote/ipfsOP';
import {
  cancelListingNFT,
  getCollectionInfo,
  getLimitSell,
  getNftItemInfo,
  getSaleInfo,
  pushSell,
} from '../../remote/contractOP';
import HeaderRightBtn from '../tabs/HeaderRightBtn';
import {RoundBtn} from '../../metalife-base';
import PasswordModel from '../../shared/comps/PasswordModal';
import {getAccount} from '../../remote/wallet/WalletAPI';
import SellModal from './comp/SellModal';
import TransactionModal from './comp/TransactionModal';
import {
  bigNumberFormatUnits,
  bigNumberParseUnits,
  createBigNumber,
} from 'react-native-web3-wallet';
import {financeConfig} from '../../remote/wallet/financeConfig';
import CountDown from '../../shared/comps/CountDown';
import {contractsConstant} from '../../remote/contractsConstant';
import nativeClipboard from 'react-native/Libraries/Components/Clipboard/NativeClipboard';
import Toast from 'react-native-tiny-toast';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
const bg = require('../../assets/image/profiles/Profiles_backgroud.png');
const btn = require('../../assets/image/profiles/photo.png');
const down = require('../../assets/image/nft/arrow_down.png');
const uparr = require('../../assets/image/nft/up_arrow.png');
const shareB = require('../../assets/image/nft/transfer_white.png');
const shareW = require('../../assets/image/nft/transfer_black.png');
const smt = require('../../assets/image/nft/SMT.png');
const mesh = require('../../assets/image/nft/MESH.png');
const mlt = require('../../assets/image/icons/lingtuan.png');
const copy = require('../../assets/image/nft/copy.png');
const vidPlay = require('../../assets/image/nft/playVideo.png');
const vidPause = require('../../assets/image/nft/video_pause.png');

const MyItemDetailView = ({
  route: {params},
  wallet,
  navigation,
  darkMode,
  deleteNftItemList,
}) => {
  // alert(JSON.stringify(params));
  const {tokenId, address} = params;
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();
  const [isShow, setIsShow] = useState([false]);
  const [list, setList] = useState({});
  const [earn, setEarn] = useState(0);
  const downPress = useCallback(() => {
    setIsShow(!isShow);
  }, [isShow]);
  const [isDetail, setIsDetail] = useState([false]);
  const upPress = useCallback(() => {
    setIsDetail(!isDetail);
  }, [isDetail]);
  const [pwdVisible, setPwdVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [visible, setVisible] = useState(false);
  const [price, setPrice] = useState(0);
  const [pwd, setPwd] = useState(null);
  const [showTrans, setShowTrans] = useState(false);
  const [selectMap, setSelectMap] = useState({type: 'MLT', month: '1 day'});
  // const [gasPrice, setGasPrice] = useState(createBigNumber(0));
  const [gasLimit, setGasLimit] = useState(createBigNumber(0));
  const [contract, setContract] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [delet, setDelet] = useState(false);
  const [result, setResult] = useState({
    price: createBigNumber(0).toString(),
    token: '0x0000000000000000000000000000000000000000',
  });
  const [showPrice, setShowPrice] = useState(0);
  const [collectInfo, setCollectInfo] = useState({});
  const [playVideo, setPlayVideo] = useState(true);
  const currentAccount = getCurrentAccount(wallet);
  async function getSaleIn() {
    const results = await getSaleInfo(tokenId.toString(), address);
    try {
      const p = bigNumberFormatUnits(
        results?.price,
        results?.token === '0x0000000000000000000000000000000000000000'
          ? financeConfig.chains.spectrum.decmis
          : contractsConstant.spectrum[results?.token?.toLowerCase()].decmis,
      );
      setShowPrice(p);
    } catch (e) {}
    setResult(results);
    // console.log('rrrrrr', results);
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: props =>
        params && params.onSale ? null : (
          <HeaderRightBtn
            btnIcon={darkMode ? shareB : shareW}
            btnHandler={() => {
              // !searching && setTipVisible(true);
              navigation.navigate('TransferView', {
                tokenId: tokenId,
                collectAddress: address,
                image: ipfsBaseURL + 'ipfs/' + list?.image,
                name: list?.name,
              });
            }}
          />
        ),
    });
  }, [navigation, address, list]);

  useEffect(() => {
    if (params?.onSale) {
      getSaleIn();
    }
    getCollectionInfo(info => {
      // console.log('rrrrrttt', info, address);
      setEarn(info.royaltiesPercentageInBips);
      getNftAssetsJson(info.metaInfo).then(nftJInfo => {
        setCollectInfo(nftJInfo.data);
      });
    }, address);
    // getNftItemInfo(address, tokenId).then(res => {
    //   if (res) {
    //     getNftAssetsJson(res).then(da => {
    //       console.log('dddddddd', da);
    //       setList(da.data);
    //     });
    //   }
    // });
    getNftList();
  }, []);
  let urL = '';
  async function getNftList() {
    const res = await getNftItemInfo(address, tokenId);
    const assresult = await getNftAssetsJson(res);
    setList(assresult.data);
    urL = assresult.data?.cid;
  }
  // console.log('rrrrrdddd', list.cid, urL);
  const clickCreate = () => {
    if (currentAccount.observer) {
      Toast.show('Observe account cannot create');
      return;
    }
    // setPwdVisible(true);
    setVisible(true);
  };

  const clickcancelBtn = () => {
    if (currentAccount.observer) {
      Toast.show('Observe account cannot cancel');
      return;
    }
    setPwdVisible(true);
  };

  const clickcancelListing = pwd => {
    setToastVisible(true);
    setToastContent('loading...');
    const currentAccount = getCurrentAccount(wallet);
    // getAccount(currentAccount?.address, (isExit, keystore) => {
    cancelListingNFT(
      currentAccount.type,
      '',
      pwd,
      tokenId,
      address,
      cb => {
        params.callback();
        Toast.show('Cancel listing complete');
        navigation.goBack();
        setPwdVisible(false);
        setToastVisible(false);
      },
      er => {
        setPwdVisible(false);
        setToastVisible(false);
      },
    );
    // });
  };

  const onConfirmTransaction = pwd => {
    // onCreateCollection(pwd);
    if (params?.onSale) {
      clickcancelListing(pwd);
      return;
    }
    // setPwd(pwd);
    setToastVisible(true);
    setToastContent('loading...');
    const currentAccount = getCurrentAccount(wallet);
    const channel =
      selectMap.type === 'SMT'
        ? '0x0000000000000000000000000000000000000000'
        : selectMap.type === 'MESH'
        ? financeConfig.contracts[currentAccount?.type].Mesh.address
        : financeConfig.contracts[currentAccount?.type][selectMap?.type]
            .address;
    const surePrice =
      selectMap.type === 'SMT'
        ? bigNumberParseUnits(
            price,
            financeConfig.chains[currentAccount.type].decmis,
          )
        : selectMap.type === 'MESH'
        ? bigNumberParseUnits(
            price,
            financeConfig.contracts[currentAccount.type].Mesh.decmis,
          )
        : bigNumberParseUnits(
            price,
            financeConfig.contracts[currentAccount.type][selectMap.type].decmis,
          );
    // console.log('chchchch', channel);
    // getAccount(currentAccount?.address, (isExit, keystore) => {
    getLimitSell(
      currentAccount.type,
      '',
      pwd,
      address,
      tokenId,
      '0',
      channel,
      surePrice,
      formTimeUtil(selectMap.month),
      (cb, contract) => {
        // console.log('ccccc', cb.toNumber());
        setGasLimit(cb);
        setContract(contract);
        setPwdVisible(false);
        setToastVisible(false);
        setShowTrans(true);
      },
      er => {
        setPwdVisible(false);
        setToastVisible(false);
      },
    );
    // });
  };

  const onListPress = (type, month) => {
    if (price === 0) {
      Toast.show('please set price');
      return;
    }
    setPwdVisible(true);
    setSelectMap({type: type, month: month});
  };

  const confirmPress = (gasLimits, gasPrices) => {
    setShowLoading(true);
    const currentAccount = getCurrentAccount(wallet);
    const channel =
      selectMap.type === 'SMT'
        ? '0x0000000000000000000000000000000000000000'
        : selectMap.type === 'MESH'
        ? financeConfig.contracts[currentAccount?.type].Mesh.address
        : financeConfig.contracts[currentAccount?.type][selectMap.type].address;
    const surePrice =
      selectMap.type === 'SMT'
        ? bigNumberParseUnits(
            price + '',
            financeConfig.chains[currentAccount.type].decmis,
          )
        : selectMap.type === 'MESH'
        ? bigNumberParseUnits(
            price,
            financeConfig.contracts[currentAccount.type].Mesh.decmis,
          )
        : bigNumberParseUnits(
            price + '',
            financeConfig.contracts[currentAccount.type][selectMap.type].decmis,
          );
    // getAccount(currentAccount?.address, (isExit, keystore) => {
    pushSell(
      currentAccount.type,
      contract,
      // keystore,
      // pwd,
      address,
      tokenId,
      '0',
      channel,
      surePrice,
      formTimeUtil(selectMap.month),
      gasLimits * 10000,
      hash => {
        setPwdVisible(false);
        setToastVisible(false);
        setShowLoading(false);
        navigation.navigate('TransactionDetail', {
          gasPrice: bigNumberFormatUnits(gasPrices, 9),
          hash,
        });
        if (!delet) {
          deleteNftItemList({
            type: currentAccount?.address,
            collectionAddress: address,
            id: tokenId,
          });
          setDelet(true);
        }
      },
      er => {
        setPwdVisible(false);
        setToastVisible(false);
        setShowLoading(false);
      },
    );
    // });
  };
  const clickCopy = () => {
    nativeClipboard.setString(address);
    Toast.show('Contract Address copied');
  };
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [slideValue, setSlideValue] = useState(0);
  const time = new Date(result?.duetime?.toNumber() * 1000);
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
  const onEndClick = e => {
    // console.log('rrrreeeebbb', e);
    setPlayVideo(!playVideo);
    setPaused(!paused);
  };

  return (
    <ScrollView
      style={[flex1, BG]}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="always">
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
            onEnd={onEndClick}
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
        {params?.onSale ? (
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
        ) : null}
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
            <Image source={isShow ? uparr : down} style={styles.arrImg} />
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
            <Image source={isDetail ? uparr : down} style={styles.arrImg} />
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
      {params?.onSale ? (
        <RoundBtn
          press={clickcancelBtn}
          style={styles.buttonContainer}
          title={'Cancel listing'}
        />
      ) : (
        <RoundBtn
          press={clickCreate}
          style={styles.buttonContainer}
          title={'Sell'}
        />
      )}

      <PasswordModel
        darkMode={darkMode}
        pwdVisible={pwdVisible}
        setPwdVisible={setPwdVisible}
        toastVisible={toastVisible}
        setToastVisible={setToastVisible}
        toastContent={toastContent}
        toastDuriation={6000000}
        onConfirm={wallet => {
          onConfirmTransaction(wallet);
        }}
      />
      <SellModal
        visible={visible}
        darkMode={darkMode}
        setVisible={setVisible}
        setPrice={setPrice}
        onListPress={onListPress}
      />
      <TransactionModal
        showTrans={showTrans}
        setShowTrans={setShowTrans}
        darkMode={darkMode}
        list={{
          // price: price + selectMap.type,
          price: '0 ' + selectMap.type,
          to: '0x4f47b5f2685d5d108d008577728242905ff9e5a8',
          from: fixWalletAddress(getCurrentAccount(wallet).address),
          gasLimit: gasLimit,
          content: 'Listing NFT',
          type: selectMap.type === 'MESH' ? 'Mesh' : selectMap.type,
        }}
        showLoading={showLoading}
        confirmPress={confirmPress}
        wallet={wallet}
      />
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
    marginLeft: pxToDp(0),
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
  buttonContainer: {
    width: screenWidth - 30,
    height: 44,
    borderRadius: 22,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
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
});

const msp = s => {
  return {
    darkMode: s.cfg.darkMode,
    feedId: s.user.feedId,
    wallet: s.wallet,
    nft: s.nft,
  };
};

const mdp = d => {
  return {
    deleteNftItemList: payload => d({type: 'deleteNftItemList', payload}),
  };
};

export default connect(msp, mdp)(MyItemDetailView);
