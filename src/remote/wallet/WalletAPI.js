/**
 * Created on 17 Jun 2022 by lonmee
 *
 */
import {
  generateSecretSession,
  storeWithSession,
  retrieveWithSession,
  removeWithSession,
} from 'react-native-metalife-storage';
import {
  bigNumberFormatUnits,
  createWallet,
  exportKeystore,
  exportMnemonicFromKeystore,
  exportPrivateKeyFromKeystore,
  getBalance,
  getContractBalance,
  getGasLimit,
  getGasPrice,
  getNonce,
  importKeystore,
  importMnemonic,
  importPrivateKey,
  signTransaction,
} from 'react-native-web3-wallet';
import {Buffer} from 'buffer';
import {financeConfig} from './financeConfig';

/**
 * 0 BTC 60  ETH
 * @param pw
 * @param cb
 * @param type
 */
export function createAccount(pw, type, cb) {
  const code = type === 'spectrum' || 'ethereum' ? "60'" : "0'";
  createWallet(pw, `m/44'/${code}/0'/0/0`)
    .then(res => {
      saveAccounts(res.keystore.address, res.keystore, (success, err) => {
        console.log('save', success, err);
      });
      cb(res);
    })
    .catch(reason => console.warn(reason));
}

export function importAccountByMnemonic(mnemonic, pw, type, cb) {
  const code = type === 'spectrum' || 'ethereum' ? "60'" : "0'";
  importMnemonic(mnemonic, pw, `m/44'/${code}/0'/0/0`, true)
    .then(res => {
      saveAccounts(res.keystore.address, res.keystore, (success, err) => {
        console.log('save', success, err);
      });
      cb && cb(true, res);
    })
    .catch(reason => {
      cb && cb(false);
      console.warn(reason);
    });
}

export function importAccountByKeystore(keystore, pw, cb) {
  importKeystore(keystore, pw, true)
    .then(res => {
      saveAccounts(res.keystore.address, res.keystore, (success, err) => {
        console.log('save', success, err);
      });
      cb && cb(true, res);
    })
    .catch(reason => {
      cb && cb(false);
      console.warn(reason);
    });
}

export function importAccountByPrivateKey(privateKey, pw, cb) {
  importPrivateKey(privateKey, pw, true)
    .then(res => {
      saveAccounts(res.keystore.address, res.keystore, (success, err) => {
        console.log('save', success, err);
      });
      cb && cb(true, res);
    })
    .catch(reason => {
      cb && cb(false);
      console.warn(reason);
    });
}

/**
 * smt token
 * @param type
 * @param wAddr
 * @param cb
 */
export function getWBalance(type, wAddr, cb) {
  getBalance(financeConfig.chains[type].rpcURL, wAddr)
    .then(value => {
      cb && cb(bigNumberFormatUnits(value));
    })
    .catch(console.warn);
}

/**
 * by contract
 * @param type
 * @param cType contract type
 * @param wAddr
 */
export function getWBalanceByContract(type, cType, wAddr, cb) {
  getContractBalance(
    financeConfig.chains[type].rpcURL,
    financeConfig.contracts[type][cType].address,
    financeConfig.contractABIs[financeConfig.contracts[type][cType].abi],
    wAddr,
  )
    .then(value => {
      cb &&
        cb(
          bigNumberFormatUnits(
            value,
            financeConfig.contracts[type][cType].decmis,
          ),
        );
    })
    .catch(console.warn);
}

function saveAccounts(address, keystore, cb) {
  let originKey = window.ssb.id;
  let signedMessage = getSignedSecretSession(originKey);
  retrieveWithSession(originKey, signedMessage)
    .then(res => {
      let accounts;
      if (res === undefined || res === null) {
        accounts = {};
      } else {
        accounts = JSON.parse(res);
      }
      accounts[address] = keystore;

      storeWithSession(originKey, signedMessage, JSON.stringify(accounts))
        .then(() => {
          cb(true, null);
        })
        .catch(err => {
          cb(false, err);
        });
    })
    .catch(err => {
      cb(false, err);
    });
}

