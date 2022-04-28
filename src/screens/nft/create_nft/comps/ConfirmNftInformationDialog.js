'use strict';

/**
 * @Author: lq
 * @Date: 2022-04-28
 * @Project:MetaLife
 */

import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {DialogTitle, RoundBtn, useDialog, useStyle} from 'metalife-base';
import Toast from 'react-native-tiny-toast';

const ConfirmNftInformationDialog = ({
  file = {},
  name = '',
  description = '',
}) => {
  const styles = useStyle(styleFun);
  const dialog = useDialog();

  return (
    <View style={styles.container}>
      <DialogTitle title={'NFT information'} />
      <Image source={file} style={styles.img} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>your upload NFT :</Text>
        <Text style={styles.value} numberOfLines={1} ellipsizeMode={'middle'}>
          {file.fileName}
        </Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>NFT name:</Text>
        <Text style={styles.value} numberOfLines={1} ellipsizeMode={'middle'}>
          {name}
        </Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>NFT Description:</Text>
        <View style={{flex: 1}} />
      </View>
      <Text style={styles.description}>{description}</Text>
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
          Toast.show('todo');
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
    img: {
      width: 100,
      height: 100,
      borderRadius: 10,
      marginTop: 15,
    },
    title: {
      fontSize: 15,
      color: theme.c_4E586E,
    },
    value: {
      fontSize: 15,
      color: theme.c_000000_FFFFFF,
      flex: 1,
    },
    description: {
      fontSize: 15,
      color: theme.c_000000_FFFFFF,
      alignSelf: 'flex-start',
    },
    textContainer: {
      flexDirection: 'row',
      marginTop: 10,
      alignSelf: 'flex-start',
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
