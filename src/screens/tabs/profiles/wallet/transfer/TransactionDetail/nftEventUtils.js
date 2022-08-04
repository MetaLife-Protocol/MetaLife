import {
  createBigNumber,
  getContract,
  getEventNameID,
  hexString,
} from 'react-native-web3-wallet';
import {financeConfig} from '../../../../../../remote/wallet/financeConfig';
import {abi as NFTCollectionAbi} from '../../../../../../remote/contractAbi/NFTCollection.json';
import {getAmountPrefix} from './utils';

/**
   * //NFT Transfer
    console.log('Transfer', getEventNameID('Transfer(address,address,uint256)'));
    console.log('Approval', getEventNameID('Approval(address,address,uint256)'));

    //NFT Mint
    console.log('Mint', getEventNameID('Mint(uint256,address,address)'));
    console.log('Transfer', getEventNameID('Transfer(address,address,uint256)'));

    //Collection Create
    console.log(
      'OwnershipTransferred',
      getEventNameID('OwnershipTransferred(address,address)'),
    );
    console.log('NewCollection', getEventNameID('NewCollection(address,address)'));
   * 
   */
const NftEventNameID = {
  transfer: getEventNameID('Transfer(address,address,uint256)'),
  approval: getEventNameID('Approval(address,address,uint256)'),
  mint: getEventNameID('Mint(uint256,address,address)'),
  ownershipTransferred: getEventNameID('OwnershipTransferred(address,address)'),
  newCollection: getEventNameID('NewCollection(address,address)'),
};

export const getNftInfo = async (logs, currentAddress) => {
  // nft collection
  const createCollection = await isNftCreateCollection(logs, currentAddress);
  if (createCollection) {
    return createCollection;
  }
  const nftTransfer = await isNftTransfer(logs, currentAddress);
  if (nftTransfer) {
    return nftTransfer;
  }
  const nftMint = await isNftMint(logs, currentAddress);
  if (nftMint) {
    return nftMint;
  }
};

const getNftName = async address => {
  // console.log('nftName', address);
  const subcontract = getContract(
    financeConfig.chains.spectrum.rpcURL,
    address,
    NFTCollectionAbi,
  );
  const name = await subcontract.name();
  const symbol = await subcontract.symbol();
  if (symbol && name) {
    return address + '(' + symbol + ':' + name + ')';
  } else {
    return address + '(' + symbol + name + ')';
  }
};

const isNftCreateCollection = async (logs, currentAddress) => {
  const ownershipTransferred =
    NftEventNameID.ownershipTransferred === logs[0].topics[0];
  const newCollection = NftEventNameID.newCollection === logs[1].topics[0];

  if (ownershipTransferred && newCollection) {
    // 对方地址
    const toAddress = hexString(logs[1].topics[1]);
    const collectAddress = await getNftName(hexString(logs[1].data));
    const tokenAmount = collectAddress;
    return {
      to: toAddress,
      amount: tokenAmount,
      amountPrefix: getAmountPrefix(toAddress, currentAddress),
    };
  }
  return false;
};
const isNftTransfer = async (logs, currentAddress) => {
  const approval = NftEventNameID.approval === logs[0].topics[0];
  const transfer = NftEventNameID.transfer === logs[1].topics[0];

  if (transfer && approval) {
    // 对方地址
    const toAddress = hexString(logs[1].topics[2]);
    const collectAddress = await getNftName(logs[1].address);
    const tokenAmount =
      collectAddress + ' #' + createBigNumber(logs[1].topics[3]).toNumber();
    return {
      to: toAddress,
      amount: tokenAmount,
      amountPrefix: getAmountPrefix(toAddress, currentAddress),
    };
  }
  return false;
};
const isNftMint = async (logs, currentAddress) => {
  const transfer = NftEventNameID.transfer === logs[0].topics[0];
  const mint = NftEventNameID.mint === logs[1].topics[0];

  if (mint && transfer) {
    // 对方地址
    const toAddress = hexString(logs[0].topics[2]);
    const collectAddress = await getNftName(logs[0].address);
    const tokenAmount =
      collectAddress + ' #' + createBigNumber(logs[0].topics[3]).toNumber();
    return {
      to: toAddress,
      amount: tokenAmount,
      amountPrefix: getAmountPrefix(toAddress, currentAddress),
    };
  }
  return false;
};
