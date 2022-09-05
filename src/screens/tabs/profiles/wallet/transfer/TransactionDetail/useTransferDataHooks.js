import {useEffect, useState} from 'react';
import {
  bigNumberFormatUnits,
  bigNumberParseUnits,
  createBigNumber,
  getContract,
  hexZeroPad,
} from 'react-native-web3-wallet';
import {financeConfig} from '../../../../../../remote/wallet/financeConfig';
import {getTransactionListenProvider} from '../../../../../../remote/wallet/WalletAPI';
import {contractsConstant} from '../../../../../../remote/contractsConstant';
import {Buffer} from 'buffer';
import {getPhotonInfo} from './events/photonEventUtils';
import {getErc20Info} from './events/erc20EventUtils';
import {getNftInfo} from './events/nftEventUtils';
import {getAmountPrefix} from './utils';
import {getNftSale} from './events/salePlainEventUtils';
import {abi as NFTCollectionAbi} from '../../../../../../remote/contractAbi/NFTCollection.json';
import {fixWalletAddress} from '../../../../../../utils';
import {DeviceEventEmitter} from 'react-native';

export const useTransferDataHooks = (
  gasPrice,
  hash,
  chainType,
  currentAddress,
  waiting,
) => {
  const initData = {
    from: '',
    to: '',
    amount: '',
    coinType: '',
    gasPrice: bigNumberParseUnits(gasPrice.toString(), 9),
    gasLimit: bigNumberParseUnits('0', 0),
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
  const [transactionTx, setTransactionTx] = useState();

  const getToAddressAmount = async (logs, abiName) => {
    if (abiName === 'erc20') {
      // coin相关
      return getErc20Info(logs, currentAddress);
    }
    if (abiName === 'metaMaster') {
      const nftInfo = await getNftInfo(logs, currentAddress);
      return nftInfo;
    }
    if (abiName === 'salePlain') {
      const nftInfo = await getNftSale(logs, currentAddress);
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
        };
        // contract
        // 得到是哪个合约
        const contractAddress = transferRes.to.toLowerCase();
        const spectrumContracts = contractsConstant.spectrum;
        let coinType; // 合约名字
        let abiName;
        if (spectrumContracts[contractAddress]) {
          coinType = spectrumContracts[contractAddress].symbol;
          abiName = spectrumContracts[contractAddress].abiName;
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
      setTransactionTx(transRes);
      resData = {
        ...transactData,
        gasPrice: transRes.gasPrice,
        gasLimit: transRes.gasLimit,
        from: transRes.from.toLowerCase(),
        to: transRes.to.toLowerCase(),
        blockNumber: transRes.blockNumber,
      };
      // 判断是否是自己的账号
      const isFrom =
        transRes.from.toLowerCase() ===
        fixWalletAddress(currentAddress).toLowerCase();
      // 判断 from,to 都不是合约才能显示remark
      const contractAddress = isFrom
        ? transRes.to.toLowerCase()
        : transRes.from.toLowerCase();
      const addressCode = await provider.getCode(contractAddress);
      // 主链 SMT
      const isMain = addressCode === '0x';
      if (isMain) {
        if (transRes.data) {
          resData = {
            ...resData,
            remark: Buffer.from(
              transRes.data.replace('0x', ''),
              'hex',
            ).toString(),
          };
        }
      } else {
        let parsedTrans;
        // from is a contract
        const spectrumContracts = contractsConstant.spectrum;
        if (spectrumContracts[contractAddress]) {
          if (
            contractAddress !== '0x242e0de2b118279d1479545a131a90a8f67a2512' // photon 跳过
          ) {
            // 本地合约中存在
            try {
              parsedTrans = getContract(
                financeConfig.chains.spectrum.rpcURL,
                contractAddress,
                spectrumContracts[contractAddress].abi,
              ).interface.parseTransaction(transRes);
            } catch (e) {
              console.log(contractAddress + ' contract: error', e);
            }
          }
        } else if (addressCode.startsWith('0x6080604052348015')) {
          // from is a nft collection contract
          try {
            parsedTrans = getContract(
              financeConfig.chains.spectrum.rpcURL,
              contractAddress,
              NFTCollectionAbi,
            ).interface.parseTransaction(transRes);
          } catch (e) {
            console.log('nft collection contract error', e);
          }
        }
        if (parsedTrans) {
          let str =
            'Function: ' +
            parsedTrans.signature +
            '\n' +
            'MethodID: ' +
            parsedTrans.sighash;
          parsedTrans.args.forEach((element, index) => {
            let ele;
            try {
              ele = hexZeroPad(element, 32);
            } catch (e) {
              ele = '0x' + Buffer.from(element).toString('hex');
            }
            str = str + `\n[${index}]: ` + ele;
          });
          resData = {
            ...resData,
            remark: str,
          };
        } else {
          resData = {
            ...resData,
            remark: '',
          };
        }
      }
      setTransactData(resData);
      resData = {
        ...resData,
        amount: bigNumberFormatUnits(transRes.value),
        amountPrefix: getAmountPrefix(transRes.to, currentAddress),
      };
      if (transRes.confirmations > 0) {
        isGetReceipt = true;
        resData = await getTransactionReceipt(resData, provider);
      }
      if (transRes.confirmations < 20) {
        provider.on(hash, async resListen => {
          DeviceEventEmitter.emit('transactionDB', {
            hash: resListen.transactionHash,
            blockHash: resListen.blockHash,
            blockNumber: resListen.blockNumber,
            confirmations: resListen.confirmations,
            status: resListen.status,
            gasUsed: resListen.gasUsed,
          });
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
  return {transactData, transactionTx};
};
