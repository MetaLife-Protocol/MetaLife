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
  bigNumberParseUnits,
  createWallet,
  exportKeystore,
  exportMnemonicFromKeystore,
  exportPrivateKeyFromKeystore,
  getBalance,
  getContract,
  getContractBalance,
  getGasLimit,
  getGasPrice,
  getNonce,
  getProvider,
  getSignerContract,
  importKeystore,
  importMnemonic,
  importPrivateKey,
  sendTransaction,
  signTransaction,
  waitForContractTransaction,
  waitForTransaction,
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
      const keystoreObj = JSON.parse(res.keystore);
      saveAccounts(keystoreObj.address, keystoreObj, (success, err) => {
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
export const getTransferGasPrice = params => {
  const {type} = params;
  return getGasPrice(financeConfig.chains[type].rpcURL);
};
export const getTransferGasLimit = params => {
  const {type, fromAddress, toAddress, amount, remark} = params;
  const data = '0x' + Buffer.from(remark).toString('hex');
  return getGasLimit(
    financeConfig.chains[type].rpcURL,
    fromAddress,
    toAddress,
    amount,
    data,
  );
};

export const cionTransact = params => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        type,
        fromAddress,
        toAddress,
        amount,
        remark,
        password,
        gasLimit,
        gasPrice,
      } = params;
      const data = remark ? '0x' + Buffer.from(remark).toString('hex') : '';
      const nonce = await getNonce(
        financeConfig.chains[type].rpcURL,
        fromAddress,
      );
      // get keystore from user address
      getAccount(fromAddress, async (isSuccess, keystore) => {
        if (isSuccess) {
          try {
            const signedTx = await signTransaction(
              JSON.stringify(keystore),
              // password is user input
              password,
              nonce,
              gasLimit,
              gasPrice,
              toAddress,
              financeConfig.chains[type].chainID,
              amount,
              data,
            );
            const resTx = await sendTransaction(
              financeConfig.chains[type].rpcURL,
              signedTx,
            );
            // get resTx , this transaction is success send
            console.log('resTx', resTx);
            resolve({
              code: 'success',
              data: resTx,
            });
          } catch (e) {
            console.log('transaction error', e);
            if (e.message === 'invalid password') {
              resolve({
                code: 'fail',
                message: 'Wrong password',
              });
            } else {
              if (
                e.message.indexOf('(error=') !== -1 &&
                e.message.indexOf(', method=') !== -1
              ) {
                const errorMessage = e.message
                  .split('(error=')[1]
                  .split(', method=')[0];
                const body = JSON.parse(errorMessage).body;
                const errorMsg = JSON.parse(body);
                resolve({
                  code: 'fail',
                  message: errorMsg.error.message,
                });
              } else {
                resolve({
                  code: 'fail',
                  message: 'transaction error',
                });
              }
            }
          }
        } else {
          resolve({
            code: 'fail',
            message: 'address not exist',
          });
        }
      });
    } catch (e) {
      reject(e.message);
    }
  });
};

export const coinWaitTransaction = async (type, hash) => {
  try {
    const waitTransactionRes = await waitForTransaction(
      financeConfig.chains[type].rpcURL,
      hash,
    );
    return waitTransactionRes;
  } catch (e) {
    console.warn(e);
  }
};

export const getTransactionListenProvider = type => {
  return getProvider(financeConfig.chains[type].rpcURL);
};
export const coinContractTransfer = async params => {
  return new Promise(async (resolve, reject) => {
    const {
      type,
      cType,
      fromAddress,
      password,
      toAddress,
      amount,
      gasLimit,
      gasPrice,
    } = params;
    getAccount(fromAddress, async (isSuccess, keystore) => {
      if (isSuccess) {
        try {
          const contract = await getSignerContract(
            financeConfig.chains[type].rpcURL,
            financeConfig.chains[type].contracts.coin[cType].address,
            financeConfig.contractABIs[
              financeConfig.chains[type].contracts.coin[cType].abi
            ],
            JSON.stringify(keystore),
            password,
          );
          const nonce = await getNonce(
            financeConfig.chains[type].rpcURL,
            fromAddress,
          );
          const realAmount = bigNumberParseUnits(amount);
          let tx = {
            nonce: nonce,
            gasLimit: gasLimit,
            gasPrice: gasPrice,
          };
          const res = await contract.transfer(toAddress, realAmount, tx);
          resolve({
            code: 'success',
            data: res,
          });
        } catch (e) {
          console.warn(e);
          if (e.message === 'invalid password') {
            resolve({
              code: 'fail',
              message: 'Wrong password',
            });
          } else {
            resolve({
              code: 'fail',
              message: 'something is wrong',
            });
          }
        }
      } else {
        resolve({
          code: 'fail',
          message: 'account not exist',
        });
      }
    });
  });
};

export const getContractTransactionListenProvider = (type, cType) => {
  let contract = getContract(
    financeConfig.chains[type].rpcURL,
    financeConfig.chains[type].contracts.coin[cType].address,
    financeConfig.contractABIs[
      financeConfig.chains[type].contracts.coin[cType].abi
    ],
  );
  return contract.provider;
};

export async function getWalletRecord(params, cb) {
  const config = {
    timeout: 3000,
    headers: {
      'content-type': 'x-www-form-urlencoded',
    },
  };
  fetch('https://spectrum.pub/api/index.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: encodeURI('body=' + JSON.stringify(params)),
  })
    .then(value => value.json().then(e => cb(e)))
    .catch(console.warn);
}

function toUtf8(str) {
  var out, i, len, c;
  out = '';
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x0001 && c <= 0x007f) {
      out += str.charAt(i);
    } else if (c > 0x07ff) {
      out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    } else {
      out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    }
  }
  return out;
}
