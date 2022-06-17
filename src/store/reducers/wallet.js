/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {};

export const walletReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'walletCreateAccount':
      const {} = payload;
    case 'walletUpdateAccount':
      const {} = payload;
    case 'walletDeleteAccount':
      const {} = payload;
    default:
      return state;
  }
};
