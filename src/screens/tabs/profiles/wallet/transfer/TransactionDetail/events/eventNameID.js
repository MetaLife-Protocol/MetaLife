import {getEventNameID} from 'react-native-web3-wallet';

export const Erc20NameID = {
  transfer: getEventNameID('Transfer(address,address,uint256)'),
  approval: getEventNameID('Approval(address,address,uint256)'),
};

/*
    {
    transfer: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    approval: "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", 
    mint: "0x3794f7f7a2011a8e813b6d89dbacb3d42f6810b632e735dc2eab8628afdb77d9", 
    ownershipTransferred: "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", 
    newCollection: "0x5b84d9550adb7000df7bee717735ecd3af48ea3f66c6886d52e8227548fb228c"
    }
   */
export const NftEventNameID = {
  transfer: getEventNameID('Transfer(address,address,uint256)'),
  approval: getEventNameID('Approval(address,address,uint256)'),
  mint: getEventNameID('Mint(uint256,address,address)'),
  ownershipTransferred: getEventNameID('OwnershipTransferred(address,address)'),
  newCollection: getEventNameID('NewCollection(address,address)'),
};
/**
 {
  channelClose: "0x69610baaace24c039f891a11b42c0b1df1496ab0db38b0c4ee4ed33d6d53da1a"
  channelCreate: "0xc3a8dbc3d2c201f4a985c395dff13cbcf880e0652f34061448c3363c23a9d2db"
  channelDeposit: "0x0346e981e2bfa2366dc2307a8f1fa24779830a01121b1275fe565c6b98bb4d34"
  channelSettle: "0xf94fb5c0628a82dc90648e8dc5e983f632633b0d26603d64e8cc042ca0790aa4"
  channelWithdraw: "0xdc5ff4ab383e66679a382f376c0e80534f51f3f3a398add646422cd81f5f815d"
  cooperativeSettle: "0xfb2f4bc0fb2e0f1001f78d15e81a2e1981f262d31e8bd72309e26cc63bf7bb02"
  transfer: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
 }
 */
export const PhotonEventNameID = {
  transfer: getEventNameID('Transfer(address,address,uint256)'),
  channelWithdraw: getEventNameID(
    'ChannelWithdraw(bytes32,address,uint256,address,uint256)',
  ),
  channelCreate: getEventNameID(
    'ChannelOpenedAndDeposit(address,address,address,uint64,uint256)',
  ),
  channelDeposit: getEventNameID('ChannelNewDeposit(bytes32,address,uint256)'),
  cooperativeSettle: getEventNameID(
    'ChannelCooperativeSettled(bytes32,uint256,uint256)',
  ),
  channelClose: getEventNameID(
    'ChannelClosed(bytes32,address,bytes32,uint256)',
  ),
  channelSettle: getEventNameID('ChannelSettled(bytes32,uint256,uint256)'),
};

/**
 {
  "cancelSale": "0x8b0a052bd72fec557d5735593db719bcb565d7afec8d76ee165e317e8cc98409",
  "confirmSale": "0x8484265a68fd7cea22f85d6a338d7534f34ae4ff7d204bfa9faaec9e9e696ba3",
  "createSale": "0x008f298a385d495e86787887da324d1603491ea0ea157acffd6c5851d6ddfa2f",
  "updateSale": "0xfe8937da95814c69018f7a05dcec87068d26502ab6dabf6516ea314dc1dca32b"
}
 */
export const SaleEventNameID = {
  confirmSale: getEventNameID(
    'ConfirmSale(address,uint256,address,address,address,uint256)',
  ),
  createSale: getEventNameID(
    'CreateSale(address,uint256,address,address,uint256,uint256)',
  ),
  cancelSale: getEventNameID('CancelSale(address,uint256)'),
  updateSale: getEventNameID(
    'UpdateSale(address,uint256,address,address,uint256,uint256)',
  ),
};
