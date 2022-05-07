import React, {useState, useEffect} from 'react';
import {StyleSheet, StatusBar, Alert, View, Text, Modal} from 'react-native';
import SchemaStyles, {colorsSchema} from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import RoundBtn from '../../shared/comps/RoundBtn';
import OrderBtn from '../../shared/comps/OrderBtn';
import BackupBtn from '../../shared/comps/BackupBtn';
import OriginalBtn from '../../shared/comps/OriginalBtn';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Backup = ({name, setName, currentAccount, setCurrentAccount}) => {
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
  const [promptModal, setpromptModal] = useState(false);

  const promtConfirm = () => {
    setpromptModal(!promptModal);
  };

  const [mnemonic, setMnemonic] = useState([]);
  const [original, setOriginal] = useState([]);
  const [temp, setTemp] = useState([]);

  useEffect(() => {
    // _retrieveData = async () => {
    //   try {
    //     const value = await AsyncStorage.getItem('Account');
    //     if (value !== null) {
    //       // We have data!!
    //       const data = JSON.parse(value);
    //       console.log(data.mnemonic.split(' '));
    //       setOriginal(data.mnemonic.split(' '));
    //       setTemp(shuffle(data.mnemonic.split(' ')));
    //     }
    //   } catch (error) {
    //     console.log('error', error);
    //   }
    // };
    // _retrieveData();
    // console.log('account data fetched');
    setOriginal(currentAccount.Mnemonic.split(' '));
    setTemp(shuffle(currentAccount.Mnemonic.split(' ')));
  }, []);

  const shuffle = array => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const checkMnemonic = () => {
    if (isCorrect()) {
      currentAccount.isBackup = true;
      console.log(currentAccount);
      setCurrentAccount(currentAccount);
      replace('Wallet');
    } else {
      Alert.alert('Error', 'The mnemonic sequence is wrong, please try again', [
        {
          text: 'OK',
          onPress: () => reset(),
          style: 'Okay',
        },
      ]);
    }
  };

  const reset = () => {
    setMnemonic([]);
    setTemp(shuffle(temp));
  };

  const isCorrect = () => {
    console.log('original: ', original);
    console.log('mnemonic: ', mnemonic);
    let i;
    for (i = 0; i < 12; i++) {
      if (original[i] != mnemonic[i]) {
        break;
      }
    }
    if (i == 12) {
      return true;
    }
    return false;
  };

  const handleAddItem = item => {
    setTemp(shuffle(temp));
    setMnemonic(oldArray => [...oldArray, item]);
  };

  const handleRemoveItem = name => {
    setMnemonic(mnemonic.filter(item => item !== name));
  };

  const MnemonicButtons = array =>
    array.map((item, index) => {
      return (
        <View key={index} style={{flex: 1, padding: 5}}>
          <BackupBtn
            disabled={mnemonic.includes(item)}
            title={item}
            press={() => handleAddItem(item)}
          />
        </View>
      );
    });

  const OriginalButtons = (array, order) =>
    array.map((item, index) => {
      return (
        <View key={index} style={{flex: 1, padding: 5}}>
          <OriginalBtn title={`${order + index + 1}. ${item}`} />
        </View>
      );
    });

  const enterButtons = array =>
    array.map((item, index) => {
      return (
        <View key={index} style={{flex: 1, padding: 3, maxWidth: '33%'}}>
          <OrderBtn title={item} press={() => handleRemoveItem(item)} />
        </View>
      );
    });

  return (
    <View style={[BG, flex1]}>
      <StatusBar barStyle={barStyle} />
      <View style={[FG, flex1, marginTop10]}>
        {next ? (
          <>
            <View
              style={{
                padding: 20,
              }}>
              <Text style={[text, styles.title]}>
                Please backup the mnemonic words
              </Text>
              <Text style={[styles.description]}>
                Please choose mnemonic words in order and make sure your nemonic
                was correct written
              </Text>
              <View style={[styles.enterArea, areaBorderColor]}>
                <View style={[styles.row]}>
                  {enterButtons(mnemonic.slice(0, 3))}
                </View>
                <View style={[styles.row]}>
                  {enterButtons(mnemonic.slice(3, 6))}
                </View>
                <View style={[styles.row]}>
                  {enterButtons(mnemonic.slice(6, 9))}
                </View>
                <View style={[styles.row]}>
                  {enterButtons(mnemonic.slice(9, 12))}
                </View>
              </View>
              <View style={[styles.buttonArea]}>
                <View style={[styles.row]}>
                  {MnemonicButtons(temp.slice(0, 3))}
                </View>
                <View style={[styles.row]}>
                  {MnemonicButtons(temp.slice(3, 6))}
                </View>
                <View style={[styles.row]}>
                  {MnemonicButtons(temp.slice(6, 9))}
                </View>
                <View style={[styles.row]}>
                  {MnemonicButtons(temp.slice(9, 12))}
                </View>
              </View>
            </View>
            <View style={flex1} />
            <RoundBtn
              style={{marginBottom: 50}}
              title={'Next'}
              disabled={mnemonic.length != 12}
              press={() => checkMnemonic()}
            />
          </>
        ) : (
          <>
            <View
              style={{
                padding: 20,
              }}>
              <Text style={[text, styles.title]}>
                Please backup the mnemonic words
              </Text>
              <Text style={[styles.description]}>
                Those 12 mnemonic words are for recovering your wallet,write
                down correctly on paper and keep in a safe place
              </Text>
              <View style={[styles.buttonArea]}>
                <View style={[styles.row]}>
                  {OriginalButtons(original.slice(0, 3), 0)}
                </View>
                <View style={[styles.row]}>
                  {OriginalButtons(original.slice(3, 6), 3)}
                </View>
                <View style={[styles.row]}>
                  {OriginalButtons(original.slice(6, 9), 6)}
                </View>
                <View style={[styles.row]}>
                  {OriginalButtons(original.slice(9, 12), 9)}
                </View>
              </View>
            </View>
            <View style={flex1} />
            <RoundBtn
              style={{marginBottom: 50}}
              title={'Next'}
              press={() => setNext(true)}
            />
          </>
        )}
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
              <Text style={[text, styles.modalText]}>Don't screenshot</Text>
              <Text
                style={[text, styles.modalText]}
                onPress={() => setconfirmModal(false)}>
                X
              </Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={{color: '#29DAD7', fontSize: 15}}>
                Anyone with your mnemonic words can access or spend your assets!
                Please write down on paper and keep it safe.
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
        visible={promptModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setpromptModal(!promptModal);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalBack]}></View>
          <View style={[styles.modalView, modalBackground]}>
            <View style={styles.modalHeader}>
              <Text style={[text, styles.modalText]}>Backup Prompt</Text>
              <Text
                style={[text, styles.modalText]}
                onPress={() => setpromptModal(false)}>
                X
              </Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={{color: '#29DAD7', fontSize: 15}}>
                You have not completed the backup of the mnemonic.Leave the
                current page,will remove the mnemonic from the MetaLife
                wallet.Will you leave?
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <RoundBtn
                style={{width: 150, marginHorizontal: 0}}
                title={'Cancel'}
                press={() => setpromptModal(false)}
              />
              <RoundBtn
                style={{width: 150, marginHorizontal: 0}}
                title={'Confirm'}
                press={() => promtConfirm()}
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
    setDarkMode: darkMode => d({type: 'setDarkMode', payload: darkMode}),
    setName: name => d({type: 'set', payload: name}),
    deleteName: name => d({type: 'delete'}),
    setCurrentAccount: account => d({ type: 'setCurrentAccount', payload: account }),
  };
};

const styles = StyleSheet.create({
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
});

export default connect(msp, mdp)(Backup);
