import {connect} from 'react-redux/lib/exports';
import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
} from 'react-native';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import RoundBtn from '../../../../shared/comps/RoundBtn';
import Toast from 'react-native-tiny-toast';
import {ComModal} from '../../../../shared/comps/ComModal';

/**
 * Created on 17 Jun 2022 by lonmee
 *
 */

const WalletBackupMnemonicSelect = ({
  route: {params},
  navigation: {goBack},
  walletUpdateAccount,
}) => {
  // TODO: mnemonic and shuffleMnemonic should get from address
  const {mnemonic, shuffleMnemonic, cb, account} = params;
  const {
    flex1,
    FG,
    BG,
    justifyCenter,
    row,
    alignItemsCenter,
    text,
    marginTop10,
  } = useSchemaStyles();

  const [visible, setVisible] = useState(false);

  const [selectMnemonic, setSelectMnemonic] = useState(
    shuffleMnemonic.map(item => {
      return {
        text: item,
        selected: false,
        error: false,
      };
    }),
  );
  const [newMnemonic, setNewMnemonic] = useState([]);

  const Item = ({item}) => {
    return (
      <Pressable
        style={[styles.item, BG, justifyCenter, alignItemsCenter]}
        onPress={() => {
          if (!item.selected) {
            item.selected = true;
            newMnemonic.push(item);
            setNewMnemonic([...newMnemonic]);

            const correctIndex = mnemonic.indexOf(item.text);
            const nowIndex = newMnemonic.map(it => it.text).indexOf(item.text);
            if (correctIndex !== nowIndex) {
              Toast.show('Wrong mnemonic order', {
                textColor: '#E73553',
                position: -120,
              });
            }
          }
        }}>
        <Text
          style={[
            styles.text,
            text,
            {marginLeft: 0},
            item.selected ? {color: '#8E8E92'} : {},
          ]}>
          {item.text}
        </Text>
      </Pressable>
    );
  };

  const ItemSelect = ({item}) => {
    const correctIndex = mnemonic.indexOf(item.text);
    const nowIndex = newMnemonic.map(it => it.text).indexOf(item.text);

    return (
      <View style={[styles.item, BG, justifyCenter]}>
        {correctIndex !== nowIndex ? (
          <Pressable
            style={styles.delete}
            onPress={() => {
              item.selected = false;
              setNewMnemonic([
                ...newMnemonic.filter(it => it.text !== item.text),
              ]);
            }}>
            <Image source={icon.redDelete} />
          </Pressable>
        ) : null}
        <Text style={[styles.text, text, {marginLeft: 0, color: '#29DAD7'}]}>
          {item.text}
        </Text>
      </View>
    );
  };

  const newContinarHight = 45 * (mnemonic.length / 3) + 10;

  return (
    <SafeAreaView style={[flex1, FG, marginTop10]}>
      <ScrollView>
        <View style={[flex1, styles.container]}>
          <Text style={[text, styles.text]}>
            Please backup the mnemonic words
          </Text>
          <Text style={[marginTop10, text, styles.text, {color: '#4E586E'}]}>
            Please choose mnemonic words in order and make sure your mnemonic
            was correct written
          </Text>
          <View style={[styles.input, row, {height: newContinarHight}]}>
            {newMnemonic.map(item => (
              <ItemSelect item={item} key={item.text} />
            ))}
          </View>
          <View style={[styles.mncontainer, row]}>
            {selectMnemonic.map(item => {
              return <Item item={item} key={item.text} />;
            })}
          </View>
        </View>
      </ScrollView>
      <RoundBtn
        style={[{marginBottom: 30}]}
        disabled={newMnemonic.map(it => it.text).join() !== mnemonic.join()}
        title={'Next'}
        press={() => {
          setVisible(true);
        }}
      />
      <ComModal
        visible={visible}
        setVisible={setVisible}
        title={'Backup Prompt'}
        content={
          <Text style={{color: '#8E8E92', fontSize: 15, lineHeight: 20}}>
            The mnemonic sequence you backed up is verified correctly and the
            mnemonic will be removed from the MetaLife wallet!
          </Text>
        }
        submit={{
          text: 'Confirm',
          press: () => {
            if (cb) {
              cb();
            } else {
              account.backup = true;
              walletUpdateAccount(account);
              goBack();
            }
          },
        }}
      />
    </SafeAreaView>
  );
};

const icon = {
  redDelete: require('../../../../assets/image/wallet/icon_red_delete.png'),
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  text: {
    fontSize: 15,
    lineHeight: 18,
  },
  input: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
    borderWidth: 0.5,
    borderRadius: 12,
    borderColor: '#4E586E',
    padding: 5,
  },
  mncontainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    height: 35,
    width: '30%',
    margin: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 6,
  },
  text: {
    marginLeft: 10,
    fontSize: 15,
    lineHeight: 18,
  },
  delete: {
    position: 'absolute',
    right: -2,
    top: -2,
  },
});

const msp = s => {
  return {};
};

const mdp = d => {
  return {
    walletUpdateAccount: payload => d({type: 'walletUpdateAccount', payload}),
  };
};

export default connect(msp, mdp)(WalletBackupMnemonicSelect);