export function getAccount(address, cb) {
  let originKey = window.ssb.id;
  let signedMessage = getSignedSecretSession(originKey);
  retrieveWithSession(originKey, signedMessage)
    .then(res => {
      if (res === undefined || res === null || res === '{}') {
        cb(false, new Error('no accounts'));
      } else {
        let accounts = JSON.parse(res);
        if (accounts[address] === undefined || accounts[address] === null) {
          cb(false, new Error('no account'));
        } else {
          cb(true, accounts[address]);
        }
      }
    })
    .catch(err => {
      cb(false, err);
    });
}

/**
 * get keystore first to be sure pw enabled
 * @param address
 * @param cb
 */
function deleteAccount(address, cb) {
  let originKey = window.ssb.id;
  let signedMessage = getSignedSecretSession(originKey);
  retrieveWithSession(originKey, signedMessage)
    .then(res => {
      if (res === undefined || res === null || res === '{}') {
        cb(false, new Error('no accounts'));
      } else {
        let accounts = JSON.parse(res);
        if (accounts[address] === undefined || accounts[address] === null) {
          cb(false, new Error('no account'));
        } else {
          delete accounts[address];

          storeWithSession(originKey, signedMessage, JSON.stringify(accounts))
            .then(() => {
              cb(true, null);
            })
            .catch(err => {
              cb(false, err);
            });
        }
      }
    })
    .catch(err => {
      cb(false, err);
    });
}

function clearAccounts(cb) {
  let originKey = window.ssb.id;
  let signedMessage = getSignedSecretSession(originKey);
  removeWithSession(originKey, signedMessage)
    .then(() => {
      cb(true, null);
    })
    .catch(err => {
      cb(false, err);
    });
}

export function getSignedSecretSession(originKey) {
  const nacl = require('tweetnacl');

  let secretSession = generateSecretSession(originKey);
  let myPrivateKey = Buffer.from(
    '63683e471c44d0d6f99b07bb02312a6f89a0980881e59b89999ead12d27e2f23',
    'hex',
  );

  let theirPublicKey = Buffer.from(
    '01275dbe65d2784c50bf886ef6a780132fe07b10c73d4328c5d8d930bce3706b',
    'hex',
  );

  let sharedA = nacl.box.before(theirPublicKey, myPrivateKey);

  let nonce = Buffer.from(
    '75b3cb132606803083d6f989318db67b329094af6143a185',
    'hex',
  );

  let signedMessage = nacl.box.after(
    Buffer.from(secretSession),
    nonce,
    sharedA,
  );
  return signedMessage;
}

export function exportAccountKeystore(address, pw, cb) {
  getAccount(address, (isExit, keystore) => {
    if (isExit) {
      exportKeystore(JSON.stringify(keystore), pw)
        .then(res => cb && cb(true, res))
        .catch(error => {
          cb && cb(false);
          console.warn(error);
        });
    }
  });
}

export function exportAccountPrivateKey(address, pw, cb) {
  getAccount(address, (isExit, keystore) => {
    if (isExit) {
      exportPrivateKeyFromKeystore(JSON.stringify(keystore), pw)
        .then(res => cb && cb(true, res))
        .catch(error => {
          console.warn(error);
          cb && cb(false);
        });
    }
  });
}

export function deleteWalletAccount(address, pw, cb) {
  getAccount(address, (isExit, keystore) => {
    if (isExit) {
      exportKeystore(JSON.stringify(keystore), pw)
        .then(res => {
          deleteAccount(address, cb);
        })
        .catch(error => {
          cb && cb(false);
          console.warn(error);
        });
    }
  });
}

export function exportAccountMnemonic(address, pw, cb) {
  getAccount(address, (isExit, keystore) => {
    if (isExit) {
      exportMnemonicFromKeystore(JSON.stringify(keystore), pw)
        .then(res => {
          cb && cb(true, res);
        })
        .catch(error => {
          cb && cb(false);
          console.warn(error);
        });
    } else {
      cb && cb(false);
    }
  });
}

