import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Text from '../../shared/comps/ComText';
import {bigNumberFormatUnits} from 'react-native-web3-wallet';
import {connect} from 'react-redux/lib/exports';
import {getPubsRewardTotal} from '../../remote/pubOP';
import {
  getWBalance,
  getWBalanceByContract,
} from '../../remote/wallet/WalletAPI';
import useSchemaStyles from '../../shared/UseSchemaStyles';
import {getCurrentAccount, screenWidth} from '../../utils';
import HeaderProfiles from './profiles/HeaderProfiles';
import {getMyNFTCollectionInfos} from '../../remote/contractOP';
import Toast from 'react-native-tiny-toast';

const Profiles = ({
  feedId,
  wallet,
  setBalance,
  cfg: {darkMode},
  collection,
}) => {
  const {
    text,
    flex1,
    row,
    justifySpaceBetween,
    alignItemsCenter,
    justifyCenter,
    BG,
    FG,
    marginTop10,
  } = useSchemaStyles();
  const {type, address} = getCurrentAccount(wallet);

  const [refreshing, setRefreshing] = useState(false);
  const {navigate} = useNavigation();
  const [amount, setAmount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isList, setIsList] = useState([]);

  useFocusEffect(() => {
    // callAuto();
  });

  // todo: refactor to wallet API
  const getInfo = () => {
    if (type === 'spectrum') {
      getWBalanceByContract(type, 'MLT', address, res => {
        setBalance({
          cType: 'MLT',
          balance: res,
        });
        setRefreshing(false);
      });
    } else if (type === 'ethereum') {
      getWBalance(type, address, res => {
        setBalance({
          cType: 'ETH',
          balance: res,
        });
        setRefreshing(false);
      });
    }

    const hour24 = new Date();
    hour24.setHours(hour24.getHours() - 24);
    getPubsRewardTotal({
      client_id: feedId,
      time_from: hour24.getTime(),
      time_to: Date.now(),
    })
      .then(res => {
        let total = 0;
        const list = res;
        for (let i = 0; i < list.length; i++) {
          total = list[i].grant_token_amount_subtotals + total;
        }
        const totalString = Number(total).toLocaleString().replace(/,/g, '');
        setAmount(bigNumberFormatUnits(totalString, 18));
        setRefreshing(false);
      })
      .catch(e => console.warn(e));
  };
  const getNftInfo = () => {
    getMyNFTCollectionInfos(getCurrentAccount(wallet).address).then(res => {
      setIsList(res);
    });
  };
  useEffect(() => {
    getInfo();
    getNftInfo();
  }, []);
  // todo: refactor end

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <ScrollView
      stickyHeaderIndices={[0]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          enabled={true}
          colors={['#29DAD7']}
          tintColor={'#29DAD7'}
          onRefresh={() => {
            setRefreshing(true);
            getInfo();
            getNftInfo();
          }}
        />
      }>
      <HeaderProfiles />
      {/*<RoundBtn title={'contact test'} press={callOnce} />*/}
      <Pressable
        style={[styles.earnContainer, flex1]}
        onPress={() => {
          navigate('Earnings');
        }}>
        <View style={[row, flex1, justifySpaceBetween, alignItemsCenter]}>
          <Text style={[text, styles.earnText]}>Earnings</Text>
          <Image source={require('../../assets/image/shared/back.png')} />
        </View>
        <View
          style={[
            alignItemsCenter,
            justifyCenter,
            FG,
            marginTop10,
            styles.earnContent,
          ]}>
          <Text style={[text, styles.mltText]}>24 Hours（MLT）</Text>
          <Text style={[text, styles.mlt]}>{amount}</Text>
        </View>
      </Pressable>
      <View style={[styles.earnContainer, flex1]}>
        <View style={[row, flex1, justifySpaceBetween, alignItemsCenter]}>
          <Text style={[text, styles.earnText]}>NFT</Text>
          <Pressable
            onPress={() => {
              setVisible(true);
            }}>
            <Image
              source={
                darkMode
                  ? require('../../assets/image/icons/create_black.png')
                  : require('../../assets/image/icons/create_white.png')
              }
            />
          </Pressable>
        </View>
        <View style={[row]}>
          <Pressable
            onPress={() => {
              navigate('NftCollection', {
                tab: 'Item',
                title: 'My NFT',
              });
            }}
            style={[
              flex1,
              alignItemsCenter,
              justifyCenter,
              FG,
              marginTop10,
              styles.nftContent,
            ]}>
            <Text style={[text, styles.mltText]}>Item</Text>
            <Text style={[text, styles.mlt]}>
              {Object.keys(collection).length > 0
                ? (collection &&
                    collection?.nftItem &&
                    collection?.nftItem[address]?.length) ||
                  0
                : 0}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigate('NftCollection', {
                tab: 'Collection',
                title: 'My NFT',
              });
            }}
            style={[
              flex1,
              alignItemsCenter,
              justifyCenter,
              FG,
              marginTop10,
              styles.nftContent,
            ]}>
            <Text style={[text, styles.mltText]}>Collection</Text>
            <Text style={[text, styles.mlt]}>{`${
              collection[address]?.length || 0
            }`}</Text>
          </Pressable>
        </View>
      </View>
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.closeModal} onPress={closeModal} />
        <View style={[styles.modalView, flex1]}>
          <View
            style={[
              {backgroundColor: darkMode ? '#232929' : '#fff'},
              styles.modalItem,
            ]}>
            <Pressable
              style={[flex1, styles.colItem]}
              onPress={() => {
                setVisible(false);
                navigate('CreateItemCollection');
              }}>
              <Text style={[text]}>Collection</Text>
            </Pressable>
            <Pressable
              style={[flex1, styles.colItem]}
              onPress={() => {
                setVisible(false);
                if (isList.length === 0) {
                  Toast.show('Please create your collection first', {
                    position: Toast.position.CENTER,
                  });
                  return;
                }
                navigate('CreateItemNft');
              }}>
              <Text style={[text]}>NFT</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={closeModal}
            style={[
              {backgroundColor: darkMode ? '#232929' : '#fff'},
              styles.modalCancel,
            ]}>
            <Text style={[text]}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  earnContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  earnText: {
    fontWeight: 'bold',
    fontSize: 17,
    lineHeight: 20,
  },
  earnContent: {
    height: 90,
    borderRadius: 12,
  },
  nftContent: {
    height: 90,
    borderRadius: 12,
    margin: 5,
  },
  mltText: {
    color: '#4E586E',
    fontSize: 13,
  },
  mlt: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth,
  },
  modalItem: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 105,
  },
  colItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancel: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    height: 54,
  },
  closeModal: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(000, 000, 000, 0.4)',
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    wallet: s.wallet,
    collection: s.collection,
  };
};

const mdp = d => {
  return {
    setBalance: payload => d({type: 'setBalance', payload}),
  };
};

export default connect(msp, mdp)(Profiles);
