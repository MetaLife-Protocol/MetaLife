/**
 * Created on 09 Mar 2022 by lonmee
 */
import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, TextInput, View} from 'react-native';
import SchemaStyles, {colorsSchema} from '../../../../shared/SchemaStyles';
import RoundBtn from '../../../../shared/comps/RoundBtn';

export const ProfileModal = ({
  visible = false,
  setVisible,
  value,
  holderText,
  submitHandler,
}) => {
  const {row} = SchemaStyles(),
    {textHolder} = colorsSchema;

  const [valueLocal, setValueLocal] = useState(value);

  return (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.modalText}
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
    backgroundColor: 'white',
    borderRadius: 20,
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
