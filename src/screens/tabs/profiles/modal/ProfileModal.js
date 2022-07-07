/**
 * Created on 09 Mar 2022 by lonmee
 */
import React, {useState} from 'react';
import {Modal, StyleSheet, TextInput, View} from 'react-native';
import useSchemaStyles, {
  colorsBasics,
  colorsSchema,
} from '../../../../shared/UseSchemaStyles';
import RoundBtn from '../../../../shared/comps/RoundBtn';

export const ProfileModal = ({
  visible = false,
  setVisible,
  value,
  holderText,
  submitHandler,
}) => {
  const {BG, row, text, justifySpaceBetween, flex1} = useSchemaStyles(),
    {textHolder} = colorsSchema;

  const [valueLocal, setValueLocal] = useState(value);

  return (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={visible}
      onRequestClose={null}>
      <View style={[styles.centeredView]}>
        <View style={[BG, styles.modalView]}>
          <View style={[styles.inputContinar]}>
            <TextInput
              style={[flex1, styles.modalText, text]}
              value={valueLocal}
              placeholder={holderText}
              placeholderTextColor={textHolder}
              onChangeText={setValueLocal}
            />
          </View>
          <View style={[row, justifySpaceBetween, styles.buttonView]}>
            <View style={[flex1]}>
              <RoundBtn title={'cancel'} press={() => setVisible(false)} />
            </View>
            <View style={[flex1]}>
              <RoundBtn
                disabled={value === valueLocal}
                title={'confirm'}
                press={() => {
                  submitHandler(valueLocal);
                  setVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  modalView: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colorsBasics.primary,
    padding: 15,
  },
  inputContinar: {height: 60, display: 'flex'},
  buttonView: {display: 'flex', height: 44},
  modalText: {
    marginBottom: 15,
    width: '100%',
    height: 60,
    lineHeight: 17,
    textAlign: 'center',
  },
});
