import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import DaoItem from './items/DaoItem';
import Empty from './items/Empty';

const WalletDaoTabScreen = props => {
  const {navigation, darkMode} = props;
  const {FG, row, justifySpaceBetween, flex1, alignItemsCenter, text} =
    useSchemaStyles();

  return (
    <View style={[FG, flex1]}>
      <DaoItem title={'Metaverse.metalife'} />
      <DaoItem title={'gamefi.metalife'} />
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

export default connect(msp, mdp)(WalletDaoTabScreen);
