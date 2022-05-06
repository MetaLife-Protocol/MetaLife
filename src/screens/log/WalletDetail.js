import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  StatusBar,
  Alert,
  View,
  Text,
  Modal,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
// import Clipboard from '@react-native-community/clipboard';
import SchemaStyles, {colorsSchema} from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import RoundBtn from '../../shared/comps/RoundBtn';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const iconDic = {
  Clear_icon_default: require('../../assets/image/accountBtn/Clear_icon_default.png'),
  Clear_icon_selected: require('../../assets/image/accountBtn/Clear_icon_selected.png'),
  Dark_icon_default: require('../../assets/image/accountBtn/Dark_icon_default.png'),
  Dark_icon_selected: require('../../assets/image/accountBtn/Dark_icon_selected.png'),
  Confirm_icon_default: require('../../assets/image/accountBtn/Confirm_icon_default.png'),
  Confirm_icon_selected: require('../../assets/image/accountBtn/Confirm_icon_selected.png'),
  Scan_icon_dark: require('../../assets/image/accountBtn/Scan_icon_black.png'),
  Scan_icon_white: require('../../assets/image/accountBtn/Scan_icon_white.png'),
  Back_icon_dark: require('../../assets/image/walletBtn/back-black.png'),
  Back_icon_white: require('../../assets/image/walletBtn/back-white.png'),
};

const Backup = ({name, setName, darkMode, currentAccount, setCurrentAccount, deleteAccount, currentPassword}) => {
  const {
      barStyle,
      BG,
      FG,
      flex1,
      inputBG,
      text,
      marginTop10,
      padding,
      areaBorderColor,
      modalBackground,
    } = SchemaStyles(),
    {textHolder} = colorsSchema;

  const [nick, setNick] = useState('');
  const [pwd, setPwd] = useState('');
  const {replace} = useNavigation();
  const [next, setNext] = useState(false);

  const [confirmModal, setconfirmModal] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [privateKeyModal, setPrivateKeyModal] = useState(false);
  const [keystoreModal, setKeystoreModal] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [exportType, setExportType] = useState('keystore');

  const checkPassword = () => {
    console.log(currentAccount.Password, confirm, '>>>>>>>>>>>>>>>>>')
    if (currentAccount.Password == confirm) {
      setModalVisible(false);
      setPrivateKeyModal(true);
    }
  };

  const promtConfirm = () => {
    setpromptModal(!promptModal);
  };

  const copyToClipboard = () => {
    // Clipboard.setString('hello world');
  };

  return (
    <View style={[BG, flex1]}>
      <StatusBar barStyle={barStyle} />
      <View style={[FG, styles.header]}>
        <TouchableOpacity onPress={() => replace('Wallet')}>
          <Image
            style={{width: 15, height: 15}}
            source={iconDic['Back_icon_' + (!darkMode ? 'dark' : 'white')]}
          />
        </TouchableOpacity>
        <View style={[{paddingLeft: 35}]}>
          <Text style={[text, {fontSize: 20, fontWeight: '500'}]}>WalletDetails</Text>
        </View>
      </View>
      <View style={[FG, marginTop10, {marginLeft: 15, marginRight: 15}]}>
        <View
          style={{
            paddingTop: 25,
            paddingLeft: 32.5,
            paddingBottom: 20,
            paddingRight: 32.5,
          }}>
          <View
            style={{
              borderBottomColor: '#F0F0F0',
              borderBottomWidth: 1,
              paddingBottom: 5,
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{width: 35, height: 35}}
                source={require('../../assets/image/walletDetail/photo.png')}
              />
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={[text, {fontSize: 17}]}>{currentAccount.Name}</Text>
              <TouchableOpacity
                onPress={() => console.log('edit icon clicked')}>
                <Image
                  style={{width: 15, height: 15, marginLeft: 5, marginTop: 5}}
                  source={require('../../assets/image/walletDetail/icon_edit_default.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={{marginTop: 14.5, color: '#8E8E92', textAlign: 'center'}}>
            {currentAccount.Address}
          </Text>
          <TouchableOpacity onPress={() => {setModalVisible(true);setExportType('keystore');}}>
            <View
              style={{
                backgroundColor: '#EDEEF1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 44,
                marginTop: 20,
                borderRadius: 22,
              }}>
              <Text style={[text, {fontSize: 15}]}>Export keystore</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setModalVisible(true);setExportType('privatekey');}}>
            <View
              style={{
                backgroundColor: '#EDEEF1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 44,
                marginTop: 12,
                borderRadius: 22,
              }}>
              <Text style={[text, {fontSize: 15}]}>Export Private key</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {deleteAccount(currentAccount.Address);replace('Wallet');}}>
            <View
              style={{
                backgroundColor: '#EDEEF1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 44,
                marginTop: 12,
                borderRadius: 22,
              }}>
              <Text style={{fontSize: 15, color: '#C60F0F'}}>Delete</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setconfirmModal(false);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalBack]}></View>
          <View style={[styles.modalView, modalBackground]}>
            <View style={styles.modalHeader}>
              <Text style={[text, styles.modalText]}>Disclaimer</Text>
              <Text
                style={[text, styles.modalText]}
                onPress={() => setconfirmModal(false)}>
                X
              </Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={{color: '#29DAD7', fontSize: 15}}>
                Please ensure that the wallet has been backed up to a safe
                place. MetaLife App will not be responsible for any loss of
                assets caused by wallet loss, theft, or forgotten password.
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <RoundBtn
                style={{width: '100%', marginHorizontal: 0}}
                title={'Confirm'}
                press={() => setconfirmModal(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalBack]}></View>
          <View style={[styles.modalView, modalBackground]}>
            <View style={styles.modalHeader}>
              <Text style={[text, styles.modalText]}>Enter Password</Text>
              <Text
                style={[text, styles.modalText]}
                onPress={() => setModalVisible(!modalVisible)}>
                X
              </Text>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.inputBox}>
                <TextInput
                  style={[text, styles.inputText]}
                  placeholder={'Wallet Password'}
                  secureTextEntry={true}
                  placeholderTextColor={textHolder}
                  value={confirm}
                  onChangeText={setConfirm}
                />
                {confirm ? (
                  <TouchableOpacity onPress={() => setConfirm('')}>
                    <Image
                      style={styles.icon}
                      source={require('../../assets/image/walletDetail/icon_delete_default.png')}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
            <View style={styles.modalFooter}>
              <RoundBtn
                style={{width: 150, marginHorizontal: 0}}
                title={'Cancel'}
                press={() => setModalVisible(!modalVisible)}
              />
              <RoundBtn
                style={{width: 150, marginHorizontal: 0}}
                title={'Confirm'}
                press={() => checkPassword()}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={privateKeyModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setPrivateKeyModal(!privateKeyModal);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalBack]}></View>
          <View style={[styles.modalView, modalBackground]}>
            <View style={styles.modalHeader}>
            {exportType === 'privatekey' && <Text style={[text, styles.modalText]}>Export private key</Text>}
            {exportType === 'keystore' && <Text style={[text, styles.modalText]}>Export keystore</Text>}
              <Text
                style={[text, styles.modalText]}
                onPress={() => setPrivateKeyModal(!privateKeyModal)}>
                X
              </Text>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.area}>
                <Text style={[text, {fontSize: 16}]}>
                  {exportType === 'privatekey'? currentAccount.PrivateKey : currentAccount.Keystore}
                </Text>
              </View>
            </View>
            <View style={styles.modalFooter}>
              <RoundBtn
                style={{width: '100%', marginHorizontal: 0}}
                title={'Copy'}
                press={() => {
                  setPrivateKeyModal(false);
                  copyToClipboard();
                }}
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
    currentAccount: s.account.currentAccount,
    currentPassword: s.account.currentPassword,
    darkMode: s.cfg.darkMode,
  };
};

