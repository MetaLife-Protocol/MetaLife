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
  importKeystore,
  importMnemonic,
  importPrivateKey,
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
      cb && cb(bigNumberFormatUnits(value));
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
    }
  });
}
