/**
 * Created on 17 Jun 2022 by lonmee
 *
 */
import React, {useState} from 'react';
import {Image, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import useSchemaStyles, {
  colorsSchema,
} from '../../../../../shared/UseSchemaStyles';
import {CloseIcons} from '../../../../../shared/Icons';
import WalletCore from '../comp/WalletCore';

export const WalletSwitchModal = ({
  visible,
  setVisible,
  submitHandler,
  darkMode,
  wallet: {
    current: {type, index},
    accounts,
  },
}) => {
  const {flex1, FG, BG, row, text, justifySpaceBetween} = useSchemaStyles(),
    {centeredView, modalView, title, line, textStyle} = styles;

  return (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={visible}
      onRequestClose={null}>
      <View style={[flex1, centeredView]}>
        <View style={[FG, modalView]}>
          <View style={[row, title, justifySpaceBetween]}>
            <Image source={darkMode ? icons.walletB : icons.walletW} />
            <Text style={[text, textStyle]}>Wallet management</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Image
                source={darkMode ? CloseIcons.xWhite : CloseIcons.xBlack}
              />
            </Pressable>
          </View>
          <View style={[BG, line]} />
          <WalletCore />
        </View>
      </View>
    </Modal>
  );
};

const icons = {
  walletB: require('../../../../../assets/image/wallet/wallet-balck.png'),
  walletW: require('../../../../../assets/image/wallet/wallet-white.png'),
};

const styles = StyleSheet.create({
  centeredView: {
    flexDirection: 'column-reverse',
  },
  modalView: {
    height: 320,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    padding: 16,
    elevation: 2,
  },
  line: {
    height: 0.5,
  },
  textStyle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
