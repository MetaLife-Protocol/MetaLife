/**
 * Created on 06 Jul 2022 by lonmee
 *
 */
import {abi as metaMasterAbi} from './wallet/metaMaster.json';
import {abi as NFTCollectionAbi} from './wallet/NFTCollection.json';
import {abi as ERC721EnumerableAbi} from './wallet/ERC721Enumerable.json';
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

/**
 * amount of collection
 * @returns {{result: Error}} bigNum
 */
async function getCollectionTotal() {
  const contract = getContract(
    network,
    collectionAddress,
    financeConfig.contractABIs.erc721,
  );
  const total = await contract.totalSupply();
  return total;
}

/**
 * NFT item info
 * @param wAddr option user wallet address for self or undefined for all
 * @returns {{result: Error}}
 */
async function getNFTInfos(wAddr = undefined) {
  const contract = getContract(network, collectionAddress, ERC721EnumerableAbi);
  var nftCount;
  if (wAddr === undefined) {
    nftCount = await contract.totalSupply();
  } else {
    nftCount = await contract.balanceOf(wAddr);
  }

  let token_idxs = [...Array(nftCount.toNumber()).keys()];

  let nftInfos = [];
  for await (const idx of token_idxs) {
    var token_id;
    if (wAddr === undefined) {
      token_id = (await contract.tokenByIndex(idx)).toNumber();
    } else {
      token_id = (await contract.tokenOfOwnerByIndex(wAddr, idx)).toNumber();
    }

    let token_uri = await contract.tokenURI(token_id);

    let nftInfo = {id: token_id, uri: token_uri};
    nftInfos.push(nftInfo);
  }
  return nftInfos;
}
