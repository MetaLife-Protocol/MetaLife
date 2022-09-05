import React, {useState} from 'react';
import {useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  bigNumberFormatUnits,
  bigNumberParseUnits,
} from 'react-native-web3-wallet';
import {useStore} from 'react-redux';
import {PureTextInput} from '../../../../../../../metalife-base';
import {ComModal} from '../../../../../../../shared/comps/ComModal';
import useSchemaStyles from '../../../../../../../shared/UseSchemaStyles';

const ResetTransModal = ({
  resetVisible,
  setResetVisible,
  gasPrice,
  gasLimit,
  onConfirm,
}) => {
  const {text, alignItemsCenter, row} = useSchemaStyles();
  const [resetGasPrice, setResetGasPrice] = useState(
    bigNumberFormatUnits(gasPrice.toString(), 9),
  );
  const [resetGasLimit, setResetGasLimit] = useState(
    bigNumberFormatUnits(gasLimit.toString(), 0),
  );
  useEffect(() => {
    setResetGasLimit(bigNumberFormatUnits(gasLimit.toString(), 0));
  }, [gasLimit]);

  const store = useStore();
  const {cfg} = store.getState();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastContent, setToastContent] = useState('');
  return (
    <ComModal
      title={'Reset gas price and gas limit'}
      visible={resetVisible}
      setVisible={setResetVisible}
      darkMode={cfg.darkMode}
      toastVisible={toastVisible}
      setToastVisible={setToastVisible}
      toastContent={toastContent}
      content={
        <View style={[alignItemsCenter]}>
          <View style={[row, styles.inputContainer]}>
            <Text style={[text]}>Gas Price:</Text>
            <PureTextInput
              placeholder={bigNumberFormatUnits(gasPrice.toString(), 9)}
              style={styles.input}
              onChangeText={setResetGasPrice}
            />
          </View>
          <View style={[row, styles.inputContainer]}>
            <Text style={[text]}>Gas Limit:</Text>
            <PureTextInput
              placeholder={bigNumberFormatUnits(gasLimit.toString(), 0)}
              style={styles.input}
              onChangeText={setResetGasLimit}
            />
          </View>
        </View>
      }
      submit={{
        text: 'submit',
        press: () => {
          if (isNaN(resetGasPrice) || isNaN(resetGasLimit)) {
            setToastVisible(true);
            setToastContent('invalid number!');
            return;
          }
          onConfirm(
            bigNumberParseUnits(resetGasPrice, 9),
            bigNumberParseUnits(resetGasLimit, 0),
          );
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  nonceType: {
    padding: 8,
    width: 100,
    margin: 5,
    borderRadius: 4,
    justifyContent: 'center',
    borderWidth: 1,
  },
  nonceText: {
    fontSize: 16,
    textAlign: 'center',
  },
  inputContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  input: {
    borderRadius: 12,
    flex: 1,
    lineHeight: 44,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
});

export default ResetTransModal;
