'use strict';

/**
 * @Author: lq
 * @desc: dialog封装
 */

import React, {createContext, useContext, useState} from 'react';
import {Alert, Modal, View} from 'react-native';

export const DialogContext = createContext();
export const useDialog = () => {
  return useContext(DialogContext);
};

export const Dialog = ({children}) => {
  const [visible, setVisible] = useState(false),
    [content, setContent] = useState(null);

  // const customModal = useRef < Modal > null;

  return (
    <DialogContext.Provider
      value={{
        dismiss: () => {
          setVisible(false);
          setContent(null);
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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {content}
        </View>
      </Modal>
    </DialogContext.Provider>
  );
};
