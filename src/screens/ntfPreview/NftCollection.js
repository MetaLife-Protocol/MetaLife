/**
 * Created on 06 Jul 2022 by lonmee
 *
 */

import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../shared/UseSchemaStyles';
import TabBar from './comp/TabBar';
import {colorsSchema} from '../../shared/UseSchemaStyles';
import MyNftItem from './comp/MyNftItem';
import MyNftCollection from './comp/MyNftCollection';
const NftCollection = ({navigation}) => {
  const {text, flex1, BG, FG} = useSchemaStyles();
  const {primary} = colorsSchema;
  const LIST_CONFIG = [
    {
      text: 'Item',
      params: 0,
      name: 'Item',
      component: MyNftItem,
    },
    {
      text: 'Collection',
      params: 1,
      name: 'Collection',
      component: MyNftCollection,
    },
  ];
  const indexName = 0; // 默认下标
  return (
    <View style={[flex1]}>
      <TabBar
        config={LIST_CONFIG}
        indexName={indexName}
        bg={primary}
        fg={text}
      />
    </View>
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
  return {};
};

export default connect(msp, mdp)(NftCollection);
