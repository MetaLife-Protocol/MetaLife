import React, { useState, useEffect } from 'react';
import { StatusBar, TextInput, View, StyleSheet, Text, Alert, Modal, TouchableOpacity, Image } from 'react-native';
import SchemaStyles, { colorsSchema } from '../../shared/SchemaStyles';
import { connect } from 'react-redux/lib/exports';
import RoundBtn from '../../shared/comps/RoundBtn';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const iconDic = {
  Confirm_icon_default: require('../../assets/image/accountBtn/Confirm_icon_default.png'),
  Confirm_icon_selected: require('../../assets/image/accountBtn/Confirm_icon_selected.png'),
};

const BackupWallet = ({ name, setName, currentAccount }) => {
  const { barStyle, BG, FG, flex1, input, text, marginTop10, modalBackground } = SchemaStyles(),
    { textHolder } = colorsSchema;

  const [pwd, setPwd] = useState(''),
    [confirm, setConfirm] = useState(''),
    { replace } = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [focusedConfirm, setfocusedConfirm] = useState(true);

  useEffect(() => {
    // _retrieveData = async () => {
    //   try {
    //     const value = await AsyncStorage.getItem('Account');
    //     if (value !== null) {
    //       // We have data!!
    //       const data = JSON.parse(value);
    //       setPwd(data.password);
    //     }
    //   } catch (error) {
    //     console.log("error", error);
    //   }
    // };
    // _retrieveData();
    // console.log("account data fetched");
  }, []);
  
  const checkPassword = () => {
    console.log(currentAccount);
    if(currentAccount.Password == confirm) {
      replace('BackupMnemonic');
    } else {
      Alert.alert('Error', 'Incorrect password, please re-enter', [
      {
        text: 'OK',
        onPress: () => setConfirm(''),
        style: 'Okay',
      },
    ]);
    }
  }

  return (
    <View style={[BG, flex1]}>
      <StatusBar barStyle={barStyle} />
      <View style={[FG, flex1, marginTop10, styles.body]}>
        <View>
          <Text style={[text, {
            fontSize: 16, marginTop: 10,
          }]}>
            The last step:back up your wallet immediately
          </Text>
          <Text style={[text, {
            fontSize: 16, marginTop: 10,
          }]}>

            We highly recommend you write the Mnemonic
            words（Backup Phrase）on paper and keep it in
            a safe place,anyone get it can access or spend your
            assets.Also get start with a small amount of assets.
          </Text>
          <Text style={[text, {
            fontSize: 16, marginTop: 10,
          }]}>
            Note:MetaLife waller does not save user password
            nor provide backups.All password are required to
            backup using encrypted private key.We highly
            recommended to backup and save your private key
            at the same time,otherwise your wallet can never
            be retrieved.
          </Text>
        </View>
        <View style={flex1} />
        <RoundBtn
          style={{ marginBottom: 50 }}
          title={'Backup Account'}
          press={() => setModalVisible(true)}
        />
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalBack]}></View>
          <View style={[styles.modalView, modalBackground]}>
            <View style={styles.modalHeader}>
              <Text style={[text, styles.modalText]}>Enter Password</Text>
              <Text style={[text, styles.modalText]} onPress={() => setModalVisible(!modalVisible)}>X</Text>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.inputBox}>
                <TextInput
                  style={[text, styles.inputText]}
                  placeholder={'Account Password'}
                  secureTextEntry={focusedConfirm ? true : false}
                  placeholderTextColor={textHolder}
                  value={confirm}
                  onChangeText={setConfirm}
                />
                <TouchableOpacity onPress={() => setfocusedConfirm(!focusedConfirm)}>
                  <Image
                    style={styles.icon}
                    source={iconDic['Confirm_icon_' + (focusedConfirm ? 'selected' : 'default')]}
                  />
                </TouchableOpacity>
              </View>
              <Text style={[styles.modalTextDesc]}>To ensure safety of your balance,please do not disclose your privacy to others.</Text>
            </View>
            <View style={styles.modalFooter}>
              <RoundBtn
                style={{ width: 150, marginHorizontal: 0, }}
                title={'Cancel'}
                press={() => setModalVisible(!modalVisible)}
              />
              <RoundBtn
                style={{ width: 150, marginHorizontal: 0, }}
                title={'Confirm'}
                press={() => checkPassword()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const msp = s => {
  return {
    currentAccount: s.account.currentAccount
  };
};

const mdp = d => {
  return {
    setName: name => d({ type: 'set', payload: name }),
    deleteName: name => d({ type: 'delete' }),
  };
};


const styles = StyleSheet.create({
  inputBox: {
    borderColor: "#4E586E",
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'space-between',
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  body: {
    padding: 15,
  },
  inputText: {
    fontSize: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    zIndex: 2,
  },
  modalBody: {
    width: "100%",
    marginTop: 30,
  },
  modalText: {
    textAlign: "center",
    fontSize: 17,
  },
  modalHeader: {
    justifyContent: 'space-between',
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  modalTextDesc: {
    color: "#4E586E",
    fontSize: 15,
    marginTop: 10,
  },
  modalFooter: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: 'space-between',
  },
  modalBack: {
    position: 'absolute',
    top: 0, 
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 1,
  },
  icon: {
    width: 20,
    height: 20,
  }
});

export default connect(msp, mdp)(BackupWallet);
