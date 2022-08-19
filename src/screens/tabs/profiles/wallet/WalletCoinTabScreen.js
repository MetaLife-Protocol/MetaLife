import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import {getCurrentAccount, getCurrentBalance} from '../../../../utils';
import CoinItem from './items/CoinItem';
import Empty from './items/Empty';

const WalletCoinTabScreen = props => {
  const {navigation, wallet, darkMode, route, setTokenOption, setBalance} =
    props;
  const params = route.params;
  const {FG, flex1} = useSchemaStyles();
  const {type, address} = getCurrentAccount(wallet);

  const pressItem = (cType, total) => {
    setTokenOption({
      type: type,
      option: 'coin',
      cType: cType,
      amount: total,
    });
    navigation.goBack();
  };

  return (
    <View style={[FG, flex1]}>
      {type === 'spectrum' ? (
        <>
          <CoinItem
            pressItem={params.select ? pressItem : null}
            type={type}
            address={address}
            cType={'SMT'}
            total={getCurrentBalance(wallet, 'SMT')}
            setBalance={setBalance}
          />
          <CoinItem
            pressItem={params.select ? pressItem : null}
            type={type}
            address={address}
            cType={'Mesh'}
            total={getCurrentBalance(wallet, 'Mesh')}
            setBalance={setBalance}
          />
          <CoinItem
            pressItem={params.select ? pressItem : null}
            type={type}
            address={address}
            cType={'MLT'}
            total={getCurrentBalance(wallet, 'MLT')}
            setBalance={setBalance}
          />
        </>
      ) : type === 'ethereum' ? (
        <>
          <CoinItem
            pressItem={params.select ? pressItem : null}
            type={type}
            address={address}
            cType={'ETH'}
            total={getCurrentBalance(wallet, 'ETH')}
            setBalance={setBalance}
          />
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
  return {
    setTokenOption: payload => d({type: 'setTokenOption', payload}),
    setBalance: payload => d({type: 'setBalance', payload}),
  };
};

export default connect(msp, mdp)(WalletCoinTabScreen);
