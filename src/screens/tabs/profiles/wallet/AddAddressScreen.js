import React, {useLayoutEffect, useState} from 'react';
import {View, StyleSheet, Pressable, Image, TextInput} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import Text from '../../../../shared/comps/ComText';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
const scanW = require('../../../../assets/image/wallet/icon_scan_default_white.png');
const scanB = require('../../../../assets/image/wallet/icon_scan_default_black.png');

const AddAddressScreen = ({navigation, cfg: {darkMode}, addAddressContact}) => {
  const [name, setName] = useState('');
  const [addressCon, setAddress] = useState('');
  const [remark, setRemark] = useState('');
  const {text, primary, marginTop10, flex1, BG, FG} = useSchemaStyles();

  const headerRight = () => {
    return (
      <Pressable onPress={rightPress}>
        <Text style={styles.saveText}>Save</Text>
      </Pressable>
    );
  };
  const rightPress = e => {
    // alert(addressCon);
    // if (addressCon === '' || name === '') {
    //   return;
    // }
    const address = {
      type: 'address',
      name: name,
      addressCon,
      remark: remark,
    };
    console.log('dddd=======', e);
    addAddressContact(address);
  };
  useLayoutEffect(() => {
    navigation.setOptions(
      {
        title: 'New address contact',
        headerRight,
      },
      [navigation],
    );
  }, [navigation]);
  alert(name);
  return (
    <View style={[flex1, BG]}>
      <View style={[FG, styles.nameView, marginTop10]}>
        <TextInput
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
          style={[text, styles.comText]}
          placeholder="Payee wallet address"
          value={addressCon}
          onChangeText={text => {
            setAddress(text);
          }}
          placeholderTextColor={'#8E8E92'}
        />
        <Image source={!darkMode ? scanW : scanB} />
      </View>
      <View style={styles.line} />
      <View style={[FG, styles.nameView]}>
        <TextInput
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
    fontSize: 16,
    color: '#8E8E92',
  },
  line: {
    height: 1,
    backgroundColor: '#000',
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
  };
};

export default connect(msp, mdp)(AddAddressScreen);
