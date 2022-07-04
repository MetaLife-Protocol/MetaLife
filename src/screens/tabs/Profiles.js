import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import {getWBalance} from '../../remote/wallet/WalletAPI';
import useSchemaStyles from '../../shared/UseSchemaStyles';
import {getCurrentAccount} from '../../utils';
import HeaderProfiles from './profiles/HeaderProfiles';

const Profiles = ({wallet, setBalance}) => {
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
      <Pressable
        style={[styles.earnContinar, flex1]}
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
          <Text style={[text, styles.mlt]}>150</Text>
        </View>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  earnContinar: {
    paddingHorizontal: 30,
    paddingVertical: 20,
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
