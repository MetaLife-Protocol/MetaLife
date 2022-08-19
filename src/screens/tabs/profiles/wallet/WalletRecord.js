import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, FlatList, Image} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import Text from '../../../../shared/comps/ComText';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import ListEmpty from '../../../ntfPreview/comp/ListEmpty';
import {getWalletRecord} from '../../../../remote/wallet/WalletAPI';
import {
  fixWalletAddress,
  getCurrentAccount,
  nftreviationAccount,
} from '../../../../utils';
import {fromDate} from '../../../../utils';
import {useNavigation} from '@react-navigation/native';
import {bigNumberFormatUnits} from 'react-native-web3-wallet';
const toggle = require('../../../../assets/image/wallet/transfer_in.png');
const send = require('../../../../assets/image/wallet/transfer_out.png');

const WalletRecord = ({wallet}) => {
  const {text, flex1, BG, FG} = useSchemaStyles();
  const [list, setList] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [page, setPage] = useState(1);
  const {navigate} = useNavigation();

  useEffect(() => {
    getRecordList(false);
  }, []);

  const getRecordList = isMore => {
    const body = {
      service: 'transaction',
      method: 'transaction_list',
      sn: 'metalife_' + Math.random(),
      params: {
        address: fixWalletAddress(getCurrentAccount(wallet).address),
        pageLimit: '50',
        page: page,
      },
    };
    getWalletRecord(body, res => {
      setRefreshing(false);
      if (page !== 1 && isMore) {
        let data = list;
        data = data.concat(res.data);
        setList(data);
      } else {
        setList(res?.data);
      }
    });
  };

  const renderItem = ({item, index}) => {
    const mineWall = '0x' + getCurrentAccount(wallet).address;
    return (
      <Pressable
        style={[styles.item]}
        onPress={() => {
          navigate('TransactionDetail', {
            gasPrice: bigNumberFormatUnits(item.gasPrice, 9),
            hash: item.transactionHash,
          });
        }}>
        <View style={styles.left}>
          <Image
            source={mineWall === item.to ? toggle : send}
            style={styles.togImg}
          />
          <View style={styles.leftMargin}>
            <Text style={[text, styles.icon]}>
              {nftreviationAccount(item.transactionHash, 6, 4)}
            </Text>
            <Text style={styles.time}>{fromDate(item.timestamp)}</Text>
          </View>
        </View>
        <View style={styles.rightMargin}>
          <Text
            style={[
              styles.addText,
              {color: mineWall === item.to ? '#29DAD7' : '#6989EA'},
            ]}>{`${mineWall === item.to ? '+' : '-'} ${item.value} SMT`}</Text>
          {item.status !== 1 ? (
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
    setList([]);
    getRecordList(false);
  };

  const endReachedPress = () => {
    setPage(page + 1);
    getRecordList(true);
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
      {/*<View style={styles.bottomView}>*/}
      {/*  <View style={[styles.btnView, styles.bgColor]}>*/}
      {/*    <Text style={styles.tranText}>Transfer</Text>*/}
      {/*  </View>*/}
      {/*  <View style={[styles.btnView, styles.sgColor]}>*/}
      {/*    <Text style={styles.tranText}>Collection</Text>*/}
      {/*  </View>*/}
      {/*</View>*/}
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

export default connect(msp, mdp)(WalletRecord);
