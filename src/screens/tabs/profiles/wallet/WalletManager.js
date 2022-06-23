import {SafeAreaView} from 'react-native';
import React from 'react';
import WalletCore from './comp/WalletCore';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';

/**
 * Created on 17 Jun 2022 by lonmee
 *
 */

const WalletManager = () => {
  const {flex1} = useSchemaStyles();
  return (
    <SafeAreaView style={[flex1]}>
      <WalletCore manageHandle={true} />
    </SafeAreaView>
  );
};

export default WalletManager;
