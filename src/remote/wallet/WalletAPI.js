/**
 * Created on 17 Jun 2022 by lonmee
 *
 */
import {
  bigNumberFormatUnits,
  createWallet,
  getBalance,
  getContractBalance,
  importMnemonic,
} from 'react-native-web3-wallet';

/**
 *
 * @type {{chains: {}, contracts: {NFTCollection: {}}}}
 */
export const financeConfig = {
  chains: {
    Spectrum: {
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
    Ethereum: {
      rpcURL: 'https://mainnet.infura.io/v3/',
      chainID: 1,
      explorerURL: 'https://etherscan.io',
      decmis: 18,
      symbol: 'ETH',
    },
  },
  contracts: {
    NFTCollection: {},
    erc20ABI: '[json]',
    erc720ABI: '[json]',
  },
};

export function createAccount(pw, cb) {
  createWallet(pw, "m/44'/60'/0'/0/0")
    .then(res => cb && cb(res))
    .catch(reason => console.warn(reason));
}

export function importAccountByMnemonic(mnemonic, pw) {
  importMnemonic(mnemonic, pw).then(console.log);
}

export function getWBalance(type, wAddr, cb) {
  getBalance(financeConfig.chains[type].rpcURL, wAddr)
    .then(value => cb && cb(bigNumberFormatUnits(value)))
    .catch(console.warn);
}

export function getWBalanceByContract(type, cType, wAddr) {
  console.log();
  // getContractBalance(financeConfig.chains[type].rpcURL, )
}
