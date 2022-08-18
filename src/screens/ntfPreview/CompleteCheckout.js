import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import Text from '../../shared/comps/ComText';
import TitleAndTips from './comp/TitleAndTips';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../shared/UseSchemaStyles';
import {
  fixWalletAddress,
  formTimeUtil,
  getCurrentAccount,
  screenHeight,
  screenWidth,
} from '../../utils';
import PasswordModel from '../../shared/comps/PasswordModal';
import {getAccount, getTransferGasPrice} from '../../remote/wallet/WalletAPI';
import {
  getBuyGasLimit,
  getBuyGasLimitByErc20,
  getBuyNft,
  getBuyNftByERC20,
  getLimitSell,
} from '../../remote/contractOP';
import TransactionModal from './comp/TransactionModal';
import {financeConfig} from '../../remote/wallet/financeConfig';
import {contractsConstant} from '../../remote/contractsConstant';
import {
  bigNumberFormatUnits,
  bigNumberParseUnits,
  createBigNumber,
} from 'react-native-web3-wallet';
const icon = require('../../assets/image/icons/lingtuan.png');

const CompleteCheckout = ({route: {params}, darkMode, wallet, navigation}) => {
  const {tokenId, address, image, name, price, fee, token, accountPrice} =
    params;
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();
  const [pwdVisible, setPwdVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [showTrans, setShowTrans] = useState(false);
  const [gasLimit, setGasLimit] = useState(createBigNumber(0));
  const [showLoading, setShowLoading] = useState(false);
  const [pwd, setPwd] = useState(null);
  const type =
    token === '0x0000000000000000000000000000000000000000'
      ? 'SMT'
      : contractsConstant.spectrum[token?.toLowerCase()].symbol;
  const onConfirmTransaction = pwd => {
    setToastVisible(true);
    setToastContent('loading...');
    setPwd(pwd);
    const currentAccount = getCurrentAccount(wallet);
    const surePrice =
      type === 'SMT'
        ? bigNumberParseUnits(
            price,
            financeConfig.chains[currentAccount.type].decmis,
          )
        : bigNumberParseUnits(
            price,
            financeConfig.contracts[currentAccount.type][type].decmis,
          );
    getAccount(currentAccount?.address, (isExit, keystore) => {
      if (type === 'SMT') {
        getBuyGasLimit(
          currentAccount.type,
          keystore,
          pwd,
          tokenId,
          address,
          surePrice,
          // channel,
          // surePrice,
          // formTimeUtil(selectMap.month),
          cb => {
            // console.log('ccccc', cb.toNumber());
            setGasLimit(cb);
            setPwdVisible(false);
            setToastVisible(false);
            setShowTrans(true);
          },
          er => {
            setPwdVisible(false);
            setToastVisible(false);
          },
        );
      } else {
        getBuyGasLimitByErc20(
          currentAccount.type,
          keystore,
          pwd,
          tokenId,
          address,
          surePrice,
          token,
          // channel,
          // surePrice,
          // formTimeUtil(selectMap.month),
          cb => {
            // console.log('ccccc', cb.toNumber());
            setGasLimit(cb);
            setPwdVisible(false);
            setToastVisible(false);
            setShowTrans(true);
          },
          er => {
            setPwdVisible(false);
            setToastVisible(false);
          },
        );
      }
    });
  };
  const buyPress = (gasLimits, gasPrices) => {
    setShowLoading(true);
    const currentAccount = getCurrentAccount(wallet);
    const surePrice =
      type === 'SMT'
        ? bigNumberParseUnits(
            price,
            financeConfig.chains[currentAccount.type].decmis,
          )
        : bigNumberParseUnits(
            price,
            financeConfig.contracts[currentAccount.type][type].decmis,
          );
    getAccount(currentAccount?.address, (isExit, keystore) => {
      if (type === 'SMT') {
        getBuyNft(
          currentAccount.type,
          keystore,
          pwd,
          tokenId,
          address,
          gasLimits * 10000,
          surePrice,
          hash => {
            setShowLoading(false);
            navigation.navigate('TransactionDetail', {
              gasPrice: gasPrices,
              hash,
            });
          },
          er => {
            setShowLoading(false);
            setPwdVisible(false);
            setToastVisible(false);
          },
        );
      } else {
        getBuyNftByERC20(
          currentAccount.type,
          keystore,
          pwd,
          tokenId,
          address,
          surePrice,
          token,
          hash => {
            setShowLoading(false);
            navigation.navigate('TransactionDetail', {
              gasPrice: bigNumberFormatUnits(gasPrices, 9),
              hash,
            });
          },
          er => {
            setShowLoading(false);
            setPwdVisible(false);
            setToastVisible(false);
          },
        );
      }
    });
  };
  const clickCheckOut = () => {
    setPwdVisible(true);
  };
  return (
    <View style={[BG, flex1, styles.con]}>
      <Text style={[text, styles.collect]}>Collectibles</Text>
      <View style={[styles.collectView, FG]}>
        <Image source={{uri: image}} style={styles.collectImg} />
        <View style={styles.permissView}>
          <Text style={styles.permissText}>Permissionless Gallery</Text>
          <Text style={[text, styles.content]}>{name}</Text>
          <View style={styles.priceView}>
            <Image source={icon} />
            <Text style={[text, styles.gallPrice]}>{price}</Text>
          </View>
        </View>
      </View>
      <Text
        style={[
          styles.permissText,
          styles.feeText,
        ]}>{`Service Fee: ${'2.5%'}`}</Text>
      <Text
        style={[
          styles.permissText,
          styles.feeText,
        ]}>{`Creator Fee: ${fee}`}</Text>
      <Pressable style={styles.checkView} onPress={clickCheckOut}>
        <Text style={styles.checkText}>Checkout</Text>
      </Pressable>
      <PasswordModel
        darkMode={darkMode}
        pwdVisible={pwdVisible}
        setPwdVisible={setPwdVisible}
        toastVisible={toastVisible}
        setToastVisible={setToastVisible}
        toastContent={toastContent}
        toastDuriation={6000000}
        onConfirm={pwd => {
          onConfirmTransaction(pwd);
        }}
      />
      <TransactionModal
        showTrans={showTrans}
        setShowTrans={setShowTrans}
        darkMode={darkMode}
        list={{
          // price: price + type,
          price: price + ' ' + type,
          to: '0x4f47b5f2685d5d108d008577728242905ff9e5a8',
          from: fixWalletAddress(getCurrentAccount(wallet).address),
          gasLimit: gasLimit,
          content: 'Buy NFT',
          type: type,
          // accountPrice: accountPrice,
        }}
        showLoading={showLoading}
        confirmPress={buyPress}
        wallet={wallet}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  con: {
    padding: 15,
  },
  collect: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  collectImg: {
    width: 103,
    height: 103,
    borderRadius: 12,
    // marginLeft: 15,
  },
  collectView: {
    flexDirection: 'row',
    height: 133,
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  permissView: {marginLeft: 10},
  permissText: {
    fontSize: 14,
    color: '#8E8E92',
  },
  content: {
    fontSize: 16,
    marginTop: 10,
  },
  gallPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  feeText: {
    alignSelf: 'flex-end',
    marginTop: 15,
  },
  checkView: {
    width: screenWidth - 30,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#29DAD7',
    marginTop: screenHeight / 2.5 + 50,
  },
  checkText: {
    fontSize: 15,
    color: '#000000',
  },
  priceView: {flexDirection: 'row', marginTop: 30},
});
const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    wallet: s.wallet,
    nft: s.nft,
    darkMode: s.cfg.darkMode,
  };
};

const mdp = d => {
  return {
    deleteNftItemList: payload => d({type: 'deleteNftItemList', payload}),
  };
};

export default connect(msp, mdp)(CompleteCheckout);
