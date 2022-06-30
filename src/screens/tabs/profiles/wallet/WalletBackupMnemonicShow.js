import {connect} from 'react-redux/lib/exports';
import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import RoundBtn from '../../../../shared/comps/RoundBtn';

/**
 * Created on 17 Jun 2022 by lonmee
 *
 */

const WalletBackupMnemonicShow = ({route: {params}, navigation: {replace}}) => {
  // TODO: mnemonic should get from address
  const {mnemonic} = params;
  const {flex1, FG, BG, row, text, marginTop10} = useSchemaStyles();

  const ItemIndex = ({item, index}) => {
    return (
      <View style={[styles.item, BG]}>
        <Text style={[styles.text, text]}>{index + 1}.</Text>
        <Text style={[styles.text, text]}>{item}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[flex1, FG, marginTop10]}>
      <ScrollView>
        <View style={[flex1, styles.container]}>
          <Text style={[text, styles.text]}>
            Please backup the mnemonic words
          </Text>
          <Text style={[marginTop10, text, styles.text, {color: '#4E586E'}]}>
            Those 12 mnemonic words are for recovering your wallet,write down
            correctly on paper and keep in a safe place
          </Text>
          <View style={[styles.mncontainer, row]}>
            {mnemonic.map((item, index) => {
              return <ItemIndex item={item} index={index} key={index} />;
            })}
          </View>
        </View>
      </ScrollView>
      <RoundBtn
        style={[{marginBottom: 30}]}
        title={'Next'}
        press={() => {
          replace('WalletBackupMnemonicSelect', params);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  mncontainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    height: 35,
    width: '30%',
    margin: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 6,
  },
  text: {
    marginLeft: 10,
    fontSize: 15,
    lineHeight: 18,
  },
});

const msp = s => {
  return {};
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(WalletBackupMnemonicShow);
