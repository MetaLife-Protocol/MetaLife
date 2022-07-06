import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {bigNumberFormatUnits} from 'react-native-web3-wallet';
import {connect} from 'react-redux/lib/exports';
import {formatDate} from '../../../../metalife-base/src/utils/DateUtils';
import {getPubsRewardList, getPubsRewardTotal} from '../../../../remote/pubOP';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';

const Item = ({title, pub, number, time}) => {
  const {text, row, justifySpaceBetween, FG, marginTop10} = useSchemaStyles();
  return (
    <View style={[row, justifySpaceBetween, marginTop10, FG, styles.item]}>
      <View>
        <Text style={[text, styles.item_text1]}>{title}</Text>
        <Text style={[text, marginTop10, styles.item_text2]}>From {pub}</Text>
      </View>
      <View>
        <Text style={[styles.item_text3]}>+{number} MLT</Text>
        <Text style={[text, marginTop10, styles.item_text4]}>{time}</Text>
      </View>
    </View>
  );
};

const Earnings = ({feedId}) => {
  const {text, alignItemsCenter, justifyCenter, flex1} = useSchemaStyles();
  const [rewardList, setRewardList] = useState([]);
  const [amount, setAmount] = useState(0);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate('EarningsShare', {amount})}
          style={{padding: 8}}>
          <Image source={icons.share} />
        </Pressable>
      ),
    });
  }, [navigation, amount]);

  const getRewardList = () => {
    const hour24 = new Date();
    hour24.setHours(hour24.getHours() - 24);
    getPubsRewardList({
      client_id: feedId,
      time_from: hour24.getTime(),
      time_to: Date.now(),
    })
      .then(res => {
        const list = res[0]
          .concat(res[1])
          .sort((a, b) => b.reward_time - a.reward_time);
        setRewardList(list);
      })
      .catch(e => console.warn(e));
    getPubsRewardTotal({
      client_id: feedId,
      time_from: hour24.getTime(),
      time_to: Date.now(),
    })
      .then(res => {
        console.log('total', res);
        let total = 0;
        const list = res[0].concat(res[1]);
        for (let i = 0; i < list.length; i++) {
          total = list[i].grant_token_amount_subtotals + total;
        }
        setAmount(bigNumberFormatUnits(total.toString()));
      })
      .catch(e => console.warn(e));
  };

  useEffect(() => {
    getRewardList();
  }, []);

  return (
    <SafeAreaView style={[flex1]}>
      <ImageBackground style={[styles.header]} source={icons.shareBg}>
        <View style={[alignItemsCenter, justifyCenter, styles.earnContent]}>
          <Text style={[text, styles.mltText]}>24 Hours</Text>
          <Text style={[styles.mlt]}>{amount} MLT</Text>
        </View>
      </ImageBackground>
      <FlatList
        style={[styles.margin15]}
        ListHeaderComponent={<Text style={[text]}>Detail</Text>}
        data={rewardList}
        renderItem={({item, index}) => (
          <Item
            title={item.reward_reason}
            keyExtractor={index}
            pub={item.pub}
            number={bigNumberFormatUnits(item.grant_token_amount.toString())}
            time={formatDate({time: item.reward_time})}
          />
        )}
      />
    </SafeAreaView>
  );
};

const icons = {
  shareBg: require('../../../../assets/image/profiles/earings_bg.png'),
  share: require('../../../../assets/image/profiles/share.png'),
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#7966F3',
    height: 213,
    marginTop: -70,
  },
  earnContent: {
    flex: 1,
    marginTop: 60,
    justifyContent: 'center',
    borderRadius: 12,
  },
  mltText: {
    color: '#F8F9FD',
    fontSize: 15,
    lineHeight: 18,
  },
  mlt: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    lineHeight: 33,
    color: '#fff',
  },
  margin15: {margin: 15},
  item: {borderRadius: 12, paddingVertical: 10, paddingHorizontal: 15},
  item_text1: {fontSize: 15, fontWeight: 'bold'},
  item_text2: {color: '#8E8E92'},
  item_text3: {color: '#29DAD7', textAlign: 'right'},
  item_text4: {textAlign: 'right', color: '#8E8E92'},
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

export default connect(msp, mdp)(Earnings);
