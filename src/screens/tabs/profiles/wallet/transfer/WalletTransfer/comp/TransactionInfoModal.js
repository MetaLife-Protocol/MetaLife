import Slider from '@react-native-community/slider';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  bigNumberFormatUnits,
  bigNumberParseUnits,
} from 'react-native-web3-wallet';
import {ComModal} from '../../../../../../../shared/comps/ComModal';
import useSchemaStyles from '../../../../../../../shared/UseSchemaStyles';

const TransactionConfirmModal = ({
  darkMode,
  onConfirm,
  toastVisible = false,
  setToastVisible,
  toastContent,
  toastDuriation,
  visible,
  setVisible,
  data,
}) => {
  const {text, marginTop10} = useSchemaStyles();
  const [gasPrice, setGasPrice] = useState(
    data.gasPrice ? data.gasPrice : bigNumberParseUnits('18', 9),
  );
  if (!data.gasPriceNumber) return null;
  return (
    <ComModal
      visible={visible}
      setVisible={setVisible}
      title={'Transaction Details'}
      darkMode={darkMode}
      toastDuriation={toastDuriation}
      content={
        <View style={[styles.container]}>
          <Text style={[text, styles.mlt]}>{data?.price}</Text>
          <Text style={[styles.comText]}>Info</Text>
          <Text style={[text, styles.content]}>{data?.info}</Text>
          <Text style={[styles.comText]}>To</Text>
          <Text style={[text, styles.content]}>{data?.to}</Text>
          <Text style={[styles.comText]}>From</Text>
          <Text style={[text, styles.content]}>{data?.from}</Text>
          <View style={styles.gasView}>
            <Text style={styles.comText}>Gas</Text>
            <Text style={[text, styles.gasText]}>
              {bigNumberFormatUnits(data?.gasLimit.mul(gasPrice))} smt
            </Text>
          </View>
          <Slider
            style={[styles.slider, marginTop10]}
            minimumValue={Number(data?.gasPriceNumber)}
            maximumValue={Number(data?.gasPriceNumber) + 10}
            value={Number(bigNumberFormatUnits(gasPrice, 9))}
            thumbTintColor="#29DAD7"
            minimumTrackTintColor="#29DAD7"
            maximumTrackTintColor="#DADADA"
            step={1}
            onValueChange={value => {
              console.log(value);
              setGasPrice(bigNumberParseUnits(value + '', 9));
            }}
          />
        </View>
      }
      toastVisible={toastVisible}
      setToastVisible={setToastVisible}
      toastContent={toastContent}
      submit={{
        text: 'Confirm',
        press: () => {
          onConfirm(data?.pwd);
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
  mlt: {
    fontWeight: 'bold',
    fontSize: 23,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  comText: {
    fontSize: 14,
    color: '#4E586E',
    marginTop: 15,
  },
  content: {
    fontSize: 12,
    marginTop: 8,
  },
  slider: {
    height: 40,
    width: 345,
    alignSelf: 'center',
  },
  gasText: {fontSize: 13, marginTop: 15},
  gasView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default TransactionConfirmModal;
