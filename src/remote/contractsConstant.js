import {abi as metaMasterAbi} from './contractAbi/metaMaster.json';
import {abi as salePlainAbi} from './contractAbi/salePlain.json';
import {abi as saleAuctionAbi} from './contractAbi/saleAuction.json';
import {abi as erc20Abi} from './contractAbi/ERC20.json';

export const contractsConstant = {
  '0xa4c9af589c07b7539e5fcc45975b995a45e3f379': {
    // Mesh
    chain: 'spectrum',
    symbol: 'Mesh',
    decmis: 18,
    abi: erc20Abi,
  },
  '0xa27f8f580c01db0682ce185209ffb84121a2f711': {
    // MLT
    chain: 'spectrum',
    symbol: 'MLT',
    decmis: 18,
    abi: erc20Abi,
  },
  '0x4f47b5f2685d5d108d008577728242905ff9e5a8': {
    // metaMaster nft
    chain: 'spectrum',
    symbol: 'MateMaster',
    decmis: 18,
    abi: metaMasterAbi,
  },
  '0x33e9145a57c1549800228758a78f2044eb7ce418': {
    // salePlain
    chain: 'spectrum',
    symbol: 'SalePlain',
    decmis: 18,
    abi: salePlainAbi,
  },
  '0x9c5d58bdf58616a4fe7f8f42d5348e0e6f8936ae': {
    // saleAuction
    chain: 'spectrum',
    symbol: 'SaleAuction',
    decmis: 18,
    abi: saleAuctionAbi,
  },
};
