import {
  bigNumberFormatUnits,
  createBigNumber,
  getEventNameID,
  hexString,
} from 'react-native-web3-wallet';
import {contractsConstant} from '../../../../../../remote/contractsConstant';
import {getAmountPrefix} from './utils';

/**
 * //ChannelWithdraw  erc20先执行Transfer 公链只有ChannelWithdraw
console.log('Transfer', getEventNameID('Transfer(address,address,uint256)'));
console.log(
  'ChannelWithdraw',
  getEventNameID('ChannelWithdraw(bytes32,address,uint256,address,uint256)'),
);

//CreateChannel
console.log(
  'ChannelOpenedAndDeposit',
  getEventNameID(
    'ChannelOpenedAndDeposit(address,address,address,uint64,uint256)',
  ),
);

//DepositChannel 公链只有ChannelNewDeposit erc20后执行Transfer
console.log(
  'ChannelNewDeposit',
  getEventNameID('ChannelNewDeposit(bytes32,address,uint256)'),
);
console.log('Transfer', getEventNameID('Transfer(address,address,uint256)'));

//合作结算关闭 erc20先执行Transfer 公链只有ChannelCooperativeSettled
console.log(
  'ChannelCooperativeSettled',
  getEventNameID('ChannelCooperativeSettled(bytes32,uint256,uint256)'),
);

//强制关闭
console.log(
  'ChannelClosed',
  getEventNameID('ChannelClosed(bytes32,address,bytes32,uint256)'),
);

//独立结算 erc20先执行Transfer 公链只有ChannelSettled
console.log(
  'ChannelSettled',
  getEventNameID('ChannelSettled(bytes32,uint256,uint256)'),
);
 */
export const PhotonEventNameID = {
  transfer: getEventNameID('Transfer(address,address,uint256)'),
  channelWithdraw: getEventNameID(
    'ChannelWithdraw(bytes32,address,uint256,address,uint256)',
  ),
  channelCreate: getEventNameID(
    'ChannelOpenedAndDeposit(address,address,address,uint64,uint256)',
  ),
  channelDeposit: getEventNameID('ChannelNewDeposit(bytes32,address,uint256)'),
  cooperativeSettle: getEventNameID(
    'ChannelCooperativeSettled(bytes32,uint256,uint256)',
  ),
  channelClose: getEventNameID(
    'ChannelClosed(bytes32,address,bytes32,uint256)',
  ),
  channelSettle: getEventNameID('ChannelSettled(bytes32,uint256,uint256)'),
};

export const getPhotonInfo = (logs, abiName, from, currentAddress) => {
  if (abiName === 'erc20-photon' || abiName === 'PhotonLayer2') {
    const withdraw = isPhotonChannelWithdraw(logs, from, currentAddress);
    console.log('withdraw', withdraw);
    if (withdraw) {
      return withdraw;
    }
    const create = isPhotonChannelCreate(logs, from, currentAddress);
    console.log('create', create);
    if (create) {
      return create;
    }
    const deposit = isPhotonChannelDeposit(logs, from, currentAddress);
    console.log('deposit', deposit);
    if (deposit) {
      return deposit;
    }
    const cooSettled = isPhotonChannelCooperativeSettled(
      logs,
      from,
      currentAddress,
    );
    console.log('cooSettled', cooSettled);
    if (cooSettled) {
      return cooSettled;
    }
    const close = isPhotonChannelClose(logs, from, currentAddress);
    console.log('close', close);
    if (close) {
      return close;
    }
    const settle = isPhotonChannelSettled(logs, from, currentAddress);
    console.log('settle', settle);
    if (settle) {
      return settle;
    }
  }
  return false;
};

const getContractCoinType = address => {
  const contractAddress = address.toLowerCase();
  const spectrumContracts = contractsConstant.spectrum;
  let coinType; // 合约名字
  for (const item in spectrumContracts) {
    if (item.toLowerCase() === contractAddress) {
      coinType = spectrumContracts[item].symbol;
      break;
    }
  }
  return coinType;
};

/**
   * 光子交易
   //ChannelWithdraw  erc20先执行Transfer 公链只有ChannelWithdraw
    console.log('Transfer', getEventNameID('Transfer(address,address,uint256)'));
    console.log(
      'ChannelWithdraw',
      getEventNameID('ChannelWithdraw(bytes32,address,uint256,address,uint256)'),
    );
   */

const isPhotonChannelWithdraw = (logs, from, currentAddress) => {
  if (logs.length === 1) {
    const channelWithdraw =
      PhotonEventNameID.channelWithdraw === logs[0].topics[0];
    if (channelWithdraw) {
      const toAddress = from;
      return {
        tip: 'photon channel withdraw',
        to: toAddress,
        coinType: 'SMT',
        amountPrefix: getAmountPrefix(toAddress, currentAddress),
      };
    }
  }
  if (logs.length === 2) {
    const transfer = PhotonEventNameID.transfer === logs[0].topics[0];
    const withdraw = PhotonEventNameID.channelWithdraw === logs[1].topics[0];
    if (transfer && withdraw) {
      // 合约名
      const coinType = getContractCoinType(hexString(logs[0].address));
      // 对方地址
      const toAddress = hexString(logs[0].topics[2]);
      const tokenAmount = bigNumberFormatUnits(createBigNumber(logs[0].data));
      return {
        tip: 'photon channel withdraw',
        to: toAddress,
        amount: tokenAmount,
        coinType,
        amountPrefix: getAmountPrefix(toAddress, currentAddress),
      };
    }
  }
  return false;
};
/**
   //CreateChannel 公链只有ChannelOpenedAndDeposit erc20后执行Transfer
      console.log(
        'ChannelOpenedAndDeposit',
        getEventNameID(
          'ChannelOpenedAndDeposit(address,address,address,uint64,uint256)',
        ),
      );
   */
