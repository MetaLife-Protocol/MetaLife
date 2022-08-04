import {
  bigNumberFormatUnits,
  createBigNumber,
  getEventNameID,
  hexString,
} from 'react-native-web3-wallet';
import {getAmountPrefix} from './utils';

export const Erc20NameID = {
  transfer: getEventNameID('Transfer(address,address,uint256)'),
  approval: getEventNameID('Approval(address,address,uint256)'),
};

export const getErc20Info = (logs, currentAddress) => {
  const approval = isCoinApproval(logs, currentAddress);
  if (approval) {
    return approval;
  }
  const transfer = isCoinTransfer(logs, currentAddress);
  if (transfer) {
    return transfer;
  }
};

const isCoinApproval = logs => {
  const isApproval = Erc20NameID.approval === logs[0].topics[0];
  let tokenAmount;
  if (isApproval) {
    // 对方地址
    // console.log('toAddress', hexString(topics[2]));
    // toAddress = hexString(topics[2]);
    // console.log('tokenAmount', createBigNumber(data));
    tokenAmount = bigNumberFormatUnits(createBigNumber(logs[0].data));
    return {
      amount: tokenAmount,
      amountPrefix: 'approval',
    };
  }
  return false;
};

const isCoinTransfer = (logs, currentAddress) => {
  const isTransfer = Erc20NameID.transfer === logs[0].topics[0];
  if (isTransfer) {
    // coin transfer
    // 对方地址
    const toAddress = hexString(logs[0].topics[2]);
    const tokenAmount = bigNumberFormatUnits(createBigNumber(logs[0].data));
    return {
      to: toAddress,
      amount: tokenAmount,
      amountPrefix: getAmountPrefix(toAddress, currentAddress),
    };
  }
  return false;
};
