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
  getProvider,
  getSignerContract,
  waitForTransaction,
} from 'react-native-web3-wallet';
import {
  coinWaitTransaction,
  getTransactionListenProvider,
} from './wallet/WalletAPI';
import {re} from '@babel/core/lib/vendor/import-meta-resolve';
import {fixWalletAddress} from '../utils';

const network = financeConfig.chains.spectrum.rpcURL,
  // metaMaster contract
  contractAddress = '0x0dcc00b3f7c664aaa884c87a66f7a0ce80d9367c',
  // dev collection address
  devCollectionAddress = '0x221b9814d507bC912534A96C37a15356cc995C0E',
  // collection address
  collectionAddress = '0xf0fa86596F770E66d013f19E90C97A5d09122106',
  metaMasterAddress = '0x91c025098a9364662c116a058ac816feaad8e19e',
  salePlainAddress = '0x45ed21984f7b067361b888e1b60f936467b3a6a2',
  saleAuction = '0xbab389d9f0898cd2f137d48742813110ecbbbfbc';

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
export async function getCollectionInfo(cb, collAddress = collectionAddress) {
  const contract = getContract(network, collAddress, NFTCollectionAbi);

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

async function getNFTInfo(address, cb) {
  const contract = getContract(
    network,
    address,
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
    collectionAddress,
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
export async function getNFTInfos(
  wAddr = undefined,
  cb,
  page = 0,
  limit = 0,
  collectAddress = collectionAddress,
) {
  const contract = getContract(
    network,
    collectAddress,
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

  if (limit === 0) {
    limit = token_idxs.length;
  }
  let lastPage = Math.ceil(token_idxs / limit);
  if (page >= 0 && page < lastPage) {
    token_idxs = token_idxs.slice(page * limit, page * limit + limit);
  }
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
      collectionAddress: collectionAddress,
      uri: token_uri,
    };

    if (wAddr === undefined) {
      let ownerOf = await contract.ownerOf(token_id);
      nftInfo.ownerOf = ownerOf;
    }
    cb && cb(nftInfo);
    nftInfos.push(nftInfo);
  }
  return nftInfos;
}

export async function getMyNFTCollectionInfos(wAddr, cb, page = 0, limit = 0) {
  const contract = getContract(
    network,
    metaMasterAddress,
    // ERC721EnumerableAbi,
    metaMasterAbi,
  );
  var nftCount;
  try {
    nftCount = await contract.userOwnedCollectionNum(wAddr);
    // const s = await contract.collectionOwner(collectionAddress);
    // console.log('aaaaaaa', s);
  } catch (e) {
    console.log('nnnnnwwwwwwwwwwn', e);
  }

  console.log('nnnnnn', nftCount);
  let token_idxs = [...Array(nftCount.toNumber()).keys()];

  if (limit === 0) {
    limit = token_idxs.length;
  }
  let lastPage = Math.ceil(token_idxs / limit);
  if (page >= 0 && page < lastPage) {
    token_idxs = token_idxs.slice(page * limit, page * limit + limit);
  }
  let collectionInfos = [];

  for await (const idx of token_idxs) {
    var collection_address;

    collection_address = await contract.userOwnedCollections(wAddr, idx);

    const subcontract = getContract(
      network,
      collection_address,
      NFTCollectionAbi,
    );
    const name = await subcontract.name();
    const symbol = await subcontract.symbol();
    const metaInfo = await subcontract.metaInfo();
    let collectionInfo = {
      name: name,
      symbol: symbol,
      uri: metaInfo,
      address: collection_address,
      type: 'Collection',
    };
    cb && cb(collectionInfo);
    collectionInfos.push(collectionInfo);
  }
  return collectionInfos;
  // cb && cb(nftInfos);
}

export async function texthash() {
  getProvider(network)
    .getTransaction(
      '0x12f8745b8c3e9b392197571c425536ccee705c6c4db1c553c02232cd76a195a9',
    )
    .then(data => {
      console.log('ddddddsssfssfs', data);
    })
    .catch(err => {
      console.log('ereeee', err);
    });
  getProvider(network)
    .getTransactionReceipt(
      '0x12f8745b8c3e9b392197571c425536ccee705c6c4db1c553c02232cd76a195a9',
    )
    .then(data => {
      console.log('dddddd', data);
    })
    .catch(err => {
      console.log('ereeee', err);
    });
}

export async function getCreateCollection(
  type,
  keystore,
  password,
  name,
  symbol,
  baseURI, //ipfsId
  maxNum,
  logo,
  address,
  ratio = 250,
  cb,
  er,
) {
  const contract = await getSignerContract(
    financeConfig.chains[type].rpcURL,
    // network,
    metaMasterAddress,
    metaMasterAbi,
    JSON.stringify(keystore),
    password,
  );
  // console.log('cccccccc', contract);

  const result = contract
    .createCollection(name, symbol, baseURI, maxNum, logo, address, ratio)
    .then(async res => {
      // console.log('aaaaaa', res);
      let filterTo = contract.filters.NewCollection('0x' + address);
      contract.once(filterTo, (sender, address, event) => {
        // console.log('contract', address);
        cb && cb(address);
      });

      let data = await coinWaitTransaction(type, res.hash);
      // console.log('ddddd', data, address);

      // let provider = getTransactionListenProvider(type);
      // provider.on(res.hash, resListen => {
      //   if (resListen.confirmations > 19) {
      //     provider.removeAllListeners(res.hash);
      //   }
      // });
      //
    })
    .catch(error => {
      // console.log('erererererereer', error);
      const errorMessage = error.message
        .split('(error=')[1]
        .split(', method=')[0];
      const body = JSON.parse(errorMessage).body;
      const errorMsg = JSON.parse(body);
      er && er(errorMsg || error);
    });
}

export async function getCreatNftItem(
  type,
  keystore,
  password,
  collecAddress,
  wAddress,
  baseURI, //ipfsId
  cb,
  er,
) {
  const contract = await getSignerContract(
    financeConfig.chains[type].rpcURL,
    // network,
    metaMasterAddress,
    metaMasterAbi,
    JSON.stringify(keystore),
    password,
  );
  // console.log('ccccccccc', contract);

  const result = contract
    .mint(collecAddress, wAddress, baseURI)
    .then(async res => {
      // console.log('aaaaaa', res);
      const subcontract = getContract(network, collecAddress, NFTCollectionAbi);

      let filterTo = subcontract.filters.Mint(null, fixWalletAddress(wAddress));
      // console.log('adadad', fixWalletAddress(wAddress), subcontract);
      subcontract.once(filterTo, (sender, address, event) => {
        // console.log('contracttttt', sender.toNumber());
        cb && cb(sender.toNumber());
      });

      let data = await coinWaitTransaction(type, res.hash);
    })
    .catch(error => {
      // console.log('erererererereer', error);
      // const errorMessage = error.message
      const errorMessage = error.message
        .split('(error=')[1]
        .split(', method=')[0];
      const body = JSON.parse(errorMessage).body;
      const errorMsg = JSON.parse(body);
      er && er(errorMsg || error);
    });
}

export async function getNftItemInfo(colAddress, tokenId) {
  const contract = getContract(
    network,
    colAddress,
    // ERC721EnumerableAbi,
    NFTCollectionAbi,
  );
  let token_uri = await contract.tokenURI(tokenId);
  return token_uri;
}
