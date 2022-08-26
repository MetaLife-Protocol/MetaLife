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
  getGasPrice,
  getProvider,
  getSignerContractWithWalletProvider,
  importKeystore,
  importMnemonic,
  importPrivateKey,
  waitForTransaction,
} from 'react-native-web3-wallet';
import {Buffer} from 'buffer';
import {financeConfig} from './financeConfig';
import {isMainCoin} from '../../utils/chainUtils';
import {fixWalletAddress} from '../../utils';

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
      cb && cb(value);
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
      cb && cb(value);
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
    } else {
      cb && cb(false);
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

export const getTransactionDetail = params => {
  const {
    walletSinger,
    inputAmount,
    tokenOption,
    address,
    remark,
    currentAccount,
  } = params;
  const amount = bigNumberParseUnits(inputAmount);
  const data = remark ? '0x' + Buffer.from(remark).toString('hex') : '';
  return new Promise((resolve, reject) => {
    walletSinger.provider
      .getGasPrice()
      .then(gasPriceRes => {
        if (isMainCoin(tokenOption.type, tokenOption.cType)) {
          let tx = {
            to: fixWalletAddress(address),
            data: data,
            from: fixWalletAddress(currentAccount.address),
            value: amount,
          };
          walletSinger.provider
            .estimateGas(tx)
            .then(gasLimitRes => {
              resolve({gasPriceRes, gasLimitRes, walletSinger});
            })
            .catch(e => {
              console.log('walletSinger.provider.estimateGas', e);
              reject('error: estimateGas');
            });
        } else {
          const contractSinger = getSignerContractWithWalletProvider(
            financeConfig.chains[currentAccount.type].contracts.coin[
              tokenOption.cType
            ].address,
            financeConfig.contractABIs[
              financeConfig.chains[currentAccount.type].contracts.coin[
                tokenOption.cType
              ].abi
            ],
            walletSinger,
          );
          contractSinger.estimateGas
            .transfer(fixWalletAddress(address), amount)
            .then(gasLimitRes => {
              resolve({gasPriceRes, gasLimitRes, walletSinger, contractSinger});
            })
            .catch(e => {
              console.log('contractSinger.estimateGas.transfer', e);
              reject('error: transfer');
            });
        }
      })
      .catch(e => {
        console.log('walletSinger.provider.getGasPrice', e);
        reject('error: getGasPrice');
      });
  });
};

export const confirmTransaction = params => {
  const {
    walletSinger,
    inputAmount,
    remark,
    currentAccount,
    tokenOption,
    gasLimit,
    gasPrice,
    address,
    contractSinger,
    nonceType = 'pending',
  } = params;
  const realAmount = bigNumberParseUnits(inputAmount);
  const data = remark ? '0x' + Buffer.from(remark).toString('hex') : '';
  return new Promise((resolve, reject) => {
    walletSinger.provider
      .getTransactionCount(currentAccount.address, nonceType)
      .then(nonce => {
        if (isMainCoin(tokenOption.type, tokenOption.cType)) {
          let tx = {
            nonce: nonce,
            gasLimit: gasLimit,
            gasPrice: gasPrice,
            to: fixWalletAddress(address),
            chainId: financeConfig.chains[currentAccount.type].chainID,
            value: realAmount,
            data: data,
          };
          walletSinger
            .signTransaction(tx)
            .then(res => {
              walletSinger.provider
                .sendTransaction(res)
                .then(singTransRes => {
                  resolve(singTransRes);
                })
                .catch(e => {
                  console.log('walletSinger.provider.sendTransaction', e);
                  reject(e);
                });
            })
            .catch(e => {
              console.log('walletSinger.signTransaction', e);
              reject('error: signTransaction');
            });
        } else {
          let tx = {
            nonce: nonce,
            gasLimit: gasLimit,
            gasPrice: gasPrice,
          };

          contractSinger
            .transfer(fixWalletAddress(address), realAmount, tx)
            .then(res => {
              resolve(res);
            })
            .catch(e => {
              console.log('contractSinger.transfer', e);
              reject('error: transfer');
            });
        }
      })
      .catch(e => {
        console.log('walletSinger.provider.getTransactionCount', e);
        reject('error: getTransactionCount');
      });
  });
};
