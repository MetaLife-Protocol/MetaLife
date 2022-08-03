export const PhotonNotify = {
  onError: 'onError',
  onNotify: 'onNotify',
  onReceivedTransfer: 'onReceivedTransfer',
  onStatusChange: 'onStatusChange',
};

export const PhotonEvent = {
  balanceChange: 'balanceChange',
  channelChange: 'channelChange',
  photonTransactionChange: 'photonTransactionChange',
  spectrumTransactionChange: 'spectrumTransactionChange',
};

export const TxType = {
  ChannelDeposit: 'ChannelDeposit',
  ChannelClose: 'ChannelClose',
  ChannelSettle: 'ChannelSettle',
  CooperateSettle: 'CooperateSettle',
  UpdateBalanceProof: 'UpdateBalanceProof',
  Unlock: 'Unlock',
  Punish: 'Punish',
  Withdraw: 'Withdraw',
  ApproveDeposit: 'ApproveDeposit',
  RegisterSecret: 'RegisterSecret',
};

export const TxStatus = {
  //查询pending状态的tx
  pending: 'pending',
  //查询执行成功的tx
  success: 'success',
  //查询执行失败的tx
  failed: 'failed',
};
