import {DeviceEventEmitter} from 'react-native';
import {
  bigNumberFormatUnits,
  bigNumberParseUnits,
  getContract,
} from 'react-native-web3-wallet';
import {financeConfig} from '../../../../../remote/wallet/financeConfig';
import Realm from 'realm';
import {dbConfig} from '../../../../../remote/realmDB';

const saveMainCoinTrans = (singTransRes, gasLimit, gasPrice) => {
  DeviceEventEmitter.emit('transactionDB', {
    ...singTransRes,
    gasLimit: gasLimit,
    gasPrice: gasPrice,
  });
};

const saveContractTrans = (
  type,
  cType,
  transRes,
  gasLimit,
  gasPrice,
  realAmount,
) => {
  return new Promise((resolve, reject) => {
    const contractAddress =
      financeConfig.chains[type].contracts.coin[cType].address;
    // 获取合约 name和symbol
    const baseContract = getContract(
      financeConfig.chains[type].rpcURL,
      contractAddress,
      [
        {
          inputs: [],
          name: 'symbol',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'name',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
    );
    baseContract
      .name()
      .then(name => {
        baseContract
          .symbol()
          .then(symbol => {
            const txs = {
              ...transRes,
              gasLimit: gasLimit,
              gasPrice: gasPrice,
              contractAddress,
              contractName: name,
              contractSymbol: symbol,
              value: realAmount,
            };
            console.log('transactionDB', txs);
            DeviceEventEmitter.emit('transactionDB', txs);
            resolve();
          })
          .catch(e => {
            console.log('symbol-error', e);
            reject(e);
          });
      })
      .catch(e => {
        console.log('name-error', e);
        reject(e);
      });
  });
};

const deleteByHashAndSaveNew = (hash, singTransRes, gasLimit, gasPrice) => {
  return new Promise((resolve, reject) => {
    // 删除之前的hash数据
    Realm.open(dbConfig)
      .then(realm => {
        let newObject;
        realm.write(() => {
          let hashObject = realm
            .objects('TransactionRecord')
            .filtered(`transactionHash = "${hash}"`);

          const preObject = hashObject[0];
          newObject = {
            ...singTransRes,
            gasLimit,
            gasPrice,
            value: bigNumberParseUnits(
              bigNumberFormatUnits(preObject.value.toString()),
            ),
            contractAddress: preObject.contractAddress,
            contractName: preObject.contractName,
            contractSymbol: preObject.contractSymbol,
          };
          realm.delete(hashObject);
          hashObject = null;
        });
        realm.close();
        DeviceEventEmitter.emit('transactionDB', newObject);
        // 保存新的数据
        resolve();
      })
      .catch(e => {
        console.log('realm.open-error', e);
        reject({
          reason: 'realm.open-error',
        });
      });
  });
};

export default {
  saveMainCoinTrans,
  saveContractTrans,
  deleteByHashAndSaveNew,
};
