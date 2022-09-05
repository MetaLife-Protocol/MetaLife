import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import Text from '../../../../shared/comps/ComText';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import ListEmpty from '../../../ntfPreview/comp/ListEmpty';
import {
  fixWalletAddress,
  fromDateTime,
  getCurrentAccount,
  nftreviationAccount,
} from '../../../../utils';
import {useNavigation} from '@react-navigation/native';
import {bigNumberFormatUnits} from 'react-native-web3-wallet';
import Realm from 'realm';
import {dbConfig} from '../../../../remote/realmDB';
import {financeConfig} from '../../../../remote/wallet/financeConfig';
import {contractsConstant} from '../../../../remote/contractsConstant';
const toggle = require('../../../../assets/image/wallet/transfer_in.png');
const send = require('../../../../assets/image/wallet/transfer_out.png');

const WalletLocalRecord = ({wallet, route: {params}}) => {
  const {text, flex1, BG, FG} = useSchemaStyles();
  const [list, setList] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [page, setPage] = useState(1);
  const {navigate} = useNavigation();
  const {address, type} = getCurrentAccount(wallet);
  const fixedAddress = fixWalletAddress(address);

  const getRecord = currentPage => {
    Realm.open(dbConfig)
      .then(realm => {
        const tasksDB = realm.objects('TransactionRecord');
        let filtered;
        if (params?.cType) {
          filtered = `from = "${fixedAddress}" && contractAddress = "${
            financeConfig.chains[type].contracts.coin[params?.cType].address
          }" `;
        } else {
          filtered = `from = "${fixedAddress.toLowerCase()}"`;
        }
        const tasksList = tasksDB
          .filtered(filtered)
          .sorted('timestamp', true)
          .slice(0, currentPage * 20);
        setList([...tasksList]);
        setRefreshing(false);
      })
      .catch(e => {
        console.log('open-error', e);
      });
  };

  useEffect(() => {
    getRecord(1);
  }, []);

  useEffect(() => {
    const refreshListener = DeviceEventEmitter.addListener(
      'localRecord:delete',
      () => getRecord(page),
    );
    const updateListener = DeviceEventEmitter.addListener(
      'localRecord:update',
      () => getRecord(page),
    );
    return () => {
      refreshListener.remove();
      updateListener.remove();
    };
  }, []);
  const renderItem = ({item, index}) => {
    return (
      <Pressable
        style={[styles.item]}
        onPress={() => {
          navigate('TransactionDetail', {
            gasPrice: bigNumberFormatUnits(item?.gasPrice.toString(), 9),
            hash: item.transactionHash,
            packaging: item.status === 99 ? true : false,
          });
        }}>
        <View style={styles.left}>
          <Image
            source={fixedAddress === item.to ? toggle : send}
            style={styles.togImg}
          />
          <View style={styles.leftMargin}>
            <Text style={[text, styles.icon]}>
              {nftreviationAccount(item.transactionHash, 6, 4)}
            </Text>
            <Text style={styles.time}>{fromDateTime(item.timestamp)}</Text>
          </View>
        </View>
        <View style={styles.rightMargin}>
          <Text
            style={[
              styles.addText,
              {color: fixedAddress === item.to ? '#29DAD7' : '#6989EA'},
            ]}>{`${fixedAddress === item.to ? '+' : '-'} ${bigNumberFormatUnits(
            item.value + '',
          )} ${
            contractsConstant.spectrum[item.contractAddress]?.symbol ?? 'SMT'
          }`}</Text>
          {item.status === 99 ? (
            <Text style={styles.failed}>transaction package...</Text>
          ) : item.status !== 1 ? (
            <Text style={styles.failed}>transaction failed</Text>
          ) : null}
        </View>
      </Pressable>
    );
  };

  const emptyComponent = () => {
    return <ListEmpty />;
  };

  const refreshPress = () => {
    setRefreshing(true);
    setPage(1);
    getRecord(1);
  };

  const endReachedPress = () => {
    setPage(page + 1);
    getRecord(page + 1);
  };
  return (
    <View style={[flex1, BG]}>
      <FlatList
        data={list}
        renderItem={renderItem}
        ListEmptyComponent={emptyComponent}
        keyExtractor={(item, index) => item + index}
        style={[styles.listView, FG]}
        refreshing={refreshing}
        onRefresh={refreshPress}
        onEndReachedThreshold={0.1}
        onEndReached={endReachedPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  left: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftMargin: {
    marginLeft: 10,
  },
  rightMargin: {
    marginRight: 10,
  },
  icon: {
    fontSize: 16,
  },
  time: {
    fontSize: 14,
    color: '#4E586E',
    marginTop: 10,
  },
  failed: {
    fontSize: 14,
    color: '#E73553',
    marginTop: 10,
  },
  addText: {
    fontSize: 16,
    textAlign: 'right',
  },
  listView: {
    marginTop: 10,
    flex: 1,
    padding: 10,
    backgroundColor: '#00f',
  },
  btnView: {
    width: 165,
    height: 44,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgColor: {
    backgroundColor: '#6989EA',
  },
  bottomView: {
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sgColor: {
    backgroundColor: '#29DAD7',
  },
  tranText: {fontSize: 15, color: '#000'},
  togImg: {
    width: 27,
    height: 27,
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
  return {};
};

export default connect(msp, mdp)(WalletLocalRecord);
