import Realm from 'realm';
import Aes from 'react-native-aes-crypto';
import {Buffer} from 'buffer';
import {DeviceEventEmitter} from 'react-native';
import {
  bigNumberFormatUnits,
  getContract,
  getEventNameID,
  hexString,
  createBigNumber,
} from 'react-native-web3-wallet';
import {financeConfig} from './wallet/financeConfig';

export const TransactionRecordSchema = {
  name: 'TransactionRecord',
  primaryKey: 'transactionHash', // 定义主键后，无法创建同一主键的数据
  properties: {
    transactionHash: 'string',
    to: 'string?', // {type: 'string', default: 'xxxxx'} 的简写
    from: 'string?',
    contractAddress: 'string?',
    contractName: 'string?',
    contractSymbol: 'string?',
    value: 'string?',
    data: 'string?',
    gasUsed: 'decimal128?',
    gasLimit: 'decimal128?',
    gasPrice: 'decimal128?',
    method: 'string?',
    confirmations: 'decimal128?',
    blockHash: 'string?',
    blockNumber: 'decimal128?',
    timestamp: 'date',
    status: 'int',
  },
};

export const dbConfig = {
  schema: [TransactionRecordSchema],
  path: 'metalife.realm',
};

export function generateEncrptionKey() {
  Aes.sha512(window.ssb.id).then(aesKey => {
    const aesBuffer = Buffer.from(aesKey, 'hex');
    dbConfig.encryptionKey = aesBuffer;
  });
}

let dbEmitters = [];
/**
 * DeviceEventEmitter.emit('transactionDB', tx)
 * 根据通知后台更新数据库
 *
 * @export
 * @return {*}
 */
export function createUpdateDBEmitter() {
  if (dbEmitters.length > 0) {
    return;
  }

  let transactionEmitter = DeviceEventEmitter.addListener(
    'transactionDB',
    command => {
      let tx = {};
      if (command.hash) {
        tx.transactionHash = command.hash;
      }
      if (command.transactionHash) {
        tx.transactionHash = command.transactionHash;
      }
      if (command.status) {
        tx.status = command.status;
      }
      if (command.gasUsed) {
        tx.gasUsed = Realm.BSON.Decimal128.fromString(
          command.gasUsed.toString(),
        );
      }
      if (command.gasLimit) {
        tx.gasLimit = Realm.BSON.Decimal128.fromString(
          command.gasLimit.toString(),
        );
      }
      if (command.gasPrice) {
        tx.gasPrice = Realm.BSON.Decimal128.fromString(
          command.gasPrice.toString(),
        );
      }
      if (command.from) {
        tx.from = command.from;
      }
      if (command.to) {
        tx.to = command.to;
      }
      // if (command.log && command.log.length > 0) {
      //   if (command.log.length < 2) {
      //     if (
      //       command.log[0].topics[0] ===
      //       getEventNameID('Transfer(address,address,uint256)')
      //     ) {
      //       tx.to = hexString(command.log[0].topics[2]);
      //       tx.contractAddress = hexString(command.log[1].address);
      //       tx.value = createBigNumber(command.log[0].data).toString();
      //       tx.method = 'Coin_Transfer';
      //     }
      //   } else if (
      //     command.log[0].topics[0] ===
      //       getEventNameID('Approval(address,address,uint256)') &&
      //     command.log[1].topics[0] ===
      //       getEventNameID('Transfer(address,address,uint256)')
      //   ) {
      //     tx.to = hexString(command.log[1].topics[2]);
      //     tx.contractAddress = hexString(command.log[1].address);
      //     tx.value = createBigNumber(command.log[1].topics[3]).toString();
      //     tx.method = 'NFT_Transfer';
      //   } else if (
      //     command.log[0].topics[0] ===
      //       getEventNameID('Transfer(address,address,uint256)') &&
      //     command.log[1].topics[0] ===
      //       getEventNameID('Mint(uint256,address,address)')
      //   ) {
      //     tx.to = hexString(command.log[0].topics[2]);
      //     tx.contractAddress = hexString(command.log[0].address);
      //     tx.value = createBigNumber(command.log[0].topics[3]).toString();
      //     tx.method = 'Mint';
      //   } else if (
      //     command.log[0].topics[0] ===
      //       getEventNameID('OwnershipTransferred(address,address)') &&
      //     command.log[1].topics[0] ===
      //       getEventNameID('NewCollection(address,address)')
      //   ) {
      //     tx.to = hexString(command.log[1].topics[1]);
      //     tx.contractAddress = hexString(command.log[1].address);
      //     tx.value = hexString(command.logs[1].data);
      //     tx.method = 'CreateCollection';
      //   } else {
      //   }
      // }
      if (command.contractAddress) {
        tx.contractAddress = command.contractAddress;
      }
      if (command.contractName) {
        tx.contractName = command.contractName;
      }
      if (command.contractSymbol) {
        tx.contractSymbol = command.contractSymbol;
      }
      if (command.method) {
        tx.method = command.method;
      }
      if (command.value) {
        tx.value = command.value;
      }
      if (command.blockHash) {
        tx.blockHash = command.blockHash;
      }
      if (command.blockNumber) {
        tx.blockNumber = Realm.BSON.Decimal128.fromString(
          command.blockNumber.toString(),
        );
      }
      if (command.timestamp) {
        let date = new Date(command.timestamp * 1000);

        tx.timestamp = date;
      } else {
        tx.timestamp = new Date();
      }
      if (command.data) {
        tx.data = command.data;
      }
      if (command.confirmations) {
        tx.confirmations = Realm.BSON.Decimal128.fromString(
          command.confirmations.toString(),
        );
      }
      updateDB('TransactionRecord', tx);
    },
  );
  dbEmitters.push(transactionEmitter);
}

