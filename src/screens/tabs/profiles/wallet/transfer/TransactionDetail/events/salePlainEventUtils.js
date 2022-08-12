import {bigNumberFormatUnits, createBigNumber} from 'react-native-web3-wallet';
import {contractsConstant} from '../../../../../../../remote/contractsConstant';
import {NftEventNameID, SaleEventNameID} from './eventNameID';
import {getNftName} from '../utils';

export const getNftSale = async (logs, currentAddress) => {
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    if (log.topics[0] === SaleEventNameID.cancelSale) {
      return await cancelListingNft(logs, currentAddress);
    }
    if (log.topics[0] === SaleEventNameID.confirmSale) {
      return await listingNft(logs, currentAddress);
    }
  }
};

const listingNft = async (logs, currentAddress) => {
  let info = {
    amountPrefix: 'Cost',
  };
  if (logs[0].topics[0] === NftEventNameID.transfer) {
    const contractAddress = logs[0].address.toLowerCase();
    const spectrumContracts = contractsConstant.spectrum;
    let coinType = 'SMT';
    for (const item in spectrumContracts) {
      if (item.toLowerCase() === contractAddress) {
        coinType = spectrumContracts[item].symbol;
        break;
      }
    }
    info = {
      ...info,
      amount:
        bigNumberFormatUnits(createBigNumber(logs[0].data)) + coinType + ' Buy',
    };
  }
  if (logs[logs.length - 2].topics[0] === NftEventNameID.transfer) {
    const log = logs[logs.length - 2];
    info = {
      ...info,
      amount:
        info.amount +
        ' ' +
        (await getNftName(log.address)) +
        ' #' +
        createBigNumber(log.topics[3]).toNumber(),
    };
    return info;
  }
  return false;
};

const cancelListingNft = async (logs, currentAddress) => {
  let info = {
    amountPrefix: 'Cancel Listing',
  };
  if (logs[1].topics[0] === NftEventNameID.transfer) {
    info = {
      ...info,
      amount:
        (await getNftName(logs[1].address)) +
        ' #' +
        createBigNumber(logs[1].topics[3]),
    };
    return info;
  }

  return false;
};
