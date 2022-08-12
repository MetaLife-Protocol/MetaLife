import {getContract} from 'react-native-web3-wallet';
import {financeConfig} from '../../../../../../remote/wallet/financeConfig';
import {abi as NFTCollectionAbi} from '../../../../../../remote/contractAbi/NFTCollection.json';

export const getAmountPrefix = (address, currentAddress) => {
  try {
    const add1 = address.toLowerCase();
    const add2 = currentAddress.toLowerCase();
    const current = add2.indexOf('0x') !== -1 ? add2 : '0x' + add2;
    if (add1 === current) {
      return '+';
    } else {
      return '-';
    }
  } catch (e) {
    console.log('getAmountPrefix', e);
  }
};

export const getNftName = async address => {
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