export function removeUpdateDBEmitter() {
  while (dbEmitters.length > 0) {
    dbEmitters.pop().remove();
  }
}

export function updateDB(schemaName, params) {
  return new Promise((fulfill, reject) => {
    Realm.open(dbConfig)
      .then(res => {
        res.write(() => {
          res.create(schemaName, params, true);
          fulfill(true);
        });
        res.close();
      })
      .catch(reject);
  });
}

export function createTransactionEventOn(
  walletAddress,
  chainType = 'spectrum',
) {
  if (chainType.toLowerCase() === 'spectrum') {
    let contractMesh = getContract(
      financeConfig.chains.spectrum.rpcURL,
      financeConfig.chains.spectrum.contracts.coin.Mesh.address,
      financeConfig.chains.spectrum.contracts.coin.Mesh.abi,
    );
    let filterToMesh = contractMesh.filters.Transfer(null, walletAddress);

    contractMesh.on(filterToMesh, (from, to, amount, event) => {
      console.log(bigNumberFormatUnits(amount));
      event.getBlock(event.blockNumber).then(block => {
        event.getTransaction(event.transactionHash).then(tx => {
          tx.contractAddress =
            financeConfig.chains.spectrum.contracts.coin.Mesh.address;
          tx.contractName = 'Mesh';
          tx.contractSymbol = 'Mesh';
          tx.timestamp = block.timestamp;
          tx.to = to;
          tx.value = amount.toString();
          tx.method = 'Coin_Transfer';
          DeviceEventEmitter.emit('transactionDB', tx);
          if (tx.confirmations < 20) {
            contractMesh.provider.on(event.transactionHash, res => {
              DeviceEventEmitter.emit('transactionDB', res);
              if (res.confirmations > 21) {
                contractMesh.provider.removeAllListeners(event.transactionHash);
              }
            });
          } else {
            event.getTransactionReceipt(event.transactionHash).then(txr => {
              DeviceEventEmitter.emit('transactionDB', txr);
            });
          }
        });
      });
    });

    let contractMLT = getContract(
      financeConfig.chains.spectrum.rpcURL,
      financeConfig.chains.spectrum.contracts.coin.MLT.address,
      financeConfig.chains.spectrum.contracts.coin.MLT.abi,
    );
    let filterToMLT = contractMLT.filters.Transfer(null, walletAddress);

    contractMLT.on(filterToMLT, (from, to, amount, event) => {
      console.log(bigNumberFormatUnits(amount));
      event.getBlock(event.blockNumber).then(block => {
        event.getTransaction(event.transactionHash).then(tx => {
          tx.contractAddress =
            financeConfig.chains.spectrum.contracts.coin.MLT.address;
          tx.contractName = 'MLT';
          tx.contractSymbol = 'MLT';
          tx.timestamp = block.timestamp;
          tx.to = to;
          tx.value = amount.toString();
          tx.method = 'Coin_Transfer';
          DeviceEventEmitter.emit('transactionDB', tx);
          if (tx.confirmations < 20) {
            contractMLT.provider.on(event.transactionHash, res => {
              DeviceEventEmitter.emit('transactionDB', res);
              if (res.confirmations > 21) {
                contractMLT.provider.removeAllListeners(event.transactionHash);
              }
            });
          } else {
            event.getTransactionReceipt(event.transactionHash).then(txr => {
              DeviceEventEmitter.emit('transactionDB', txr);
            });
          }
        });
      });
    });
  }
}

/*
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    Realm.open(dbConfig).then(realm => {
      //https://www.mongodb.com/docs/realm/realm-query-language/#std-label-rql
      const tasks = realm
        .objects('TransactionRecord')
        .filtered(`to = "${walletAddress}" && method = "${methodName}"`)
        .sorted('timestamp', true)
        .slice((page - 1) * limit, page * limit);
      // set state to the initial value of your realm objects
      setTasks([...tasks]);
      try {
        tasks.addListener(() => {
          // update state of tasks to the updated value
          setTasks([...tasks]);
        });
      } catch (error) {
        console.error(
          `Unable to update the tasks' state, an exception was thrown within the change listener: ${error}`,
        );
      }
      // cleanup function
      return () => {
        // Remember to remove the listener when you're done!
        tasks.removeAllListeners();
        // Call the close() method when done with a realm instance to avoid memory leaks.
        realm.close();
      };
    });
  }, []);
  return (
    <>
      {tasks.map(task => (
        <Text key={task.transactionHash}>{task.to}</Text>
      ))}
    </>
  );
};
*/
