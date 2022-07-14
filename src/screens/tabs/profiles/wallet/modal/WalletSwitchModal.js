/**
 * Created on 17 Jun 2022 by lonmee
 *
 */
import React, {useEffect, useRef} from 'react';
import {Image, Modal, Pressable, StyleSheet, View} from 'react-native';
import Text from '../../../../../shared/comps/ComText';
import useSchemaStyles from '../../../../../shared/UseSchemaStyles';
import {CloseIcons} from '../../../../../shared/Icons';
import WalletCore from '../comp/WalletCore';
import PullMenu from '../../../../../shared/comps/PullMenu';
import {useDispatch} from 'react-redux';

export const WalletSwitchModal = ({visible, setVisible, darkMode}) => {
  const {flex1, FG, BG, row, text, justifySpaceBetween} = useSchemaStyles(),
    {centeredView, modalView, title, line, textStyle} = styles;

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
      onRequestClose={() => setVisible(false)}>
      <Pressable
        style={[flex1, centeredView]}
        ref={content}
        onPress={event =>
          event.target === content.current && setVisible(false)
        }>
        <View style={[FG, modalView]}>
          <View style={[row, title, justifySpaceBetween]}>
            <Image source={darkMode ? icons.walletB : icons.walletW} />
            <Text style={[text, textStyle]}>Wallet management</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Image
                source={darkMode ? CloseIcons.xWhite : CloseIcons.xBlack}
              />
            </Pressable>
          </View>
          <View style={[BG, line]} />
          <WalletCore closeHandler={() => setVisible(false)} />
        </View>
        <PullMenu />
      </Pressable>
    </Modal>
  );
};

const icons = {
  walletB: require('../../../../../assets/image/wallet/wallet-balck.png'),
  walletW: require('../../../../../assets/image/wallet/wallet-white.png'),
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
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
