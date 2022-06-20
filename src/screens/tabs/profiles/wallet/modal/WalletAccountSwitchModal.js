/**
 * Created on 17 Jun 2022 by lonmee
 *
 */
import React, {useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
  const {flex1, FG, BG, row, text, alignItemsCenter, justifySpaceBetween} =
      useSchemaStyles(),
    {centeredView, modalView, title, accountItem} = styles;

  const [valueLocal, setValueLocal] = useState(value);
  const AccountItem = ({item: {name, publicKey}, selected}) => (
    <View style={[row, accountItem, BG, alignItemsCenter, justifySpaceBetween]}>
      <View>
        <Text style={[text]}>{name}</Text>
        <Text style={[{color: '#8E8E92', marginTop: 6}]}>{publicKey}</Text>
      </View>
      {selected && (
        <Image
          style={[{marginRight: 15}]}
          source={darkMode ? icons.checkedB : icons.checkedW}
        />
      )}
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
                source={darkMode ? CloseIcons.xWhite : CloseIcons.xBlack}
              />
            </Pressable>
          </View>
          <ScrollView overScrollMode={'auto'}>
            {accounts[type].map((v, i) => (
              <Pressable
                key={i}
                onPress={() => i !== index && submitHandler({type, index: i})}>
                <AccountItem item={v} selected={i === index} />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const icons = {
  wallet: require('../../../../../assets/image/wallet/wallet_backgroud.png'),
  checkedW: require('../../../../../assets/image/wallet/icon_checked_default_white.png'),
  checkedB: require('../../../../../assets/image/wallet/icon_checked_default_black.png'),
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
  accountItem: {
    borderRadius: 9,
    height: 60,
    marginHorizontal: 15,
    marginVertical: 5,
    paddingLeft: 15,
  },
});
