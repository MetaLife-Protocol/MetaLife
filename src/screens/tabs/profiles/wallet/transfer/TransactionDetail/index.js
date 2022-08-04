import {Image, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../../../../../shared/comps/ComText';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../../../../../shared/UseSchemaStyles';
import {bigNumberFormatUnits} from 'react-native-web3-wallet';
import {formatDate} from '../../../../../../metalife-base';
import QRCode from 'react-native-qrcode-svg';
import NativeClipboard from 'react-native/Libraries/Components/Clipboard/NativeClipboard';
import Toast from 'react-native-tiny-toast';
import {useTransferDataHooks} from './useTransferDataHooks';
import {getCurrentAccount} from '../../../../../../utils';

const TransactionDetail = ({cfg: {darkMode}, wallet, route: {params}}) => {
  const {hash, gasPrice} = params;
  const {flex1, FG, BG, text} = useSchemaStyles();
  const colors = !darkMode ? '#F0F0F0' : '#000';
  const normal = darkMode ? '#4E586E' : '#A5ABB7';
  const chainType = wallet.current.type;
  const currentAccount = getCurrentAccount(wallet);
  const transactData = useTransferDataHooks(
    gasPrice,
    hash,
    chainType,
    currentAccount.address,
  );

  const getImg = () => {
    if (transactData.status === 0 || transactData.status === 1) {
      return icons.sync;
    } else if (transactData.status === 2) {
      return icons.complete;
    } else if (transactData.status === 3) {
      return icons.fail;
    }
  };

  const getStatusText = () => {
    if (transactData.status === 0) {
      return 'waiting ...';
    } else if (transactData.status === 1) {
      return `Synchronizing(${transactData.syncNumber}/20)...`;
    } else if (transactData.status === 2) {
      return 'Transaction complete';
    } else if (transactData.status === 3) {
      return 'Transaction failed';
    }
  };

  const getStatusTextColor = () => {
    if (transactData.status === 0) {
      return '#29DAD7';
    } else if (transactData.status === 1) {
      return '#29DAD7';
    } else if (transactData.status === 2) {
      return '#46C288';
    } else if (transactData.status === 3) {
      return '#E73553';
    }
  };

  const getAmountText = () => {
    return transactData.amount + ' ' + transactData.coinType;
  };

  return (
    <View style={[flex1, BG]}>
      <View style={[FG, styles.con]}>
        <Image source={getImg()} style={styles.img} />
        <Text style={[styles.synText, {color: getStatusTextColor()}]}>
          {getStatusText()}
        </Text>
        <Text style={[text, styles.smtText]}>
          {transactData.amountPrefix} {getAmountText()}
        </Text>
        <Text style={[text, styles.synText]}>{transactData.tip}</Text>
        <Text style={[{color: normal}, styles.sender]}>Sender</Text>
        <Text style={[text, styles.comText]}>{transactData.from}</Text>
        <Text style={[styles.benText, {color: normal}]}>Beneficiary</Text>
        <Text style={[text, styles.comText]}>{transactData.to}</Text>

        <Text style={[styles.benText, {color: normal}]}>Remark</Text>
        <Text style={[text, styles.comText]}>
          {transactData.remark}
          {/* {Buffer.from(transactData?.data.replace('0x', ''), 'hex').toString()} */}
        </Text>
        <Text style={[styles.benText, {color: normal}]}>Gas Fee</Text>
        <Text style={[text, styles.comText]}>
          {transactData.gasUsed
            ? bigNumberFormatUnits(
                transactData?.gasUsed.mul(transactData.gasPrice),
              ) + ' smt'
            : ''}
        </Text>
        <View style={[styles.line, {backgroundColor: colors}]} />
        <Text style={[styles.benText, {color: normal}]}>
          Transaction number
        </Text>
        <Text style={[text, styles.comText]}>{transactData.hash}</Text>
        <Text style={[styles.benText, {color: normal}]}>Block</Text>
        <Text style={[text, styles.comText]}>{transactData.blockNumber}</Text>
        <Text style={[styles.benText, {color: normal}]}>Transaction hour</Text>
        <Text style={[text, styles.comText, {marginBottom: 20}]}>
          {formatDate({time: transactData.date, format: 'DD/MM/YY hh:mm:ss'})}
        </Text>
        <View style={styles.copyView}>
          <View style={styles.qrView}>
            <QRCode
              size={55}
              value={transactData.url}
              logoBackgroundColor="transparent"
            />
          </View>
          <Pressable
            onPress={() => {
              NativeClipboard.setString(transactData.url);
              Toast.show('Copy Success');
            }}>
            <Text style={styles.copy}>复制URL</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const icons = {
  complete: require('../../../../../../assets/image/wallet/Transactioncomplete.png'),
  fail: require('../../../../../../assets/image/wallet/Transactionfailed.png'),
  sync: require('../../../../../../assets/image/wallet/Synchronizing.png'),
};

const styles = StyleSheet.create({
  con: {
    margin: 8,
    borderRadius: 12,
    padding: 15,
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
  },
  synText: {
    fontSize: 15,
    color: '#29DAD7',
    marginTop: 8,
    alignSelf: 'center',
  },
  smtText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 8,
  },
  sender: {
    marginTop: 26,
    fontSize: 13,
    marginBottom: 6,
  },
  benText: {
    marginTop: 10,
    fontSize: 13,
    marginBottom: 6,
  },
  line: {
    height: 1,
    marginTop: 15,
    marginBottom: 5,
  },
  comText: {
    fontSize: 13,
  },
  qrView: {
    width: 65,
    height: 65,
    borderRadius: 6,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copy: {
    fontSize: 11,
    color: '#29DAD7',
    alignSelf: 'center',
    marginTop: 5,
  },
  copyView: {
    position: 'absolute',
    bottom: 20,
    right: 15,
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
    wallet: s.wallet,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(TransactionDetail);