const mdp = d => {
  return {
    setDarkMode: darkMode => d({type: 'setDarkMode', payload: darkMode}),
    setName: name => d({type: 'set', payload: name}),
    deleteName: name => d({type: 'delete'}),
    setCurrentAccount: account =>
      d({type: 'setCurrentAccount', payload: account}),
    deleteAccount: account => d({type: 'deleteAccount', payload: account}),
    };
};

const styles = StyleSheet.create({
  header: {
    height: 50,
    display: 'flex',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 20,
  },
  description: {
    color: '#4E586E',
    fontSize: 17,
    marginTop: 15,
  },
  enterArea: {
    padding: 5,
    borderRadius: 10,
    // borderColor: '#00000040',
    height: 180,
    borderWidth: 1,
    marginTop: 30,
  },
  buttonArea: {
    display: 'flex',
    marginTop: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    zIndex: 2,
  },
  modalBody: {
    width: '100%',
    marginTop: 30,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 17,
  },
  modalHeader: {
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  modalTextDesc: {
    color: '#4E586E',
    fontSize: 15,
    marginTop: 10,
  },
  modalFooter: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 1,
  },
  inputText: {
    fontSize: 15,
  },
  inputBox: {
    borderColor: '#F0F0F0',
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  area: {
    padding: 15,
    backgroundColor: '#F8F9FD',
    borderRadius: 8,
  },
});

export default connect(msp, mdp)(Backup);
