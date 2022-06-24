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
  getBalance,
  getContractBalance,
  importKeystore,
  importMnemonic,
  importPrivateKey,
} from 'react-native-web3-wallet';
import {Buffer} from 'buffer';

/**
 *
 * @type {{chains: {}, contracts: {}, contractABIs: {NFTCollection: {}, erc20: [], erc720: []}}}
 */
export const financeConfig = {
  chains: {
    spectrum: {
      rpcURL: 'https://jsonapi1.smartmesh.io/',
      chainID: 20180430,
      explorerURL: 'https://spectrum.pub/',
      decmis: 18,
      symbol: 'SMT',
      contracts: {
        coin: [
          {
            address: '0xa4c9af589c07b7539e5fcc45975b995a45e3f379',
            decmis: 18,
            symbol: 'Mesh',
          },
          {
            address: '0xa27f8f580c01db0682ce185209ffb84121a2f711',
            decmis: 18,
            symbol: 'MLT',
          },
        ],
        dao: [
          {
            address: '0xa4c9af589c07b7539e5fcc45975b995a45e3f379',
            decmis: 18,
            symbol: 'Mesh',
          },
          {
            address: '0xa27f8f580c01db0682ce185209ffb84121a2f711',
            decmis: 18,
            symbol: 'MLT',
          },
        ],
        nft: [
          {
            address: '0xa4c9af589c07b7539e5fcc45975b995a45e3f379',
            decmis: 18,
            symbol: 'Mesh',
          },
          {
            address: '0xa27f8f580c01db0682ce185209ffb84121a2f711',
            decmis: 18,
            symbol: 'MLT',
          },
        ],
      },
    },
    ethereum: {
      rpcURL: 'https://mainnet.infura.io/v3/',
      chainID: 1,
      explorerURL: 'https://etherscan.io',
      decmis: 18,
      symbol: 'ETH',
    },
  },
  contracts: {
    spectrum: {
      Mesh: {
        address: '0xa4c9af589c07b7539e5fcc45975b995a45e3f379',
        decmis: 18,
        symbol: 'Mesh',
        abi: 'erc20',
      },
      MLT: {
        address: '0xa27f8f580c01db0682ce185209ffb84121a2f711',
        decmis: 18,
        symbol: 'MLT',
        abi: 'erc20',
      },
    },
  },
  contractABIs: {
    NFTCollection: [],
    erc20: [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
        ],
        name: 'allowance',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'transfer',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    erc720: [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'approved',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'bool',
            name: 'approved',
            type: 'bool',
          },
        ],
        name: 'ApprovalForAll',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'getApproved',
        outputs: [
          {
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
        ],
        name: 'isApprovedForAll',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
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
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'ownerOf',
        outputs: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: '_approved',
            type: 'bool',
          },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes4',
            name: 'interfaceId',
            type: 'bytes4',
          },
        ],
        name: 'supportsInterface',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
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
        inputs: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'tokenURI',
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
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  },
};

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
      cb && cb(res);
    })
    .catch(reason => console.warn(reason));
}

export function importAccountByKeystore(keystore, pw, cb) {
  importKeystore(keystore, pw, true)
    .then(res => {
      saveAccounts(res.keystore.address, res.keystore, (success, err) => {
        console.log('save', success, err);
      });
      cb(res);
    })
    .catch(reason => console.warn(reason));
}

export function importAccountByPrivateKey(privateKey, pw, cb) {
  importPrivateKey(privateKey, pw, true)
    .then(res => {
      saveAccounts(res.keystore.address, res.keystore, (success, err) => {
        console.log('save', success, err);
      });
      cb(res);
    })
    .catch(reason => console.warn(reason));
}

export function getWBalance(type, wAddr, cb) {
  getBalance(financeConfig.chains[type].rpcURL, wAddr)
    .then(value => cb && cb(bigNumberFormatUnits(value)))
    .catch(console.warn);
}

export function getWBalanceByContract(type, cType, wAddr) {
  getContractBalance(
    financeConfig.chains[type].rpcURL,
    financeConfig.contracts[type][cType].address,
    financeConfig.contractABIs[financeConfig.contracts[type][cType].abi],
    wAddr,
  );
}

function saveAccounts(address, keystore, cb) {
  let originKey = window.ssb.id;
  let signedMessage = getSignedSecretSession(originKey);
  retrieveWithSession(originKey, signedMessage)
    .then(accounts => {
      if (accounts === undefined || accounts === null) {
        accounts = {};
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

function getAccount(address, cb) {
  let originKey = window.ssb.id;
  let signedMessage = getSignedSecretSession(originKey);
  retrieveWithSession(originKey, signedMessage)
    .then(accounts => {
      if (accounts === undefined || accounts === null || accounts === {}) {
        cb(false, new Error('no accounts'));
      } else {
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

function deleteAccount(address, cb) {
  let originKey = window.ssb.id;
  let signedMessage = getSignedSecretSession(originKey);
  retrieveWithSession(originKey, signedMessage)
    .then(accounts => {
      if (accounts === undefined || accounts === null || accounts === {}) {
        cb(false, new Error('no accounts'));
      } else {
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
