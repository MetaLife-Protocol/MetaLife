import {connect} from 'react-redux/lib/exports';
import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
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
        <Text style={[text, styles.text]}>
          The last step:back up your wallet immediately
        </Text>
        <Text style={[marginTop10, text, styles.text]}>
          We highly recommend you write the Mnemonic words（Backup Phrase）on
          paper and keep it in a safe place,anyone get it can access or spend
          your assets.Also get start with a small amount of assets.{' '}
        </Text>
        <Text style={[marginTop10, text, styles.text]}>
          Note:MetaLife waller does not save user password nor provide
          backups.All password are required to backup using encrypted private
          key.We highly recommended to backup and save your private key at the
          same time,otherwise your wallet can never be retrieved.
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
        press={goBack}
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
