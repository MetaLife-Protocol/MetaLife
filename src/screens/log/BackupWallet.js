import React, { useState } from 'react';
import { StatusBar, TextInput, View, StyleSheet, Text, Alert, Modal, Pressable } from 'react-native';
import SchemaStyles, { colorsSchema } from '../../shared/SchemaStyles';
import { connect } from 'react-redux/lib/exports';
import RoundBtn from '../../shared/comps/RoundBtn';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const BackupWallet = ({ name, setName }) => {
  const { barStyle, BG, FG, flex1, input, text, marginTop10 } = SchemaStyles(),
    { textHolder } = colorsSchema;

  const [nick, setNick] = useState(''),
    [pwd, setPwd] = useState(''),
    [confirm, setConfirm] = useState(''),
    { replace } = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModal, setconfirmModal] = useState(false);
  const [promptModal, setpromptModal] = useState(false);
  
  const checkPassword = () => {
    setModalVisible(!modalVisible);
    setconfirmModal(!confirmModal);
  }

  const screenshotConfirm = () => {
    setconfirmModal(!confirmModal);
    setpromptModal(!promptModal);
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
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={[text, styles.modalText]}>Enter Password</Text>
              <Text style={[text, styles.modalText]} onPress={() => setModalVisible(!modalVisible)}>X</Text>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.inputBox}>
                <TextInput
                  style={[text, styles.inputText]}
                  placeholder={'Account Password'}
                  secureTextEntry={true}
                  placeholderTextColor={textHolder}
                  onChangeText={setConfirm}
                />
                <Text style={[text, styles.modalText]} onPress={() => setModalVisible(!modalVisible)}>X</Text>
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setconfirmModal(!confirmModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={[text, styles.modalText]}>Don't screenshot</Text>
              <Text style={[text, styles.modalText]} onPress={() => setconfirmModal(!confirmModal)}>X</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={{color: "#29DAD7", fontSize: 15}}>Anyone with your mnemonic words can access or spend your assets! Please write down on paper and keep it safe.</Text>
            </View>
            <View style={styles.modalFooter}>
              <RoundBtn
                style={{ width: "100%", marginHorizontal: 0, }}
                title={'Confirm'}
                press={() => screenshotConfirm()}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={promptModal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setpromptModal(!promptModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={[text, styles.modalText]}>Backup Prompt</Text>
              <Text style={[text, styles.modalText]} onPress={() => setconfirmModal(!confirmModal)}>X</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={{color: "#29DAD7", fontSize: 15}}>You have not completed the backup of the mnemonic.Leave the current page,will remove the mnemonic from the MetaLife wallet.Will you leave?</Text>
            </View>
            <View style={styles.modalFooter}>
            <RoundBtn
                style={{ width: 150, marginHorizontal: 0, }}
                title={'Cancel'}
                press={() => setconfirmModal(!modalVisible)}
              />
              <RoundBtn
                style={{ width: 150, marginHorizontal: 0, }}
                title={'Confirm'}
                press={() => replace('Backup Mnemonic')}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const msp = s => {
  return {};
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
    backgroundColor: "#232929",
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
  },
  modalBody: {
    width: "100%",
    marginTop: 30,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
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
  }
});

export default connect(msp, mdp)(BackupWallet);
