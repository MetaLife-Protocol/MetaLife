'use strict';

/**
 * @Author: Richard
 * @desc:
 */

import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, TextInput, View} from 'react-native';
import {
  NormalDialog,
  useDialog,
  useStyle,
  useTheme,
} from '../../../../../metalife-base';
import useSchemaStyles from '../../../../../shared/UseSchemaStyles';
import Toast from 'react-native-tiny-toast';

const PasswordDialog = ({onConfirm}) => {
  const styles = useStyle(createSty);
  const {row, text, alignItemsCenter, placeholderTextColor} = useSchemaStyles();
  const theme = useTheme();

  const [pwd, setPwd] = useState('');

  return (
    <NormalDialog
      title={'Enter Password'}
      confirmDismiss={false}
      content={
        <View style={[alignItemsCenter, styles.inputContainer, row]}>
          <TextInput
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
              source={require('../../../../../assets/image/wallet/Login_icon_delete_white.png')}
            />
          </Pressable>
        </View>
      }
      onConfirm={() => {
        if (!pwd) {
          Toast.show('password is empty!', {position: Toast.position.TOP});
          return;
        }
        onConfirm && onConfirm(pwd);
      }}
    />
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.c_F8F9FD_000000,
    },
    inputContainer: {
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
    delete: {
      width: 15,
      height: 15,
    },
  });
export default PasswordDialog;