export async function getGas(params) {
  const {type, fromAddress, toAddress, amount, remark} = params;
  // getGasPrice('https://jsonapi1.smartmesh.io/')
  //   .then(gasPrice => {
  //     console.log('gasPrice', gasPrice.toString());
  //     getGasLimit(
  //       'https://jsonapi1.smartmesh.io/',
  //       '0xc978beb3b6be2e96c527a025a3f023045cca1fa9',
  //       '0x6025B091C6AB619F8e2F75170EB69dc57040dc6e',
  //       '0.02',
  //       '',
  //     )
  //       .then(gasLimit => {
  //         console.log('gasLimit', gasLimit.toString());
  //         console.log('gas', bigNumberFormatUnits(gasPrice.mul(gasLimit)));

  //         getNonce(
  //           'https://jsonapi1.smartmesh.io/',
  //           '0xc978beb3b6be2e96c527a025a3f023045cca1fa9',
  //         )
  //           .then(nonce => {
  //             console.log('nonce', nonce);
  //             signTransaction(
  //               JSON.stringify(keystore),
  //               'qwerty',
  //               nonce,
  //               gasLimit,
  //               gasPrice,
  //               '0x8b4b70cbfa3ed36a4fc0f245531530462686e69f',
  //               SMT_chainId,
  //               '0.1',
  //               '',
  //             )
  //               .then(signedTx => {
  //                 console.log('signedTx', signedTx);
  //                 sendTransaction('https://jsonapi1.smartmesh.io/', signedTx)
  //                   .then(resTx => {
  //                     console.log(resTx);
  //                     //{"chainId": 20180430, "confirmations": 0, "data": "0x", "from": "0xC978bEb3B6be2E96c527A025a3f023045CCA1Fa9", "gasLimit": {"hex": "0x5208", "type": "BigNumber"}, "gasPrice": {"hex": "0x0430e23400", "type": "BigNumber"}, "hash": "0x58b1f8e1860979dc4335c6fd7e293de9dd69909de13694d5e4454f799d9c33d9", "nonce": 11, "r": "0xb3d04f71d2486ee7e33502e71d0a28126849dec2904355ca62bc9f6adbfbfc0a", "s": "0x4f027af1ce5292d87d1ba12f4f4df4ea733fba10e0bf43b369cd69d8a35a1d58", "to": "0x8B4B70CBfA3eD36A4Fc0f245531530462686e69f", "type": null, "v": 40360895, "value": {"hex": "0x016345785d8a0000", "type": "BigNumber"}, "wait": [Function anonymous]}
  //                     waitForTransaction(
  //                       'https://jsonapi1.smartmesh.io/',
  //                       resTx.hash,
  //                     )
  //                       .then(res => {
  //                         //{"blockHash": "0x85550a41901ad653e4725e00888a3f20948d5223224cf09ddd5bc5e0558dcb12", "blockNumber": 9297953, "byzantium": true, "confirmations": 1, "contractAddress": null, "cumulativeGasUsed": {"hex": "0x5208", "type": "BigNumber"}, "from": "0xC978bEb3B6be2E96c527A025a3f023045CCA1Fa9", "gasUsed": {"hex": "0x5208", "type": "BigNumber"}, "logs": [], "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "status": 1, "to": "0x8B4B70CBfA3eD36A4Fc0f245531530462686e69f", "transactionHash": "0x58b1f8e1860979dc4335c6fd7e293de9dd69909de13694d5e4454f799d9c33d9", "transactionIndex": 1, "type": 0}
  //                         console.log(res);
  //                       })
  //                       .catch(err => {
  //                         console.log(err);
  //                       });
  //                   })
  //                   .catch(err => {
  //                     console.log(err);
  //                   });
  //               })
  //               .catch(err => {
  //                 console.log(err);
  //               });
  //           })
  //           .catch(err => {
  //             console.log(err);
  //           });
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  try {
    const gasPrice = await getGasPrice(financeConfig.chains[type].rpcURL);
    // TODO: remark参数只能传空字符串，其他都报错
    const gasLimit = await getGasLimit(
      financeConfig.chains[type].rpcURL,
      fromAddress,
      toAddress,
      amount,
      remark,
    );
    console.log('gasLimit', gasLimit.toString());
    console.log('gas', bigNumberFormatUnits(gasPrice.mul(gasLimit)));

    const nonce = await getNonce(
      financeConfig.chains[type].rpcURL,
      fromAddress,
    );
    console.log('nonce', nonce.toString());
    signTransaction();
  } catch (e) {
    console.error('wallet transaction', e);
  }
}
