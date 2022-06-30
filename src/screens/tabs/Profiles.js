import React, {useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import {getWBalance} from '../../remote/wallet/WalletAPI';
import useSchemaStyles from '../../shared/UseSchemaStyles';
import {getCurrentAccount} from '../../utils';
import HeaderProfiles from './profiles/HeaderProfiles';

const Profiles = ({wallet, setBalance}) => {
  const {text, flex1} = useSchemaStyles();
  const {type, address} = getCurrentAccount(wallet);

  const [refreshing, setRefreshing] = useState(false);

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
            getWBalance(type, address, res => {
              setRefreshing(false);
              setBalance(res);
            });
          }}
        />
      }>
      <HeaderProfiles />
      <View style={[flex1]}></View>
    </ScrollView>
  );
};

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
