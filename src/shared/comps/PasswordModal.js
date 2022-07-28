import React, {useState} from 'react';
import {Image, StyleSheet, TextInput, View} from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import useSchemaStyles from '../UseSchemaStyles';
import {ComModal} from './ComModal';

const PasswordModel = ({
  darkMode,
  onConfirm,
  toastVisible = false,
  setToastVisible,
  toastContent,
  pwdVisible,
  setPwdVisible,
  toastDuriation,
}) => {
  const {row, text, alignItemsCenter, placeholderTextColor} = useSchemaStyles();
  const [pwd, setPwd] = useState('');

  return (
    <ComModal
      visible={pwdVisible}
      setVisible={setPwdVisible}
      title={'Enter Password'}
      darkMode={darkMode}
      toastDuriation={toastDuriation}
      content={
        <View style={[alignItemsCenter, styles.inputContiner, row]}>
          <TextInput
            allowFontScaling={false}
            keyboardType={'ascii-capable'}
            autoCapitalize={'none'}
            textAlign={'left'}
            value={pwd}
            textContentType={'password'}
            secureTextEntry={true}
            placeholder={'Wallet password'}
            placeholderTextColor={placeholderTextColor.color}
            onChangeText={setPwd}
            style={[text, styles.input]}
          />
          <Pressable onPress={() => setPwd('')}>
            <Image
              style={styles.delete}
              source={darkMode ? iconDic.deleteIconB : iconDic.deleteIconW}
            />
          </Pressable>
        </View>
      }
      toastVisible={toastVisible}
      setToastVisible={setToastVisible}
      toastContent={toastContent}
      submit={{
        text: 'Confirm',
        press: () => {
          onConfirm(pwd);
        },
      }}
      cancel={{
        text: 'Cancel',
        press: () => {
          setPwd('');
        },
      }}
    />
  );
};

const iconDic = {
  deleteIconB: require('../../assets/image/wallet/Login_icon_delete_white.png'),
  deleteIconW: require('../../assets/image/wallet/Login_icon_delete.png'),
};

const styles = StyleSheet.create({
  inputContiner: {
    display: 'flex',
    borderColor: '#4E586E',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 15,
    marginVertical: 15,
    borderWidth: 0.5,
  },
  input: {
    flexGrow: 1,
    fontSize: 15,
    lineHeight: 20,
  },
});

export default PasswordModel;
