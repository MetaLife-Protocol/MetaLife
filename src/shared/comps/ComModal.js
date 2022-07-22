/**
 * Created on 09 Mar 2022 by lonmee
 */
import React, {useEffect} from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  // Text,
  View,
} from 'react-native';
import Text from '../../shared/comps/ComText';
import useSchemaStyles from '../UseSchemaStyles';
import RoundBtn from './RoundBtn';

const icons = {
  closeDefautW: require('../../assets/image/wallet/icon_close_default_white.png'),
  closeDefaultB: require('../../assets/image/wallet/icon_close_default_black.png'),
  clossePressW: require('../../assets/image/wallet/icon_close_presses_white.png'),
  clossePressB: require('../../assets/image/wallet/icon_close_presses_black.png'),
};

export const ComModal = ({
  visible = true,
  setVisible,
  title,
  content,
  darkMode,
  cancel = false,
  submit,
  toastVisible = false,
  setToastVisible,
  toastContent,
  toastDuriation = 3000,
}) => {
  const {flex1, modalBG, row, text, justifySpaceBetween} = useSchemaStyles();

  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(
        () => setToastVisible && setToastVisible(false),
        toastDuriation,
      );
      return () => {
        clearTimeout(timer);
      };
    }
  }, [toastVisible, toastDuriation]);

  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={visible}
      onRequestClose={null}>
      <Pressable style={styles.centeredView}>
        <View style={[styles.modalView, modalBG]}>
          <View style={[row, justifySpaceBetween, styles.paddingHorizontal]}>
            <Text style={[styles.title, text, flex1]}>{title}</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Image
                source={darkMode ? icons.closeDefaultB : icons.closeDefautW}
              />
            </Pressable>
          </View>
          <View style={[styles.contentView, styles.paddingHorizontal]}>
            {content}
          </View>
          <View style={[justifySpaceBetween, row, styles.buttonView]}>
            {cancel ? (
              <View style={[flex1]}>
                <RoundBtn
                  disabled={toastVisible}
                  title={cancel.text}
                  press={() => setVisible(false)}
                />
              </View>
            ) : null}
            <View style={[flex1]}>
              <RoundBtn
                disabled={toastVisible}
                title={submit.text}
                press={submit.press}
              />
            </View>
          </View>
        </View>
        {toastVisible ? (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toastContent}</Text>
          </View>
        ) : null}
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 23, 23, 0.8)',
  },
  paddingHorizontal: {
    paddingHorizontal: 15,
  },
  modalView: {
    flex: 1,
    margin: 15,
    borderRadius: 20,
    paddingVertical: 20,
    backgroundColor: '#0ff',
  },
  title: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 17,
  },
  contentView: {
    marginTop: 17,
    marginBottom: 20,
  },
  buttonView: {
    height: 44,
    marginBottom: 5,
  },
  toast: {
    position: 'absolute',
    zIndex: 999,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#000',
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
  },
});
