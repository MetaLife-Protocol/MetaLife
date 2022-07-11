import React, {useEffect} from 'react';
import {FlatList, ScrollView, View} from 'react-native';
import {connect} from 'react-redux';
import {getNFTInfos, getNFTTotal} from '../../../../remote/contractOP';
import {getWBalanceByContract} from '../../../../remote/wallet/WalletAPI';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import {getCurrentAccount} from '../../../../utils';
import Empty from './items/Empty';
import NftItem from './items/NftItem';

const WalletNftTabScreen = props => {
  const {navigation, darkMode, wallet} = props;
  const {FG, flex1} = useSchemaStyles();

  const {address} = getCurrentAccount(wallet);

  return (
    <FlatList
      style={[FG, flex1, {paddingHorizontal: 10}]}
      data={[1]}
      numColumns={3}
      renderItem={() => <NftItem cType={'GGT'} address={address} />}
      ListEmptyComponent={<Empty />}
      keyExtractor={(item, index) => item + index}
    />
  );
};
const msp = s => {
  return {
    cfg: s.cfg,
    darkMode: s.cfg.darkMode,
    feedId: s.user.feedId,
    relations: s.user.relations,
    infoDic: s.info,
    wallet: s.wallet,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(WalletNftTabScreen);
