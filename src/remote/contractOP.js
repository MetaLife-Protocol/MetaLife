/**
 * Created on 06 Jul 2022 by lonmee
 *
 */
import {abi as metaMasterAbi} from './wallet/metaMaster.json';
import {abi as NFTCollectionAbi} from './wallet/NFTCollection.json';
import {financeConfig} from './wallet/financeConfig';
import {
  bigNumberFormatUnits,
  getContract,
  getSignerContract,
} from 'react-native-web3-wallet';

const network = financeConfig.chains.spectrum.rpcURL,
  // metaMaster contract
  contractAddress = '0x0dcc00b3f7c664aaa884c87a66f7a0ce80d9367c',
  // dev collection address
  devCollectionAddress = '0x221b9814d507bC912534A96C37a15356cc995C0E',
  // collection address
  collectionAddress = '';

export async function callAuto() {
  getNFTInfos(undefined, console.log);
}

export async function callOnce() {
  getCollectionInfo(console.log);
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
async function getCollectionInfo(cb) {
  const contract = getContract(network, devCollectionAddress, NFTCollectionAbi);
  const name = await contract.name();
  const symbol = await contract.symbol();
  const owner = await contract.owner();
  const address = contract.address;
  const metaInfo = await contract.metaInfo();
  const totalSupply = (await contract.totalSupply()).toNumber();
  const maxSupply = (await contract.MAX_SUPPLY()).toNumber();
  const royaltiesReceiver = await contract.royaltiesReceiver();
  const royaltiesPercentageInBips = (
    await contract.royaltiesPercentageInBips()
  ).toNumber();
  cb &&
    cb({
      name,
      symbol,
      owner,
      address,
      metaInfo,
      totalSupply,
      maxSupply,
      royaltiesReceiver,
      royaltiesPercentageInBips,
    });
}

async function getNFTInfo(cb) {
  const contract = getContract(
    network,
    devCollectionAddress,
    financeConfig.contractABIs.erc721,
  );
  const name = await contract.name();
  const symbol = await contract.symbol();
  // return {name, symbol};
  cb && cb({name, symbol});
}

/**
 * amount of collection
 * @returns {{result: Error}} bigNum
 */
export async function getNFTTotal() {
  const contract = getContract(
    network,
    devCollectionAddress,
    financeConfig.contractABIs.erc721,
  );
  const total = await contract.totalSupply();
  return total.toNumber();
}

/**
 * NFT item info
 * @param wAddr option user wallet address for self or undefined for all
 * @returns {{result: Error}}
 */
export async function getNFTInfos(wAddr = undefined, cb) {
  const contract = getContract(
    network,
    devCollectionAddress,
    // ERC721EnumerableAbi,
    NFTCollectionAbi,
  );
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

    let nftInfo = {
      id: token_id,
      uri: token_uri,
    };

    if (wAddr === undefined) {
      let ownerOf = await contract.ownerOf(token_id);
      nftInfo.ownerOf = ownerOf;
    }
    nftInfos.push(nftInfo);
  }
  // return nftInfos;
  cb && cb(nftInfos);
}
