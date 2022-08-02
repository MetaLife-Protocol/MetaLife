import {useEffect, useState} from 'react';
import {
  bigNumberFormatUnits,
  bigNumberParseUnits,
  createBigNumber,
  getContract,
  getEventNameID,
  hexString,
} from 'react-native-web3-wallet';
import {financeConfig} from '../../../../../../remote/wallet/financeConfig';
import {getTransactionListenProvider} from '../../../../../../remote/wallet/WalletAPI';
import {contractsConstant} from '../../../../../../remote/contractsConstant';
import {abi as NFTCollectionAbi} from '../../../../../../remote/contractAbi/NFTCollection.json';
import {Buffer} from 'buffer';

export const useTransferDataHooks = (gasPrice, hash, chainType) => {
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
  };
  const [transactData, setTransactData] = useState(initData);

  const getNftName = async address => {
    // console.log('nftName', address);
    const subcontract = getContract(
      financeConfig.chains.spectrum.rpcURL,
      address,
      NFTCollectionAbi,
    );
    const name = await subcontract.name();
    const symbol = await subcontract.symbol();
    // console.log('name+symbol', symbol && name, name, symbol);
    if (symbol && name) {
      // console.log('name:symbol', symbol && name, name, symbol);
      return address + '(' + symbol + ':' + name + ')';
    } else {
      return address + '(' + symbol + name + ')';
    }
  };

  const isCoinTransfer = (topics, data) => {
    const isTransfer =
      getEventNameID('Transfer(address,address,uint256)') === topics[0];
    // console.log('isTransfer', isTransfer);
    let toAddress;
    let tokenAmount;
    if (isTransfer) {
      // coin transfer
      // 对方地址
      // console.log('toAddress', hexString(topics[2]));
      toAddress = hexString(topics[2]);
      // console.log('tokenAmount', createBigNumber(data));
      tokenAmount = bigNumberFormatUnits(createBigNumber(data));
      return {
        toAddress,
        tokenAmount,
      };
    }
    return false;
  };

  /**
   * //NFT Transfer
    console.log('Transfer', getEventNameID('Transfer(address,address,uint256)'));
    console.log('Approval', getEventNameID('Approval(address,address,uint256)'));

    //NFT Mint
    console.log('Mint', getEventNameID('Mint(uint256,address,address)'));
    console.log('Transfer', getEventNameID('Transfer(address,address,uint256)'));

    //Collection Create
    console.log(
      'OwnershipTransferred',
      getEventNameID('OwnershipTransferred(address,address)'),
    );
    console.log('NewCollection', getEventNameID('NewCollection(address,address)'));
   * 
   */

  const isNftCreateCollection = async logs => {
    const ownershipTransferred =
      getEventNameID('OwnershipTransferred(address,address)') ===
      logs[0].topics[0];
    const newCollection =
      getEventNameID('NewCollection(address,address)') === logs[1].topics[0];

    if (ownershipTransferred && newCollection) {
      // 对方地址
      const toAddress = hexString(logs[1].topics[1]);
      const collectAddress = await getNftName(hexString(logs[1].data));
      const tokenAmount = collectAddress;
      return {
        toAddress,
        tokenAmount,
      };
    }
    return false;
  };
  const isNftTransfer = async logs => {
    const approval =
      getEventNameID('Approval(address,address,uint256)') === logs[0].topics[0];
    const transfer =
      getEventNameID('Transfer(address,address,uint256)') === logs[1].topics[0];

    if (transfer && approval) {
      // 对方地址
      const toAddress = hexString(logs[1].topics[2]);
      const collectAddress = await getNftName(logs[1].address);
      const tokenAmount =
        collectAddress + ' #' + createBigNumber(logs[1].topics[3]).toNumber();
      return {
        toAddress,
        tokenAmount,
      };
    }
    return false;
  };
  const isNftMint = async logs => {
    const transfer =
      getEventNameID('Transfer(address,address,uint256)') === logs[0].topics[0];
    const mint =
      getEventNameID('Mint(uint256,address,address)') === logs[1].topics[0];

    if (mint && transfer) {
      // 对方地址
      const toAddress = hexString(logs[0].topics[2]);
      const collectAddress = await getNftName(logs[0].address);
      const tokenAmount =
        collectAddress + ' #' + createBigNumber(logs[0].topics[3]).toNumber();
      return {
        toAddress,
        tokenAmount,
      };
    }
    return false;
  };

  const getToAddressAmount = async (logs, abiName) => {
    if (logs.length === 1) {
      if (abiName === 'erc20') {
        // coin相关
        const transfer = isCoinTransfer(logs[0].topics, logs[0].data);
        if (transfer) {
          return transfer;
        }
      }
    }
    if (logs.length === 2) {
      if (abiName === 'metaMaster') {
        // nft collection
        const createCollection = await isNftCreateCollection(logs);
        if (createCollection) {
          return createCollection;
        }
        const nftTransfer = await isNftTransfer(logs);
        if (nftTransfer) {
          return nftTransfer;
        }
        const nftMint = await isNftMint(logs);
        if (nftMint) {
          return nftMint;
        }
      }
    }
    return false;
  };

  const getTransactionReceipt = async (resData, provider) => {
    try {
      const transferRes = await provider.getTransactionReceipt(hash);
      console.log('getTransactionReceipt', transferRes);
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
          to: transferRes.to,
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
          if (item === contractAddress) {
            coinType = spectrumContracts[item].symbol;
            abiName = spectrumContracts[item].abiName;
            break;
          }
        }

        console.log('coinType', coinType);
        // console.log('abiName', abiName);
        // 获取是什么方法
        // console.log('topic', logs);
        // const topic = logs[0].topics;
        const addressObj = await getToAddressAmount(logs, abiName);
        if (addressObj) {
          resData = {
            ...resData,
            to: addressObj.toAddress,
            amount: addressObj.tokenAmount,
          };
        }
        resData = {
          ...resData,
          isContract: true,
          coinType,
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
      console.log('transferData', transRes);
      resData = {
        ...transactData,
        from: transRes.from,
        to: transRes.to,
        blockNumber: transRes.blockNumber,
        amount: bigNumberFormatUnits(transRes.value),
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
      // setTransactData(resData);

      // console.log('isGetReceipt', isGetReceipt);
      if (transRes.confirmations > 0) {
        isGetReceipt = true;
        resData = await getTransactionReceipt(resData, provider);
      }
      if (transRes.confirmations < 20) {
        provider.on(hash, async resListen => {
          console.log('listen', resListen);
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
