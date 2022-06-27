'use strict';

/**
 * @Author: lq
 * @Date: 2022-06-14
 * @Project:MetaLife
 */

import React, {useCallback, useMemo, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DialogTitle,
  PureTextInput,
  RoundBtn,
  useDialog,
  useStyle,
} from '../../../../metalife-base';
import Constants from '../../../../shared/Constants';

const AddPropertiesDialog = ({onSure, defaultProperties}) => {
  const styles = useStyle(createSty);
  const dialog = useDialog();
  const [properties, setProperties] = useState(
    defaultProperties.length ? defaultProperties : [{type: '', name: ''}],
  );

  const addMore = useCallback(() => {
    setProperties(preProperties => {
      return [...preProperties, {type: '', name: ''}];
    });
  }, []);

  const delFun = useCallback(index => {
    setProperties(preProperties => {
      preProperties.splice(index, 1);
      return [...preProperties];
    });
  }, []);

  const typeChange = useCallback(
    (index, type) => {
      properties[index].type = type;
      // setProperties(preProperties => {
      //   preProperties[index].type = type;
      //   return [...preProperties];
      // });
    },
    [properties],
  );
  const nameChange = useCallback(
    (index, name) => {
      properties[index].name = name;

      // setProperties(preProperties => {
      //   preProperties[index].name = name;
      //   return [...preProperties];
      // });
    },
    [properties],
  );

  const propertiesView = useMemo(() => {
    return properties.map((item, index) => {
      return (
        <View key={Math.random()} style={styles.addItemContainer}>
          <View style={[styles.borderView, styles.row, {flex: 1}]}>
            <TouchableOpacity
              style={{
                width: 48,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                delFun(index);
              }}>
              <Image
                source={require('../../../../assets/image/nft/new_nft_add_close_icon.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
            <View
              style={{height: '100%', width: 1, backgroundColor: '#4E586E'}}
            />
            <PureTextInput
              style={[{flex: 1, paddingHorizontal: 10}]}
              placeholder={'Character'}
              defaultValue={item.type}
              onChangeText={text => {
                typeChange(index, text);
              }}
            />
          </View>
          <PureTextInput
            style={[
              styles.borderView,
              {width: 89, marginLeft: 10, paddingHorizontal: 10},
            ]}
            defaultValue={item.name}
            placeholder={'Male'}
            onChangeText={text => {
              nameChange(index, text);
            }}
          />
        </View>
      );
    });
  }, [properties, delFun, nameChange, styles, typeChange]);
  console.log('properties::', properties);
  return (
    <View style={styles.container}>
      <DialogTitle title={'Add Properties'} />
      <Text style={styles.tips}>
        Properties show up underneath your item, are clickable, and can be
        filtered in your collection's sidebar.
      </Text>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, {marginLeft: 48, flex: 1}]}>Type</Text>
        <Text style={[styles.title, {marginRight: 48}]}>Name</Text>
      </View>
      {propertiesView}
      <RoundBtn
        style={{
          width: 110,
          height: 46,
          marginHorizontal: 0,
          marginTop: 15,
          borderRadius: 12,
        }}
        title="Add more"
        press={addMore}
      />
      <RoundBtn
        style={{marginHorizontal: 0, marginTop: 20}}
        title={'Save'}
        press={() => {
          dialog.dismiss();
          const filterList = properties.filter((item, index) => {
            return item.type && item.name;
          });
          onSure && onSure(filterList);
        }}
      />
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.c_FFFFFF_232929,
      borderRadius: 12,
      paddingHorizontal: 15,
      paddingVertical: 20,
      width: Constants.screenWidth - 30,
    },
    tips: {
      fontSize: 15,
      color: theme.c_8E8E92,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
    },
    title: {
      fontSize: 15,
      color: theme.c_000000_FFFFFF,
      fontWeight: 'bold',
      lineHeight: 18,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
    },
    borderView: {
      borderWidth: 1,
      borderColor: theme.c_4E586E,
      borderRadius: 12,
      height: 46,
    },
    closeIcon: {width: 14, height: 14},
  });
export default AddPropertiesDialog;
