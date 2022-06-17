/**
 * Created on 17 Jun 2022 by lonmee
 *
 */
import React, {useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import SchemaStyles, {colorsSchema} from '../../../../../shared/SchemaStyles';
import RoundBtn from '../../../../../shared/comps/RoundBtn';

export const WalletSwitchModal = ({
  visible,
  setVisible,
  value,
  holderText,
  submitHandler,
}) => {
  const {flex1, FG, BG, row, text, justifySpaceBetween} = SchemaStyles(),
    {textHolder} = colorsSchema,
    {centeredView, modalView, title, line} = styles;

  const [valueLocal, setValueLocal] = useState(value);

  return (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={visible}
      onRequestClose={null}>
      <View style={[flex1, centeredView]}>
        <View style={[FG, modalView]}>
          <View style={[row, title, justifySpaceBetween]}>
            <Text style={[text]}>osos</Text>
            <Text style={[text]}>Wallet management</Text>
            {/*<Image source={}></Image>*/}
            <Pressable onPress={() => setVisible(false)}>
              <Text style={[text]}>xxx</Text>
            </Pressable>
          </View>
          <View style={[BG, line]} />
        </View>
      </View>
    </Modal>
  );
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
