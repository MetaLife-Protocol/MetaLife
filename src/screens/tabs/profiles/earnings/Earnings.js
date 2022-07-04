import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';

const Item = () => {
  const {text, row, justifySpaceBetween, FG, marginTop10} = useSchemaStyles();
  return (
    <View style={[row, justifySpaceBetween, marginTop10, FG, styles.item]}>
      <View>
        <Text style={[text, styles.item_text1]}>Login</Text>
        <Text style={[text, marginTop10, styles.item_text2]}>
          From MetaLife Planet 1
        </Text>
      </View>
      <View>
        <Text style={[styles.item_text3]}>+10 MLT</Text>
        <Text style={[text, marginTop10, styles.item_text4]}>
          2022.06.29 10:30
        </Text>
      </View>
    </View>
  );
};

const Earnings = ({}) => {
  const {text, alignItemsCenter, justifyCenter} = useSchemaStyles();

  const navigation = useNavigation();

  return (
    <>
      <ImageBackground
        style={[styles.header]}
        source={require('../../../../assets/image/profiles/earings_bg.png')}>
        <View style={[alignItemsCenter, justifyCenter, styles.earnContent]}>
          <Text style={[text, styles.mltText]}>24 Hours</Text>
          <Text style={[styles.mlt]}>150 MLT</Text>
        </View>
      </ImageBackground>
      <View style={[styles.margin15]}>
        <Text style={[text]}>Detail</Text>
        <Item />
      </View>
    </>
  );
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
