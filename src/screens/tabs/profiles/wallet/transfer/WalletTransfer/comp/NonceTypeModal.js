import React, {useState} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {ComModal} from '../../../../../../../shared/comps/ComModal';
import ComText from '../../../../../../../shared/comps/ComText';
import useSchemaStyles from '../../../../../../../shared/UseSchemaStyles';

const NonceTypeModal = ({
  nonceType,
  nonceVisible,
  setNonceVisible,
  darkMode,
  onConfirm,
}) => {
  const {text, alignItemsCenter} = useSchemaStyles();
  const [nonce, setNonce] = useState(nonceType);
  return (
    <ComModal
      title={'Select nonce type'}
      visible={nonceVisible}
      setVisible={setNonceVisible}
      darkMode={darkMode}
      content={
        <View style={[alignItemsCenter]}>
          {['pending', 'latest'].map(item => {
            const backgroundColor = {
              backgroundColor: nonce === item ? '#29DAD7' : '#010101',
            };
            return (
              <Pressable
                key={item}
                onPress={() => setNonce(item)}
                style={[styles.nonceType, backgroundColor]}>
                <ComText style={[text, styles.nonceText]}>{item}</ComText>
              </Pressable>
            );
          })}
        </View>
      }
      submit={{
        text: 'submit',
        press: () => {
          onConfirm(nonce);
          setNonceVisible(false);
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  nonceType: {
    padding: 8,
    width: 100,
    margin: 5,
    borderRadius: 4,
    justifyContent: 'center',
    borderWidth: 1,
  },
  nonceText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default NonceTypeModal;
