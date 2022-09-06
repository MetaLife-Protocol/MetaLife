/**
 * Created on 06 Jul 2022 by lonmee
 *
 */
import {abi as metaMasterAbi} from './contractAbi/metaMaster.json';
import {abi as NFTCollectionAbi} from './contractAbi/NFTCollection.json';
import {abi as salePlainAbi} from './contractAbi/salePlain.json';
import {financeConfig} from './wallet/financeConfig';
import {
  bigNumberFormatUnits,
  createBigNumber,
  getContract,
  getProvider,
  getSignerContract,
  getSignerContractWithWalletProvider,
  waitForTransaction,
} from 'react-native-web3-wallet';
import {
  coinWaitTransaction,
  getTransactionListenProvider,
} from './wallet/WalletAPI';
import {re} from '@babel/core/lib/vendor/import-meta-resolve';
import {fixWalletAddress} from '../utils';
import {contractsConstant} from './contractsConstant';

const network = financeConfig.chains.spectrum.rpcURL,
  // metaMaster contract
  contractAddress = '0x0dcc00b3f7c664aaa884c87a66f7a0ce80d9367c',
  // dev collection address
  devCollectionAddress = '0x221b9814d507bC912534A96C37a15356cc995C0E',
  // collection address
  collectionAddress = '0xf0fa86596F770E66d013f19E90C97A5d09122106',
  metaMasterAddress = '0x4f47b5f2685d5d108d008577728242905ff9e5a8',
  salePlainAddress = '0x33e9145a57c1549800228758a78f2044eb7ce418',
  saleAuction = '0x9c5d58bdf58616a4fe7f8f42d5348e0e6f8936ae';

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
  try {
    const contract = getContract(
      network,
      collectionAddress,
      financeConfig.contractABIs.erc721,
    );
    const total = await contract.totalSupply();
    return total.toNumber();
  } catch (e) {}
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
  try {
    const contract = getContract(
      network,
      collectAddress,
      // ERC721EnumerableAbi,
      NFTCollectionAbi,
    );
    // console.log('ssss', collectAddress);
    var nftCount;
    if (wAddr === undefined) {
      nftCount = await contract.totalSupply();
    } else {
      nftCount = await contract.balanceOf(wAddr);
      // console.log('ssssddd', nftCount);
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
        collectionAddress: collectAddress,
        uri: token_uri,
      };

      if (wAddr === undefined) {
        let ownerOf = await contract.ownerOf(token_id);
        nftInfo.ownerOf = ownerOf;
      } else {
        nftInfo.ownerOf = wAddr;
      }
      // console.log('rrst', nftInfo);
      cb && cb(nftInfo);
      nftInfos.push(nftInfo);
    }
    return nftInfos;
  } catch (e) {
    console.log('rrrrsssrrrr', e);
  }
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

    // console.log('nnnnnn', nftCount);
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
        // type: 'Collection',
      };
      cb && cb(collectionInfo);
      collectionInfos.push(collectionInfo);
    }
    return collectionInfos;
  } catch (e) {
    console.log('nnnnnwwwwwwwwwwn', e);
  }
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
  try {
    // const contract = await getSignerContract(
    //   financeConfig.chains[type].rpcURL,
    //   // network,
    //   metaMasterAddress,
    //   metaMasterAbi,
    //   JSON.stringify(keystore),
    //   password,
    // );
    const contract = getSignerContractWithWalletProvider(
      metaMasterAddress,
      metaMasterAbi,
      password,
    );
    // console.log('cccccccc', contract);
    // , {
    //     gasLimit: 5000000,
    //   }

    const result = contract
      .createCollection(name, symbol, baseURI, maxNum, logo, address, ratio)
      .then(async res => {
        // console.log('aaaaaa', res);
        let filterTo = contract.filters.NewCollection('0x' + address);
        let waitResult = true;
        let senderRes;
        contract.once(filterTo, (sender, address, event) => {
          // console.log('contract', address);
          // cb && cb(address);
          senderRes = address;
          waitResult = false;
        });

        let data = await coinWaitTransaction(type, res.hash);

        let timeOutStart = Date.now();
        while (waitResult) {
          if (Date.now() - timeOutStart > 3 * 1000 * 60) {
            break;
          }
        }

        if (data.status === 1) {
          cb && cb(senderRes);
        } else {
          let providerSuccess = getTransactionListenProvider(type);
          providerSuccess.on(res.hash, resListen => {
            // console.log('rrrrrr', resListen);
            if (resListen.status === 1 && resListen.confirmations > 1) {
              if (senderRes !== undefined) {
                providerSuccess.removeAllListeners(res.hash);
                cb && cb(senderRes);
              }
            }
            if (resListen.confirmations > 19) {
              providerSuccess.removeAllListeners(res.hash);
            }
          });
        }
        let provider = getTransactionListenProvider(type);
        provider.on(res.hash, resListen => {
          if (resListen.status !== 1 && resListen.confirmations > 1) {
            er('request failed');
            provider.removeAllListeners(res.hash);
          }
          if (resListen.confirmations > 19) {
            provider.removeAllListeners(res.hash);
          }
        });
      })
      .catch(error => {
        console.log('erererererereer', error);
        const errorMessage = error.message
          .split('(error=')[1]
          .split(', method=')[0];
        const body = JSON.parse(errorMessage).body;
        const errorMsg = JSON.parse(body);
        er && er(errorMsg || error);
      });
  } catch (e) {
    er(e);
  }
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
  // const contract = await getSignerContract(
  //   financeConfig.chains[type].rpcURL,
  //   // network,
  //   metaMasterAddress,
  //   metaMasterAbi,
  //   JSON.stringify(keystore),
  //   password,
  // );
  const contract = getSignerContractWithWalletProvider(
    metaMasterAddress,
    metaMasterAbi,
    password,
  );
  // console.log('ccccccccc', contract);
  // contract.estimateGas.mint(collecAddress, wAddress, baseURI).then(r => {
  //   console.log('rrrrrr', r.toNumber());
  // });

  const result = contract
    .mint(collecAddress, fixWalletAddress(wAddress), baseURI)
    .then(async res => {
      console.log('aaaaaa', res);
      const subcontract = getContract(network, collecAddress, NFTCollectionAbi);

      let filterTo = subcontract.filters.Mint(null, fixWalletAddress(wAddress));

      // console.log('adadad', filterTo, subcontract);
      // let quest = new Promise((resolve, reject) => {
      //
      // });
      let waitResult = true;
      // Promise.all(new Promise(() => {})).then(res => {});
      let senderRes;
      subcontract.once(filterTo, (sender, address, event) => {
        // console.log('contracttttt', sender.toNumber());
        // resolve(sender.toNumber());
        // cb && cb(sender.toNumber());
        senderRes = sender.toNumber();
        waitResult = false;
        console.log('ddddd', senderRes, waitResult, sender.toNumber());
      });

      let data = await coinWaitTransaction(type, res.hash);

      let timeOutStart = Date.now();
      while (waitResult) {
        if (Date.now() - timeOutStart > 3 * 1000 * 60) {
          break;
        }
      }

      let provider = getTransactionListenProvider(type);

      if (data.status === 1) {
        cb && cb(senderRes);
      } else {
        let providerSuccess = getTransactionListenProvider(type);
        providerSuccess.on(res.hash, resListen => {
          console.log('rrrrrr', resListen);
          if (resListen.status === 1 && resListen.confirmations > 1) {
            if (senderRes !== undefined) {
              providerSuccess.removeAllListeners(res.hash);
              cb && cb(senderRes);
            }
          }
          if (resListen.confirmations > 19) {
            providerSuccess.removeAllListeners(res.hash);
          }
        });
      }
      provider.on(res.hash, resListen => {
        // console.log('fffaillll', resListen);
        if (resListen.status !== 1 && resListen.confirmations > 1) {
          // console.log(
          //   'fffaillllsssss',
          //   resListen.status,
          //   resListen.confirmations,
          // );

          er('request failed');
          provider.removeAllListeners(res.hash);
        }
        if (resListen.confirmations > 19) {
          provider.removeAllListeners(res.hash);
        }
      });
    })
    .catch(error => {
      console.log('erererererereer', error);
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

export async function getOpenGalaxyNFTCollectionInfos(cb, page = 0, limit = 0) {
  const contract = getContract(
    network,
    metaMasterAddress,
    // ERC721EnumerableAbi,
    metaMasterAbi,
  );
  var nftCount;
  // try {
  nftCount = await contract.createdCollectionNum();
  // const s = await contract.collectionOwner(collectionAddress);
  // console.log('aaaaaaa', s);

  // console.log('nnnnnn', nftCount);
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

    collection_address = await contract.createdCollections(idx);

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
  // } catch (e) {
  //   console.log('nnnnnwwwwwwwwwwn', e);
  // }
  // cb && cb(nftInfos);
}

export async function transformNftItem(
  type,
  keystore,
  password,
  toAddress,
  wAddress,
  collecAddress,
  tokenId, //ipfsId
  gasLimit,
  cb,
  er,
  cbAdd,
) {
  // const contract = await getSignerContract(
  //   financeConfig.chains[type].rpcURL,
  //   // network,
  //   metaMasterAddress,
  //   // ERC721EnumerableAbi,
  //   metaMasterAbi,
  //   JSON.stringify(keystore),
  //   password,
  // );
  const contract = getSignerContractWithWalletProvider(
    metaMasterAddress,
    metaMasterAbi,
    password,
  );
  const info = await contract.getSaleInfo(collecAddress, tokenId);
  if (
    info[0] &&
    info[1] &&
    info[3] !== '0x0000000000000000000000000000000000000000'
  ) {
    er('NFT was already selled');
    return;
  }
  // console.log('iiiiiii', info[0] && info[1] && info[3], info);
  // console.log('ccccccccc', contract);
  // contract.estimateGas
  //   .transferByMaster(
  //     fixWalletAddress(wAddress),
  //     fixWalletAddress(toAddress),
  //     tokenId,
  //   )
  //   .then(r => {
  //     console.log('rrrrrr', r.toNumber());
  //   });
  try {
    const result = contract
      .transfer(
        fixWalletAddress(collecAddress),
        tokenId,
        fixWalletAddress(toAddress),
        {gasLimit: gasLimit},
      )
      .then(async res => {
        // console.log('aaaaaa', res, collecAddress, toAddress, tokenId);
        const subcontract = getContract(
          network,
          collecAddress,
          NFTCollectionAbi,
        );

        let data = await coinWaitTransaction(type, res.hash);
        // if (data.status !== 1) {
        //   er('request failed');
        // }
        // console.log('uuuu', data);

        if (data.status === 1) {
          cb && cb(res.hash);
        } else {
          let providerSuccess = getTransactionListenProvider(type);
          providerSuccess.on(res.hash, resListen => {
            // console.log('rrrrrr', resListen);
            if (resListen.status === 1 && resListen.confirmations > 1) {
              providerSuccess.removeAllListeners(res.hash);
              cb && cb(res.hash);
            }
            if (resListen.confirmations > 19) {
              providerSuccess.removeAllListeners(res.hash);
            }
          });
        }
        let provider = getTransactionListenProvider(type);
        provider.on(res.hash, resListen => {
          // console.log('hhhh', resListen);
          if (resListen.status !== 1 && resListen.confirmations > 1) {
            er('request failed');
            provider.removeAllListeners(res.hash);
          } else {
            cbAdd(collecAddress, tokenId);
          }
          if (resListen.confirmations > 19) {
            provider.removeAllListeners(res.hash);
          }
        });
      })
      .catch(error => {
        console.log('erererererereer', error);
        // const errorMessage = error.message
        const errorMessage = error.message
          .split('(error=')[1]
          .split(', method=')[0];
        const body = JSON.parse(errorMessage).body;
        const errorMsg = JSON.parse(body);
        er && er(errorMsg || error);
      });
  } catch (e) {
    er(e);
  }
}

export async function getOpenGalaxyNFTCollectionListInfo(
  cb,
  page = 0,
  limit = 0,
) {
  const contract = getContract(
    network,
    metaMasterAddress,
    // ERC721EnumerableAbi,
    metaMasterAbi,
  );
  try {
    let offset = limit * page;
    let listlength = await contract.getSalesCount();
    if (limit + offset > listlength.toNumber()) {
      if (offset < listlength.toNumber()) {
        limit = listlength.toNumber() - offset;
      } else {
        return;
      }
    }
    // console.log('aaaa', listlength);

    let salesInfo = await contract.getSales(limit, offset);
    return salesInfo;
  } catch (e) {}
  // cb && cb(nftInfos);
}

export async function getLimitSell(
  type,
  keystore,
  password,
  colAddress,
  nftCode,
  sellType,
  address,
  price,
  time,
  cb,
  er,
) {
  //  .estimateGas
  // const contract = await getSignerContract(
  //   financeConfig.chains[type].rpcURL,
  //   // network,
  //   metaMasterAddress,
  //   // ERC721EnumerableAbi,
  //   metaMasterAbi,
  //   JSON.stringify(keystore),
  //   password,
  // );
  const contract = getSignerContractWithWalletProvider(
    metaMasterAddress,
    metaMasterAbi,
    password,
  );
  // console.log('aaaaaa', contract, time);
  try {
    const result = await contract.estimateGas.sell(
      colAddress,
      nftCode,
      sellType,
      address,
      price.toString(),
      time,
    );
    // console.log('rrrrrrrs', result);
    cb && cb(result, contract);
  } catch (e) {
    // er(e);
  }
}

export async function pushSell(
  type,
  contract,
  colAddress,
  nftCode,
  sellType,
  address,
  price,
  time,
  gasLimit,
  cb,
  er,
) {
  try {
    // const contract = await getSignerContract(
    //   financeConfig.chains[type].rpcURL,
    //   // network,
    //   metaMasterAddress,
    //   // ERC721EnumerableAbi,
    //   metaMasterAbi,
    //   JSON.stringify(keystore),
    //   password,
    // );
    const result = await contract.sell(
      colAddress,
      nftCode,
      sellType,
      address,
      price.toString(),
      time,
      {gasLimit: gasLimit},
    );
    // console.log('ddddd', result);
    const subcontract = getContract(network, colAddress, NFTCollectionAbi);

    let data = await coinWaitTransaction(type, result.hash);
    // if (data.status !== 1) {
    //   er('request failed');
    // }
    // console.log('uuuu', data);
    if (data.status === 1) {
      cb && cb(result.hash);
    } else {
      let providerSuccess = getTransactionListenProvider(type);
      providerSuccess.on(result.hash, resListen => {
        // console.log('rrrrrr', resListen);
        if (resListen.status === 1 && resListen.confirmations > 1) {
          providerSuccess.removeAllListeners(result.hash);
          cb && cb(result.hash);
        }
        if (resListen.confirmations > 19) {
          providerSuccess.removeAllListeners(result.hash);
        }
      });
    }

    let provider = getTransactionListenProvider(type);
    provider.on(result.hash, resListen => {
      // console.log('hhhh', resListen);
      if (resListen.status !== 1 && resListen.confirmations > 1) {
        er('request failed');
        provider.removeAllListeners(result.hash);
      }
      if (resListen.confirmations > 19) {
        provider.removeAllListeners(result.hash);
      }
    });
  } catch (e) {
    er(e);
  }
}

export async function getMyNFTSellItemListInfo(
  cb,
  myaddress,
  page = 0,
  limit = 0,
) {
  try {
    const contract = getContract(
      network,
      metaMasterAddress,
      // ERC721EnumerableAbi,
      metaMasterAbi,
    );
    let offset = limit * page;
    let listlength = await contract.getSalesCountByUser(myaddress);
    if (limit + offset > listlength.toNumber()) {
      if (offset < listlength.toNumber()) {
        limit = listlength.toNumber() - offset;
      } else {
        return;
      }
    }
    // console.log('aaaa', listlength);

    let salesInfo = await contract.getSalesByUser(myaddress, limit, offset);
    return salesInfo;
  } catch (e) {}
  // cb && cb(nftInfos);
}

export async function cancelListingNFT(
  type,
  keystore,
  password,
  id,
  colAddress,
  cb,
  er,
) {
  try {
    // const contract = await getSignerContract(
    //   financeConfig.chains[type].rpcURL,
    //   salePlainAddress,
    //   salePlainAbi,
    //   JSON.stringify(keystore),
    //   password,
    // );
    const contract = getSignerContractWithWalletProvider(
      salePlainAddress,
      salePlainAbi,
      password,
    );

    const saleId = await contract.getSaleId(colAddress, id);
    // console.log('ssssssff', createBigNumber(saleId));
    const result = await contract.cancel(createBigNumber(saleId));
    // console.log('fffffrrrrr', result);
    const subcontract = getContract(network, colAddress, NFTCollectionAbi);

    let data = await coinWaitTransaction(type, result.hash);
    // if (data.status !== 1) {
    //   er('request failed');
    // }
    // console.log('uuuu', data);
    if (data.status === 1) {
      cb && cb(result.hash);
    } else {
      let providerSuccess = getTransactionListenProvider(type);
      providerSuccess.on(result.hash, resListen => {
        // console.log('rrrrrr', resListen);
        if (resListen.status === 1 && resListen.confirmations > 1) {
          providerSuccess.removeAllListeners(result.hash);
          cb && cb(result.hash);
        }
        if (resListen.confirmations > 19) {
          providerSuccess.removeAllListeners(result.hash);
        }
      });
    }
    let provider = getTransactionListenProvider(type);
    provider.on(result.hash, resListen => {
      // console.log('hhhh', resListen);
      if (resListen.status !== 1 && resListen.confirmations > 1) {
        er('request failed');
        provider.removeAllListeners(result.hash);
      }
      if (resListen.confirmations > 19) {
        provider.removeAllListeners(result.hash);
      }
    });
  } catch (e) {
    er(e);
  }
}

export async function getSaleInfo(tokenId, colAddress) {
  // const contract = getContract(network, salePlainAddress, salePlainAbi);
  try {
    const mastercontract = getContract(
      network,
      metaMasterAddress,
      metaMasterAbi,
    );
    // console.log('ttt', contract);
    // const saleId = await contract.getSaleId(colAddress, tokenId);
    const info = await mastercontract.getSaleInfo(colAddress, tokenId);
    return info;
  } catch (e) {}
}

export async function getBuyGasLimit(
  type,
  keystore,
  password,
  id,
  colAddress,
  price,
  cb,
  er,
) {
  try {
    // const contract = await getSignerContract(
    //   financeConfig.chains[type].rpcURL,
    //   salePlainAddress,
    //   salePlainAbi,
    //   JSON.stringify(keystore),
    //   password,
    // );
    const contract = getSignerContractWithWalletProvider(
      salePlainAddress,
      salePlainAbi,
      password,
    );
    const saleId = await contract.getSaleId(colAddress, id);
    // console.log('ssssssff', createBigNumber(saleId));
    const result = await contract.estimateGas.bidWithValue(
      createBigNumber(saleId),
      {
        value: price,
      },
    );
    // console.log('dddd', result);
    cb && cb(result);
  } catch (e) {
    er(e);
  }
}

export async function getBuyGasLimitByErc20(
  type,
  keystore,
  password,
  id,
  colAddress,
  price,
  token,
  cb,
  er,
) {
  // const contract = await getSignerContract(
  //   financeConfig.chains[type].rpcURL,
  //   salePlainAddress,
  //   salePlainAbi,
  //   JSON.stringify(keystore),
  //   password,
  // );
  const contract = getSignerContractWithWalletProvider(
    salePlainAddress,
    salePlainAbi,
    password,
  );
  const newcontract = getSignerContractWithWalletProvider(
    token,
    contractsConstant[type][token.toLowerCase()].abi,
    password,
  );
  const appro = await newcontract.approve(salePlainAddress, price);
  const saleId = await contract.getSaleId(colAddress, id);
  // console.log('sssddddttt', appro);
  let provider = getTransactionListenProvider(type);
  provider.on(appro.hash, resListen => {
    // console.log('hhhh', resListen);
    if (resListen.status !== 1 && resListen.confirmations > 1) {
      er('request failed');
      provider.removeAllListeners(appro.hash);
    }
    if (resListen.status === 1 && resListen.confirmations > 1) {
      getConfirm();
      provider.removeAllListeners(appro.hash);
    }
  });
  async function getConfirm() {
    try {
      const result = await contract.estimateGas.bidWithToken(
        createBigNumber(saleId),
        price,
      );
      // console.log('dddd', result);
      cb && cb(result);
    } catch (e) {
      er(e);
      console.log('erer', e);
      if (typeof e === 'function') {
        er('request failed');
      }
    }
  }
}

export async function getBuyNft(
  type,
  keystore,
  password,
  id,
  colAddress,
  gasLim,
  goodPrice,
  cb,
  er,
) {
  // try {
  // const contract = await getSignerContract(
  //   financeConfig.chains[type].rpcURL,
  //   salePlainAddress,
  //   salePlainAbi,
  //   JSON.stringify(keystore),
  //   password,
  // );
  const contract = getSignerContractWithWalletProvider(
    salePlainAddress,
    salePlainAbi,
    password,
  );
  const saleId = await contract.getSaleId(colAddress, id);
  // console.log('ssssssff', createBigNumber(saleId));
  const result = await contract.bidWithValue(createBigNumber(saleId), {
    gasLimit: gasLim,
    value: goodPrice,
  });
  // console.log('fffffrrrrr', result);
  const subcontract = getContract(network, colAddress, NFTCollectionAbi);

  let data = await coinWaitTransaction(type, result.hash);
  // if (data.status !== 1) {
  //   er('request failed');
  // }
  // console.log('uuuu', data);
  if (data.status === 1) {
    cb && cb(result.hash);
  } else {
    let providerSuccess = getTransactionListenProvider(type);
    providerSuccess.on(result.hash, resListen => {
      // console.log('rrrrrr', resListen);
      if (resListen.status === 1 && resListen.confirmations > 1) {
        providerSuccess.removeAllListeners(result.hash);
        cb && cb(result.hash);
      }
      if (resListen.confirmations > 19) {
        providerSuccess.removeAllListeners(result.hash);
      }
    });
  }
  // cb && cb(result.hash);
  let provider = getTransactionListenProvider(type);
  provider.on(result.hash, resListen => {
    // console.log('hhhh', resListen);
    if (resListen.status !== 1 && resListen.confirmations > 1) {
      er('request failed');
      provider.removeAllListeners(result.hash);
    }
    if (resListen.confirmations > 19) {
      provider.removeAllListeners(result.hash);
    }
  });
  // } catch (e) {
  //   er(e);
  // }
}

export async function getBuyNftByERC20(
  type,
  keystore,
  password,
  id,
  colAddress,
  goodPrice,
  token,
  cb,
  er,
) {
  // try {
  // const contract = await getSignerContract(
  //   financeConfig.chains[type].rpcURL,
  //   salePlainAddress,
  //   salePlainAbi,
  //   JSON.stringify(keystore),
  //   password,
  // );
  const contract = getSignerContractWithWalletProvider(
    salePlainAddress,
    salePlainAbi,
    password,
  );
  // const newcontract = await getSignerContract(
  //   financeConfig.chains[type].rpcURL,
  //   token,
  //   contractsConstant[type][token.toLowerCase()].abi,
  //   JSON.stringify(keystore),
  //   password,
  // );
  const newcontract = getSignerContractWithWalletProvider(
    token,
    contractsConstant[type][token.toLowerCase()].abi,
    password,
  );
  const appro = await newcontract.approve(salePlainAddress, goodPrice);
  const saleId = await contract.getSaleId(colAddress, id);
  // console.log('ssssssff', createBigNumber(saleId));
  const result = await contract.bidWithToken(
    createBigNumber(saleId),
    goodPrice,
  );
  // console.log('fffffrrrrr', result);
  const subcontract = getContract(network, colAddress, NFTCollectionAbi);

  let data = await coinWaitTransaction(type, result.hash);
  // if (data.status !== 1) {
  //   er('request failed');
  // }
  // console.log('uuuu', data);
  if (data.status === 1) {
    cb && cb(result.hash);
  } else {
    let providerSuccess = getTransactionListenProvider(type);
    providerSuccess.on(result.hash, resListen => {
      // console.log('rrrrrr', resListen);
      if (resListen.status === 1 && resListen.confirmations > 1) {
        providerSuccess.removeAllListeners(result.hash);
        cb && cb(result.hash);
      }
      if (resListen.confirmations > 19) {
        providerSuccess.removeAllListeners(result.hash);
      }
    });
  }
  // cb && cb(result.hash);
  let provider = getTransactionListenProvider(type);
  provider.on(result.hash, resListen => {
    // console.log('hhhh', resListen);
    if (resListen.status !== 1 && resListen.confirmations > 1) {
      er('request failed');
      provider.removeAllListeners(result.hash);
    }
    if (resListen.confirmations > 19) {
      provider.removeAllListeners(result.hash);
    }
  });
  // } catch (e) {
  //   er(e);
  // }
}
