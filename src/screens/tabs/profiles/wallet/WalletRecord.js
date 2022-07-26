import React, {useEffect, useLayoutEffect, useState} from 'react';
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
const toggle = require('../../../../assets/image/icons/icon_toggle_default.png');
const send = require('../../../../assets/image/icons/send.png');

const WalletRecord = ({wallet}) => {
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();
  const pages = 1;
  const [list, setList] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getRecordList(false);
  }, []);

  const getRecordList = isMore => {
    // setRefreshing(true);
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
    // "service":"transaction",
    //   "method":"transaction_list",
    //   "sn":"1ac34_1658296487000",
    //   "params":{"address":"0x0d0efccda4f079c0dd1b728297a43ee54d7170cd"
    // getWalletRecord(body)
    //   .then(res => {
    //     alert(JSON.stringify(res));
    //   })
    //   .catch(err => {
    //     alert(err);
    //   });
    console.log('dddddddbbb', body);
    getWalletRecord(body, res => {
      // alert(JSON.stringify(res));
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
    console.log('dddddddd', item.to, getCurrentAccount(wallet).address);
    return (
      <View style={[styles.item]}>
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
        <Text
          style={[
            styles.addText,
            {color: mineWall === item.to ? '#29DAD7' : '#6989EA'},
          ]}>{`${mineWall === item.to ? '+' : '-'} ${item.value} SMT`}</Text>
      </View>
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
  icon: {
    fontSize: 16,
  },
  time: {
    fontSize: 14,
    color: '#4E586E',
    marginTop: 10,
  },
  addText: {
    fontSize: 16,
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
