import React, {useLayoutEffect, useState} from 'react';
import {View, StyleSheet, Pressable, FlatList, Image} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import Text from '../../../../shared/comps/ComText';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import ListEmpty from '../../../ntfPreview/comp/ListEmpty';
const toggle = require('../../../../assets/image/icons/icon_toggle_default.png');

const WalletRecord = () => {
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();
  const renderItem = () => {
    return (
      <View style={[styles.item]}>
        <View style={styles.left}>
          <Image source={toggle} style={styles.togImg} />
          <View style={styles.leftMargin}>
            <Text style={[text, styles.icon]}>OX39</Text>
            <Text style={styles.time}>2021-10-15</Text>
          </View>
        </View>
        <Text style={[styles.addText, {color: '#29DAD7'}]}>+ 4399 SMT</Text>
      </View>
    );
  };

  const emptyComponent = () => {
    return <ListEmpty />;
  };

  return (
    <View style={[flex1, BG]}>
      <FlatList
        data={[{}, {}]}
        renderItem={renderItem}
        ListEmptyComponent={emptyComponent}
        keyExtractor={(item, index) => item + index}
        style={[styles.listView, FG]}
      />
      <View style={styles.bottomView}>
        <View style={[styles.btnView, styles.bgColor]}>
          <Text style={styles.tranText}>Transfer</Text>
        </View>
        <View style={[styles.btnView, styles.sgColor]}>
          <Text style={styles.tranText}>Collection</Text>
        </View>
      </View>
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
