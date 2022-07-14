/**
 * Created on 17 Jun 2022 by lonmee
 *
 */
import React, {useEffect, useRef} from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  // Text,
  View,
} from 'react-native';
import Text from '../../../../../shared/comps/ComText';
import useSchemaStyles from '../../../../../shared/UseSchemaStyles';
import {CloseIcons} from '../../../../../shared/Icons';
import {AccountItem} from '../items/AccountItem';
import {useDispatch} from 'react-redux';
import {stopAboutWalletAccount} from '../../../../../utils';

export const WalletAccountSwitchModal = ({
  visible,
  setVisible,
  submitHandler,
  darkMode,
  wallet: {
    current: {type, index},
    accounts,
  },
}) => {
  const {flex1, FG, BG, row, text, alignItemsCenter, justifySpaceBetween} =
      useSchemaStyles(),
    {centeredView, modalView, title, accountItem} = styles;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({type: 'setMask', payload: visible});
  }, [visible]);

  const content = useRef();

  return (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={visible}
      onRequestClose={null}>
      <Pressable
        style={[flex1, centeredView]}
        ref={content}
        onPress={event =>
          event.target === content.current && setVisible(false)
        }>
        <View style={[FG, modalView]}>
          <View style={[row, title, justifySpaceBetween]}>
            <Text style={[text]}>Switch Account</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Image
                source={darkMode ? CloseIcons.xWhite : CloseIcons.xBlack}
              />
            </Pressable>
          </View>
          <ScrollView overScrollMode={'auto'}>
            {accounts[type] &&
              accounts[type].map((v, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    if (i !== index) {
                      submitHandler({
                        type,
                        index: i,
                      });
                      stopAboutWalletAccount();
                    }
                  }}>
                  <AccountItem
                    item={v}
                    selected={i === index}
                    darkMode={darkMode}
                  />
                </Pressable>
              ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flexDirection: 'column-reverse',
  },
  modalView: {
    height: 320,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    padding: 16,
    elevation: 2,
  },
  line: {
    height: 0.5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
