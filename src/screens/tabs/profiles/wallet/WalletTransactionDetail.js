import {Image, Pressable, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Text from '../../../../shared/comps/ComText';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import {bigNumberFormatUnits} from 'react-native-web3-wallet';
import {Buffer} from 'buffer';
import {formatDate} from '../../../../metalife-base';
import {
  coinWaitTransaction,
  getTransactionListenProvider,
} from '../../../../remote/wallet/WalletAPI';
import QRCode from 'react-native-qrcode-svg';
import {financeConfig} from '../../../../remote/wallet/financeConfig';
import NativeClipboard from 'react-native/Libraries/Components/Clipboard/NativeClipboard';
import Toast from 'react-native-tiny-toast';
import {getCurrentTransactionDetail} from '../../../../utils';

const WalletTransactionDetail = ({
  cfg: {darkMode},
  transfer,
  updateTransactionRecord,
  route: {params},
}) => {
  const {address, hash} = params;
  const {flex1, FG, BG, text} = useSchemaStyles();
  const colors = !darkMode ? '#F0F0F0' : '#000';
  const normal = darkMode ? '#4E586E' : '#A5ABB7';
  const [transactData, settransactData] = useState(
    getCurrentTransactionDetail(transfer, address, hash),
  );
  const qrcodeUrl =
    financeConfig.chains[transactData.type].explorerURL +
    'tx.html?hash=' +
    transactData.hash;

  useEffect(() => {
    const getWaitTransaction = async () => {
      try {
        const res = await coinWaitTransaction(
          transactData.type,
          transactData.detail.hash,
        );
        updateTransactionRecord({
          ...transactData,
          gasUsed: res.gasUsed,
          status: 'Synchronizing(1/20)...',
          statusImg: icons.sync,
          blockNumber: res.blockNumber,
          textColor: '#29DAD7',
        });
        let provider = getTransactionListenProvider(transactData.type);
        provider.on(transactData.detail.hash, resListen => {
          updateTransactionRecord({
            ...transactData,
            blockNumber: resListen.blockNumber,
            gasUsed: resListen.gasUsed,
            statusImg: icons.sync,
            status: 'Synchronizing(' + resListen.confirmations + '/20)...',
            textColor: '#29DAD7',
          });
          if (resListen.confirmations > 19) {
            provider.removeAllListeners(transactData.detail.hash);
            updateTransactionRecord({
              ...transactData,
              blockNumber: resListen.blockNumber,
              gasUsed: resListen.gasUsed,
              status: 'Transaction complete',
              statusImg: icons.complete,
              textColor: '#46C288',
            });
          }
        });
      } catch (e) {
        console.log('error', e);
        updateTransactionRecord({
          ...transactData,
          status: 'Transaction failed',
          statusImg: icons.fail,
          textColor: '#E73553',
        });
      }
    };
    getWaitTransaction();
  }, []);

  return (
    <View style={[flex1, BG]}>
      <View style={[FG, styles.con]}>
        <Image source={transactData.statusImg} style={styles.img} />
        <Text style={[styles.synText, {color: transactData.textColor}]}>
          {transactData.status}
        </Text>
        <Text style={[text, styles.smtText]}>
          {transactData.amount}{' '}
          {transactData.contract
            ? transactData.cType
            : transactData.type === 'spectrum'
            ? 'SMT'
            : transactData.type === 'ethereum'
            ? 'ETH'
            : ''}
        </Text>
        <Text style={[{color: normal}, styles.sender]}>Sender</Text>
        <Text style={[text, styles.comText]}>{transactData.detail.from}</Text>
        <Text style={[styles.benText, {color: normal}]}>Beneficiary</Text>
        <Text style={[text, styles.comText]}>{transactData.detail.to}</Text>
        <Text style={[styles.benText, {color: normal}]}>Remark</Text>
        <Text style={[text, styles.comText]}>
          {transactData.remark}
          {/* {Buffer.from(transactData?.data.replace('0x', ''), 'hex').toString()} */}
        </Text>
        <Text style={[styles.benText, {color: normal}]}>Gas</Text>
        <Text style={[text, styles.comText]}>
          {transactData?.gasUsed
            ? bigNumberFormatUnits(transactData?.gasUsed, 9) +
              ' ' +
              (transactData.type === 'spectrum'
                ? 'smt'
                : transactData.type === 'ethereum'
                ? 'eth'
                : '')
            : ''}
        </Text>
        <View style={[styles.line, {backgroundColor: colors}]} />
        <Text style={[styles.benText, {color: normal}]}>
          Transaction number
        </Text>
        <Text style={[text, styles.comText]}>{transactData.detail.hash}</Text>
        <Text style={[styles.benText, {color: normal}]}>Block</Text>
        <Text style={[text, styles.comText]}>
          {[transactData?.blockNumber]}
        </Text>
        <Text style={[styles.benText, {color: normal}]}>Transaction hour</Text>
        <Text style={[text, styles.comText, {marginBottom: 20}]}>
          {formatDate({time: transactData.date, format: 'DD/MM/YY hh:mm:ss'})}
        </Text>
        <View style={styles.copyView}>
          <View style={styles.qrView}>
            <QRCode
              size={55}
              value={qrcodeUrl}
              logoBackgroundColor="transparent"
            />
          </View>
          <Pressable
            onPress={() => {
              NativeClipboard.setString(qrcodeUrl);
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
  complete: require('../../../../assets/image/wallet/Transactioncomplete.png'),
  fail: require('../../../../assets/image/wallet/Transactionfailed.png'),
  sync: require('../../../../assets/image/wallet/Synchronizing.png'),
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
    transfer: s.transfer,
  };
};

const mdp = d => {
  return {
    updateTransactionRecord: payload =>
      d({type: 'updateTransactionRecord', payload}),
  };
};

export default connect(msp, mdp)(WalletTransactionDetail);
