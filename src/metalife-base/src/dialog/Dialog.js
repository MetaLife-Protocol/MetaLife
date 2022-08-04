'use strict';

/**
 * @Author: lq
 * @desc: dialog封装
 */

import React, {createContext, useContext, useState} from 'react';
import {useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const DialogContext = createContext();
export const useDialog = () => {
  return useContext(DialogContext);
};

export const Dialog = ({children}) => {
  const [visible, setVisible] = useState(false),
    [content, setContent] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [toastDuration, setToastDuration] = useState(3000);
  const [toastLoading, setToastLoading] = useState(false);

  // const customModal = useRef < Modal > null;
  useEffect(() => {
    if (toastVisible && toastDuration !== 0) {
      const timer = setTimeout(
        () => setToastVisible && setToastVisible(false),
        toastDuration,
      );
      return () => {
        clearTimeout(timer);
      };
    }
  }, [toastVisible, toastDuration]);

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
        showLoading: () => {
          setToastLoading(true);
        },
        hideLoading: () => {
          setToastLoading(false);
        },
        showToast: (toastContent, toastDuration) => {
          setToastVisible(true);
          setToastDuration(toastDuration ? toastDuration : 3000);
          setToastContent(toastContent);
        },
        hideToast: () => {
          setToastVisible(false);
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
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}>
          {content}
          {toastVisible ? (
            <View style={styles.toast}>
              <Text style={styles.toastText}>{toastContent}</Text>
            </View>
          ) : null}
          {toastLoading ? (
            <View style={styles.toast}>
              <ActivityIndicator style={styles.loading} />
            </View>
          ) : null}
        </View>
      </Modal>
    </DialogContext.Provider>
  );
};

const styles = StyleSheet.create({
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
  loading: {
    height: 30,
    width: 30,
  },
});
