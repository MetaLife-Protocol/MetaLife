/**
 * Created on 06 Jul 2022 by lonmee
 *
 */
import {abi as metaMasterAbi} from './wallet/metaMaster.json';
import {abi as NFTCollectionAbi} from './wallet/NFTCollectionx.json';
import {financeConfig} from './wallet/financeConfig';
import {
  bigNumberFormatUnits,
  getContract,
  getSignerContract,
} from 'react-native-web3-wallet';

const network = financeConfig.chains.spectrum.rpcURL,
  // metaMaster contract
  contractAddress = '0x0dcc00b3f7c664aaa884c87a66f7a0ce80d9367c',
  // collection address
  collectionAddress = '0x5e1b7bd5dbd7cc4c5983d13219ba541e0cdc9283';

export async function callAuto() {
  // console.log(getCollectionInfo());
}

export async function callOnce(cb) {
  const info = await getCollectionInfo();
  cb && cb(info);
}

async function getOwnedCollections(keystore, pw, walletAddress) {
  const signedContract = await getSignerContract(
    network,
    contractAddress,
    metaMasterAbi,
    keystore,
    pw,
  );
  const bigNum = await signedContract.userOwnedCollectionNum(walletAddress);
  return bigNumberFormatUnits(bigNum);
}

async function getOwnedItems(keystore, pw, walletAddress) {
  const signedContract = await getSignerContract(
    network,
    contractAddress,
    metaMasterAbi,
    keystore,
    pw,
  );
  const bigNum = await signedContract.userOwnedCollectionNum(walletAddress);
  return bigNumberFormatUnits(bigNum);
}

/**
 * get collection info via IPFS address
 * @returns {{result: Error}}
 */
async function getCollectionIPFSAddress() {
  const contract = getContract(network, collectionAddress, NFTCollectionAbi);
  console.log(contract);
  const info = await contract.metaInfo();
  return info;
}

async function getCollectionInfo() {
  const contract = getContract(
    network,
    collectionAddress,
    financeConfig.contractABIs.erc721,
  );
  console.log(contract);
  const name = await contract.name();
  const symbol = await contract.symbol();
  return {name, symbol};
}

async function getNFTIPFSAddress() {
  const contract = getContract(
    network,
    collectionAddress,
    financeConfig.contractABIs.erc721,
  );
  console.log(contract);
  const name = await contract.tokenURI();
  const symbol = await contract.symbol();
  return {name, symbol};
}
