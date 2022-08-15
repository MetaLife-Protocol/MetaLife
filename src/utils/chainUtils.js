export const isSpeChain = type => {
  if (type === 'spectrum') {
    return true;
  }
  return false;
};

export const isEthChain = type => {
  if (type === 'ethereum') {
    return true;
  }
  return false;
};
export const isMainCoin = (type, cType) => {
  if (isSpeChain(type) && cType === 'SMT') {
    return true;
  }
  if (isEthChain(type) && cType === 'ETH') {
    return true;
  }
  return false;
};
export const getMainCoinName = type => {
  if (isSpeChain(type)) {
    return 'SMT';
  }
  if (isEthChain(type)) {
    return 'ETH';
  }
  return '';
};
