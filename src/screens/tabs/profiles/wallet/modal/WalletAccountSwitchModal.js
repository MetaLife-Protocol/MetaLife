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

export const WalletAccountSwitchModal = ({
  visible,
  setVisible,
  value,
  darkMode,
  holderText,
  submitHandler,
  wallet: {
    current: {type, index},
    accounts,
  },
}) => {
  const {flex1, FG, BG, row, text, justifySpaceBetween} = useSchemaStyles(),
    {textHolder} = colorsSchema,
    {centeredView, modalView, title, line} = styles;

  const [valueLocal, setValueLocal] = useState(value);
  const AccountItem = (name, pk) => (
    <View>
      <Text>{name}</Text>
      <Text>{pk}</Text>
    </View>
  );

  return (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={visible}
      onRequestClose={null}>
      <View style={[flex1, centeredView]}>
        <View style={[FG, modalView]}>
          <View style={[row, title, justifySpaceBetween]}>
            <Text style={[text]}>Switch Account</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Image
                style={[{width: 20, height: 20}]}
                source={darkMode ? CloseIcons.xWhite : CloseIcons.xBlack}
              />
            </Pressable>
          </View>
          <View>
            {accounts[type].map(({name, publicKey}, i) => (
              <AccountItem name={name} pk={publicKey} />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const icons = {
  wallet: require('../../../../../assets/image/wallet/wallet_backgroud.png'),
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
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