const isPhotonChannelCreate = (logs, from, currentAddress) => {
  if (logs.length === 1) {
    const create = PhotonEventNameID.channelCreate === logs[0].topics[0];
    console.log('create channel', create);
    if (create) {
      const toAddress = from;
      return {
        tip: 'photon channel create',
        to: toAddress,
        coinType: 'SMT',
        amountPrefix: getAmountPrefix(toAddress, currentAddress),
      };
    }
  }
  if (logs.length === 2) {
    const create = PhotonEventNameID.channelCreate === logs[0].topics[0];
    const transfer = PhotonEventNameID.transfer === logs[1].topics[0];
    if (create && transfer) {
      const toAddress = hexString(logs[1].topics[2]);
      return {
        tip: 'photon channel create',
        to: toAddress,
        coinType: getContractCoinType(logs[1].address),
        amount: bigNumberFormatUnits(createBigNumber(logs[1].data)),
        amountPrefix: getAmountPrefix(toAddress, currentAddress),
      };
    }
  }
  return false;
};

/**
      //DepositChannel 公链只有ChannelNewDeposit erc20后执行Transfer
      console.log(
        'ChannelNewDeposit',
        getEventNameID('ChannelNewDeposit(bytes32,address,uint256)'),
      );
      console.log('Transfer', getEventNameID('Transfer(address,address,uint256)'));
     */
const isPhotonChannelDeposit = (logs, from, currentAddress) => {
  if (logs.length === 1) {
    const deposit = PhotonEventNameID.channelDeposit === logs[0].topics[0];
    console.log('deposit channel', deposit);
    if (deposit) {
      const toAddress = from;
      return {
        tip: 'photon channel deposit',
        to: toAddress,
        coinType: 'SMT',
        amountPrefix: getAmountPrefix(toAddress, currentAddress),
      };
    }
  }
  if (logs.length === 2) {
    const deposit = PhotonEventNameID.channelDeposit === logs[0].topics[0];
    const transfer = PhotonEventNameID.transfer === logs[1].topics[0];
    if (deposit && transfer) {
      const toAddress = hexString(logs[1].topics[2]);
      return {
        tip: 'photon channel deposit',
        to: toAddress,
        coinType: getContractCoinType(logs[1].address),
        amount: bigNumberFormatUnits(createBigNumber(logs[1].data)),
        amountPrefix: getAmountPrefix(toAddress, currentAddress),
      };
    }
  }
  return false;
};
/**
      //合作结算关闭 erc20先执行Transfer 公链只有ChannelCooperativeSettled
      console.log(
        'ChannelCooperativeSettled',
        getEventNameID('ChannelCooperativeSettled(bytes32,uint256,uint256)'),
      );
     */
const isPhotonChannelCooperativeSettled = (logs, from, currentAddress) => {
  if (logs.length === 1) {
    const cooperativeSettled =
      PhotonEventNameID.cooperativeSettle === logs[0].topics[0];
    console.log('cooperativeSettled channel', cooperativeSettled);
    if (cooperativeSettled) {
      const toAddress = from;
      return {
        tip: 'photon channel cooperative settled',
        to: toAddress,
        coinType: 'SMT',
        amountPrefix: getAmountPrefix(toAddress, currentAddress),
      };
    }
  }
  if (logs.length === 2) {
    const transfer = PhotonEventNameID.transfer === logs[0].topics[0];
    const deposit = PhotonEventNameID.cooperativeSettle === logs[1].topics[0];
    if (deposit && transfer) {
      const toAddress = hexString(logs[0].topics[2]);
      return {
        tip: 'photon channel cooperative settled',
        to: toAddress,
        coinType: getContractCoinType(logs[0].address),
        amount: bigNumberFormatUnits(createBigNumber(logs[0].data)),
        amountPrefix: getAmountPrefix(toAddress, currentAddress),
      };
    }
  }
  return false;
};
/**
      //强制关闭
      console.log(
        'ChannelClosed',
        getEventNameID('ChannelClosed(bytes32,address,bytes32,uint256)'),
      );
     */
const isPhotonChannelClose = (logs, from, currentAddress) => {
  const close = PhotonEventNameID.channelClose === logs[0].topics[0];
  console.log('close channel', close);
  if (close) {
    const toAddress = from;
    return {
      tip: 'photon channel closed',
      to: toAddress,
      amountPrefix: getAmountPrefix(toAddress, currentAddress),
    };
  }
  return false;
};
/**
      //独立结算 erc20先执行Transfer 公链只有ChannelSettled
      console.log(
        'ChannelSettled',
        getEventNameID('ChannelSettled(bytes32,uint256,uint256)'),
      );}
     */
const isPhotonChannelSettled = (logs, from, currentAddress) => {
  if (logs.length === 1) {
    const settle = PhotonEventNameID.channelSettle === logs[0].topics[0];
    console.log('settle channel', settle);
    if (settle) {
      const toAddress = from;
      return {
        tip: 'photon channel settled',
        to: toAddress,
        amountPrefix: getAmountPrefix(toAddress, currentAddress),
      };
    }
  }
  if (logs.length === 2) {
    const transfer = PhotonEventNameID.transfer === logs[0].topics[0];
    const settle = PhotonEventNameID.channelSettle === logs[1].topics[0];
    console.log('settle channel', settle);
    if (transfer && settle) {
      const toAddress = hexString(logs[0].topics[2]);
      return {
        tip: 'photon channel settled',
        to: toAddress,
        amountPrefix: getAmountPrefix(toAddress, currentAddress),
      };
    }
  }
  return false;
};
