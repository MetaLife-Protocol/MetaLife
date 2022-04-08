'use strict';

/**
 * @Author: lq
 * @desc: dialog封装
 */

import React, {createContext, useContext, useState} from 'react';
import {Alert, Modal, StyleSheet, View} from 'react-native';
import {useStyle} from '../ThemeColors';

export const DialogContext = createContext();
export const useDialog = () => {
  return useContext(DialogContext);
};

const Dialog = ({children}) => {
  const styles = useStyle(createSty);
  const [visible, setVisible] = useState(false),
    [content, setContent] = useState(<View />);

  // const customModal = useRef < Modal > null;

  return (
    <DialogContext.Provider
      value={{
        dismiss: () => {
          setVisible(false);
        },
        show: dialogContent => {
          setVisible(true);
          setContent(dialogContent);
        },
      }}>
      {children}
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>{content}</View>
      </Modal>
    </DialogContext.Provider>
  );
};
const createSty = theme =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
export default Dialog;
