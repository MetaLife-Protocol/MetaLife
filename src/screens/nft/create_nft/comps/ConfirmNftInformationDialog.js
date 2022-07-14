'use strict';

/**
 * @Author: lq
 * @Date: 2022-04-28
 * @Project:MetaLife
 */

import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import Text from '../../../../shared/comps/ComText';
import {
  DialogTitle,
  RoundBtn,
  useDialog,
  useStyle,
} from '../../../../metalife-base';
import Toast from 'react-native-tiny-toast';
import CreateNFTInformationView from './CreateNFTInfomationView';
import {useNavigation} from '@react-navigation/native';

const ConfirmNftInformationDialog = ({
  file = {},
  name = '',
  description = '',
  navigate,
}) => {
  const styles = useStyle(styleFun);
  const dialog = useDialog();

  return (
    <View style={styles.container}>
      <DialogTitle title={'NFT information'} />
      <CreateNFTInformationView
        description={description}
        name={name}
        file={file}
      />
      <View style={styles.row}>
        <RoundBtn
          style={{paddingHorizontal: 20}}
          title={'Revise'}
          press={() => {
            dialog.dismiss();
          }}
        />
        <RoundBtn
          style={{paddingHorizontal: 20}}
          title={'Save'}
          press={() => {
            //todo
            Toast.show('todo');
          }}
        />
      </View>
      <RoundBtn
        style={{width: 315, marginTop: 13}}
        title={'Listing'}
        press={() => {
          //todo
          Toast.show('todo');
        }}
      />
      <RoundBtn
        style={{width: 315, marginTop: 13}}
        title={'Sell'}
        press={() => {
          //todo
          dialog.dismiss();
          navigate('CreateNFTStep2', {
            file: file,
            name: name,
            description: description,
          });
          // Toast.show('todo');
        }}
      />
      <Text style={styles.tipsText}>*Save local save is not chained</Text>
      <Text style={styles.tipsText}>
        *Listing and sell Up chain consume gas
      </Text>
    </View>
  );
};
const styleFun = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.c_FFFFFF_000000,
      margin: 15,
      borderRadius: 20,
      padding: 15,
      alignItems: 'center',
      width: 345,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tipsText: {
      fontSize: 13,
      lineHeight: 16,
      color: theme.c_4E586E,
      marginTop: 5,
    },
  });
export default ConfirmNftInformationDialog;
