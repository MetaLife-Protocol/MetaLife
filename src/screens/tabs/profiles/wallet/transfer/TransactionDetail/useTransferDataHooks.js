import {useEffect, useState} from 'react';
import {
  bigNumberFormatUnits,
  bigNumberParseUnits,
} from 'react-native-web3-wallet';
import {financeConfig} from '../../../../../../remote/wallet/financeConfig';
import {getTransactionListenProvider} from '../../../../../../remote/wallet/WalletAPI';
import {contractsConstant} from '../../../../../../remote/contractsConstant';
import {Buffer} from 'buffer';
import {getPhotonInfo} from './photonEventUtils';
import {getErc20Info} from './erc20EventUtils';
import {getNftInfo} from './nftEventUtils';
import {getAmountPrefix} from './utils';

export const useTransferDataHooks = (
  gasPrice,
  hash,
  chainType,
  currentAddress,
) => {
  const initData = {
    from: '',
    to: '',
    amount: '',
    coinType: '',
    gasPrice: bigNumberParseUnits(gasPrice.toString(), 9),
    gasUsed: '',
    isContract: false,
    hash: hash,
    blockNumber: '',
    date: '',
    url: financeConfig.chains.spectrum.explorerURL + 'tx.html?hash=' + hash,
    status: 0, // 0 wait package 1 sync 2 complete 3 fail
    syncNumber: 0,
    tip: '',
    amountPrefix: '',
  };
  const [transactData, setTransactData] = useState(initData);

  const getToAddressAmount = async (logs, abiName) => {
    if (abiName === 'erc20') {
      // coin相关
      return getErc20Info(logs, currentAddress);
    }
    if (abiName === 'metaMaster') {
      const nftInfo = await getNftInfo(logs, currentAddress);
      return nftInfo;
    }
    return false;
  };

  const getTransactionReceipt = async (resData, provider) => {
    try {
      const transferRes = await provider.getTransactionReceipt(hash);
      // console.log('getTransactionReceipt', JSON.stringify(transferRes));
      const blockRes = await provider.getBlock(transferRes.blockNumber);
      // console.log('getBlock', blockRes);
      resData = {
        ...resData,
        date: blockRes.timestamp,
        blockNumber: transferRes.blockNumber,
        gasUsed: transferRes.gasUsed,
      };
      const logs = transferRes.logs ? transferRes.logs : [];
      if (logs.length <= 0) {
        // main chain
        resData = {
          ...resData,
          to: transferRes.to.toLowerCase(),
          isContract: false,
          coinType: 'SMT',
        };
        if (transferRes.confirmations > 0 && transferRes.status !== 1) {
          resData = {
            ...resData,
            status: 3,
          };

          setTransactData(resData);
          return resData;
        }

        setTransactData(resData);
        return resData;
      } else {
        resData = {
          ...resData,
          remark: '',
        };
        // contract
        // 得到是哪个合约
        const contractAddress = transferRes.to.toLowerCase();
        const spectrumContracts = contractsConstant.spectrum;
        let coinType; // 合约名字
        let abiName;
        for (const item in spectrumContracts) {
          if (item.toLowerCase() === contractAddress) {
            coinType = spectrumContracts[item].symbol;
            abiName = spectrumContracts[item].abiName;
            break;
          }
        }

        console.log('coinType', coinType, abiName);
        // console.log('abiName', abiName);
        // 获取是什么方法
        // console.log('topic', logs);
        // const topic = logs[0].topics;
        resData = {
          ...resData,
          isContract: true,
          coinType,
        };
        let addressObj;
        if (abiName === 'erc20-photon' || abiName === 'PhotonLayer2') {
          addressObj = getPhotonInfo(
            logs,
            abiName,
            transferRes.from.toLowerCase(),
            currentAddress,
          );
        } else {
          addressObj = await getToAddressAmount(logs, abiName, currentAddress);
        }
        if (addressObj) {
          resData = {
            ...resData,
            ...addressObj,
          };
        }
        if (transferRes.confirmations > 0 && transferRes.status !== 1) {
          resData = {
            ...resData,
            status: 3,
          };

          setTransactData(resData);
          return resData;
        }
        setTransactData(resData);
        return resData;
      }
    } catch (e) {
      console.log('getReceipt-error', e);
    }
  };

  useEffect(() => {
    let resData;
    let isGetReceipt = false;
    let provider = getTransactionListenProvider('spectrum');
    provider.getTransaction(hash).then(async transRes => {
      // console.log('transferData', transRes);
      resData = {
        ...transactData,
        from: transRes.from.toLowerCase(),
        to: transRes.to.toLowerCase(),
        blockNumber: transRes.blockNumber,
        amount: bigNumberFormatUnits(transRes.value),
        amountPrefix: getAmountPrefix(transRes.to),
      };
      if (transRes.data) {
        resData = {
          ...resData,
          remark: Buffer.from(
            transRes.data.replace('0x', ''),
            'hex',
          ).toString(),
        };
      }
      if (transRes.confirmations > 0) {
        isGetReceipt = true;
        resData = await getTransactionReceipt(resData, provider);
      }
      if (transRes.confirmations < 20) {
        provider.on(hash, async resListen => {
          if (resListen.status === 1) {
            if (!isGetReceipt && resListen.confirmations > 0) {
              isGetReceipt = true;
              resData = await getTransactionReceipt(resData, provider);
            }
            resData = {
              ...resData,
              gasUsed: resListen.gasUsed,
              status: 1,
              syncNumber: resListen.confirmations,
            };
            setTransactData(resData);
            if (resListen.confirmations > 19) {
              provider.removeAllListeners(hash);
              resData = {
                ...resData,
                status: 2,
              };
              setTransactData(resData);
            }
          } else {
            resData = {
              ...resData,
              status: 3,
            };
            setTransactData(resData);
          }
        });
      } else {
        resData = {
          ...resData,
          status: resData.status === 3 ? resData.status : 2,
        };
        setTransactData(resData);
      }
    });
  }, []);
  return transactData;
};
