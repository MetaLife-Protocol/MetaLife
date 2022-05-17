'use strict';

/**
 * @Author: lq
 * @Date: 2022-05-16
 * @Project:MetaLife
 */
import Web3 from 'web3';

export function initNFT({privateKey, address}) {
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
}
