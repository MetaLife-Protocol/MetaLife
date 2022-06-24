import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import SchemaStyles, {colorsSchema} from '../SchemaStyles';
import RoundBtn from '../comps/RoundBtn';
import {useDialog} from './Dialog';

export const ProfileView = ({value, holderText, submitHandler}) => {
  const {row} = SchemaStyles(),
    {textHolder} = colorsSchema;
  const dialog = useDialog();
  const [valueLocal, setValueLocal] = useState(value);

  return (
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
          press={() => {
            dialog.dismiss();
          }}
        />
        <RoundBtn
          style={[{width: 80, height: 30}]}
          disabled={value === valueLocal}
          title={'confirm'}
          press={() => {
            dialog.dismiss();
            submitHandler(valueLocal);
          }}
        />
      </View>
    </View>
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
