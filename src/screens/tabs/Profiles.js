import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {bigNumberFormatUnits} from 'react-native-web3-wallet';
import {connect} from 'react-redux/lib/exports';
import {getPubsRewardTotal} from '../../remote/pubOP';
import {
  getWBalance,
  getWBalanceByContract,
} from '../../remote/wallet/WalletAPI';
import useSchemaStyles from '../../shared/UseSchemaStyles';
import {getCurrentAccount} from '../../utils';
import HeaderProfiles from './profiles/HeaderProfiles';
import {NetworkInfo} from 'react-native-network-info';
import {getNFTInfos} from '../../remote/contractOP';

const Profiles = ({feedId, wallet, setBalance}) => {
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

  useEffect(() => {
    // NetworkInfo.getBSSID().then(console.log);
    // NetworkInfo.getBroadcast().then(console.log);
    // NetworkInfo.getIPAddress().then(console.log);
    // NetworkInfo.getIPV4Address().then(console.log);
    // NetworkInfo.getSubnet().then(console.log);
    // NetworkInfo.getGatewayIPAddress().then(console.log);
    // getNFTInfos('0x993f846fdc1dd6de2abf3087424af0bc36a7cd78', info =>
    //   console.log(info),
    // );
  }, []);

  const getInfo = () => {
    if (type === 'spectrum') {
      getWBalanceByContract(type, 'MLT', address, res => {
        setBalance(res);
        setRefreshing(false);
      });
    } else if (type === 'ethereum') {
      getWBalance(type, address, res => {
        setBalance(res);
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
        const list = res[0].concat(res[1]);
        for (let i = 0; i < list.length; i++) {
          total = list[i].grant_token_amount_subtotals + total;
        }
        setAmount(bigNumberFormatUnits(total.toString()));
        setRefreshing(false);
      })
      .catch(e => console.warn(e));
  };

  useEffect(() => {
    getInfo();
  }, []);

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
          }}
        />
      }>
      <HeaderProfiles />
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
      {/*<RoundBtn title={'contact test'} press={() => callOnce(console.log)} />*/}
      <View style={[styles.earnContainer, flex1]}>
        <View style={[row, flex1, justifySpaceBetween, alignItemsCenter]}>
          <Text style={[text, styles.earnText]}>NFT</Text>
          <Image source={require('../../assets/image/shared/back.png')} />
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
            <Text style={[text, styles.mlt]}>0</Text>
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
            <Text style={[text, styles.mlt]}>0</Text>
          </Pressable>
        </View>
      </View>
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
    setBalance: payload => d({type: 'setBalance', payload}),
  };
};

export default connect(msp, mdp)(Profiles);
