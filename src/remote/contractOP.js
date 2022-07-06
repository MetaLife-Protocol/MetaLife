/**
 * Created on 06 Jul 2022 by lonmee
 *
 */
import {abi} from './wallet/metaMaster.json';
import {getContractNfts} from 'react-native-web3-wallet';
import {financeConfig} from './wallet/financeConfig';

const network = financeConfig.chains.spectrum.rpcURL,
  // metaMaster contract
  contractAddress = 0x0dcc00b3f7c664aaa884c87a66f7a0ce80d9367c,
  // collection address
  collectionAddress = 0x5e1b7bd5dbd7cc4c5983d13219ba541e0cdc9283;

export async function getNFTSum(address) {
  const nfts = await getContractNfts(
    network,
    contractAddress,
    abi,
    collectionAddress,
  );
  console.log(nfts);
}
