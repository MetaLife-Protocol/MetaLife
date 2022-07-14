import {connect} from 'react-redux/lib/exports';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Text from '../../../../shared/comps/ComText';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import RoundBtn from '../../../../shared/comps/RoundBtn';

/**
 * Created on 17 Jun 2022 by lonmee
 *
 */

const WalletBackup = ({route: {params}, navigation: {replace, goBack}}) => {
  const {flex1, FG, text, marginTop10} = useSchemaStyles();

  return (
    <SafeAreaView style={[flex1, FG, marginTop10]}>
      <View style={[flex1, styles.container]}>
        <Text style={[text, styles.text]}>IMPORTANT:</Text>
        <Text style={[marginTop10, text, styles.text]}>
          Your Recovery Phrase is required to restore your wallet. MetaLife does
          not save your password nor can we restore your wallet for you. Please
          backup your Recovery Phrase and store it in a secure location.
        </Text>
        <Text style={[marginTop10, text, styles.text]}>
          Never disclose your Recovery Phrase. Anyone with this phrase can take
          over your account.
        </Text>
      </View>
      <RoundBtn
        style={[{marginBottom: 10}]}
        title={'Backup now'}
        press={() => {
          replace('WalletBackupMnemonicShow', params);
        }}
      />
      <RoundBtn
        style={[{marginBottom: 40}]}
        title={'Backup later'}
        press={() =>
          params && params.target ? replace(params.target) : goBack()
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  text: {
    fontSize: 15,
    lineHeight: 18,
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
    wallet: s.wallet,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(WalletBackup);
