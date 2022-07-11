import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import {getCurrentAccount} from '../../../../utils';
import CoinItem from './items/CoinItem';
import Empty from './items/Empty';

const WalletCoinTabScreen = props => {
  const {navigation, wallet, darkMode} = props;
  const {FG, row, justifySpaceBetween, flex1, alignItemsCenter, text} =
    useSchemaStyles();
  const {type, address} = getCurrentAccount(wallet);

  return (
    <View style={[FG, flex1]}>
      {type === 'spectrum' ? (
        <>
          <CoinItem type={type} address={address} cType={'SMT'} total={0} />
          <CoinItem type={type} address={address} cType={'Mesh'} total={0} />
          <CoinItem type={type} address={address} cType={'MLT'} total={0} />
        </>
      ) : type === 'ethereum' ? (
        <>
          <CoinItem type={type} address={address} cType={'ETH'} total={0} />
        </>
      ) : (
        <Empty darkMode={darkMode} />
      )}
    </View>
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

export default connect(msp, mdp)(WalletCoinTabScreen);
