import React, {useLayoutEffect, useState} from 'react';
import {View, StyleSheet, Pressable, Image, TextInput} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import Text from '../../../../shared/comps/ComText';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import Toast from 'react-native-tiny-toast';
import {getProvider} from 'react-native-web3-wallet';
const scanW = require('../../../../assets/image/wallet/icon_scan_default_white.png');
const scanB = require('../../../../assets/image/wallet/icon_scan_default_black.png');

const AddAddressScreen = ({
  navigation,
  cfg: {darkMode},
  addAddressContact,
  route: {params},
  updateAddressContact,
}) => {
  const [name, setName] = useState(params?.data?.name);
  const [addressCon, setAddress] = useState(params?.data?.addressCon);
  const [remark, setRemark] = useState(params?.data?.remark);
  const {text, marginTop10, flex1, BG, FG} = useSchemaStyles();

  const headerRight = () => {
    return (
      <Pressable onPress={rightPress}>
        <Text style={styles.saveText}>Save</Text>
      </Pressable>
    );
  };
  const rightPress = async () => {
    if (!addressCon || !name) {
      Toast.show('Please set name or wallet address');
      return;
    }
    // check address
    try {
      const correctAddress = await getProvider('').resolveName(addressCon);
      if (!correctAddress) {
        Toast.show('invalid address!', {
          position: Toast.position.CENTER,
        });
        return;
      }
    } catch (e) {
      Toast.show('invalid address!', {
        position: Toast.position.CENTER,
      });
      return;
    }

    const address = {
      type: 'address',
      name: name,
      addressCon,
      remark: remark,
      key: Math.random(),
    };
    if (!params) {
      addAddressContact(address);
    } else {
      updateAddressContact({
        type: 'address',
        name: name,
        addressCon,
        remark,
        key: params.data.key,
      });
    }

    navigation.goBack();
  };
  useLayoutEffect(() => {
    navigation.setOptions(
      {
        title: 'New address contact',
        headerRight,
      },
      [navigation],
    );
  }, [navigation, name, addressCon, remark]);

  return (
    <View style={[flex1, BG]}>
      <View style={[FG, styles.nameView, marginTop10]}>
        <TextInput
          allowFontScaling={false}
          style={[text, styles.comText]}
          placeholder="Name "
          value={name}
          onChangeText={setName}
          placeholderTextColor={'#8E8E92'}
        />
      </View>
      <View style={styles.line} />
      <View style={[FG, styles.nameView]}>
        <TextInput
          allowFontScaling={false}
          style={[text, styles.comText]}
          placeholder="Payee wallet address"
          value={addressCon}
          onChangeText={text => {
            setAddress(text);
          }}
          placeholderTextColor={'#8E8E92'}
        />
        <Pressable
          onPress={() => {
            navigation.navigate('Scan', {onCallbackData: setAddress});
          }}>
          <Image source={!darkMode ? scanW : scanB} />
        </Pressable>
      </View>
      <View style={styles.line} />
      <View style={[FG, styles.nameView]}>
        <TextInput
          allowFontScaling={false}
          style={[text, styles.comText]}
          placeholder="Remark"
          value={remark}
          onChangeText={text => {
            setRemark(text);
          }}
          placeholderTextColor={'#8E8E92'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  saveText: {
    fontSize: 17,
    color: '#29DAD7',
  },
  nameView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 54,
    paddingHorizontal: 15.5,
  },
  comText: {
    fontSize: 14,
  },
  line: {
    height: 1,
    backgroundColor: '#8E8E92',
    marginHorizontal: 15,
  },
  inputText: {
    fontSize: 16,
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
    addAddressContact: payload => d({type: 'addAddressContact', payload}),
    updateAddressContact: payload => d({type: 'updateAddressContact', payload}),
  };
};

export default connect(msp, mdp)(AddAddressScreen);
