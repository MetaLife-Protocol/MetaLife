import React, {useLayoutEffect} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import Text from '../../../../shared/comps/ComText';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import {SwipeListView} from 'react-native-swipe-list-view';
import HeadIcon from '../../../../shared/comps/HeadIcon';
import {HeaderIcons} from '../../../../shared/Icons';

const AddressContact = ({
  navigation,
  wallet,
  deleteAddressContact,
  route: {params},
  cfg: {darkMode},
}) => {
  const {text, flex1, BG, FG} = useSchemaStyles();
  const headerRight = () => (
    <Pressable
      onPress={() => {
        navigation.navigate('AddAddressScreen');
      }}>
      <HeadIcon
        height={30}
        width={30}
        image={!darkMode ? HeaderIcons.addressBlack : HeaderIcons.addressWhite}
      />
    </Pressable>
  );

  useLayoutEffect(() => {
    navigation.setOptions(
      {
        title: 'Address Contact',
        headerRight,
      },
      [navigation],
    );
  }, [navigation]);
  const listData = wallet?.address?.address || [];

  const renderItem = data => {
    return (
      <Pressable
        style={[BG, styles.listItem]}
        onPress={() => {
          if (params.onCallbackData) {
            params.onCallbackData(data.item.addressCon);
            navigation.goBack();
          }
        }}>
        <Text style={[text, styles.name]}>{data.item.name}</Text>
        <Text style={styles.content}>{data.item.addressCon}</Text>
        {data.item.remark ? (
          <Text style={styles.content}>{data.item.remark}</Text>
        ) : null}
      </Pressable>
    );
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deletePress = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    deleteAddressContact({type: rowMap.item.type, key: rowMap.item.key});
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.listRow}>
        <Pressable
          style={[styles.editView, styles.backLeft]}
          onPress={() => {
            navigation.navigate('AddAddressScreen', {data: data.item});
          }}>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
        <Pressable
          style={[styles.editView, styles.backRight]}
          onPress={() => deletePress(data, data.item.key)}>
          <Text style={styles.editText}>Delete</Text>
        </Pressable>
      </View>
    );
  };
  return (
    <View style={[flex1, FG]}>
      <SwipeListView
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        // leftOpenValue={70}
        rightOpenValue={-140}
        previewRowKey={'0'}
        previewOpenValue={-20}
        previewOpenDelay={3000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 9,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    fontSize: 14,
    color: '#8E8E92',
    marginTop: 8,
  },
  editView: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  backLeft: {
    backgroundColor: '#29DAD7',
    right: 70,
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
  },
  backRight: {
    backgroundColor: '#E73553',
    right: 0,
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
  },
  listRow: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 15,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  editText: {
    fontSize: 14,
    color: '#000',
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    wallet: s.wallet,
  };
};

const mdp = d => {
  return {
    deleteAddressContact: payload => d({type: 'deleteAddressContact', payload}),
  };
};

export default connect(msp, mdp)(AddressContact);
