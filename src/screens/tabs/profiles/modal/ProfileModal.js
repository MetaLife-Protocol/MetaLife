/**
 * Created on 09 Mar 2022 by lonmee
 */
import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, TextInput, View} from 'react-native';
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
  const {BG, row, text} = useSchemaStyles(),
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
          <TextInput
            style={[text, styles.modalText, {color: 'white'}]}
            autoFocus={true}
            value={valueLocal}
            placeholder={holderText}
            placeholderTextColor={textHolder}
            onChangeText={setValueLocal}
          />
          <View style={[row]}>
            <RoundBtn
              style={[{width: 80, height: 30}]}
              title={'cancel'}
              press={() => setVisible(false)}
            />
            <RoundBtn
              style={[{width: 80, height: 30}]}
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colorsBasics.primary,
    padding: 35,
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
