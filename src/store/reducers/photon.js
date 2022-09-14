/**
 * Created on 21 Dec 2021 by lonmee
 */

export const initValue = {
  isPhotonLogin: false,
  logFile: '',
  channelRemark: [],
  photonLogined: false,
  noInternet: false,
};
export const photonReducer = (state = initValue, {type, payload}) => {
  switch (type) {
    case 'setPhotonLogin':
      return {
        ...state,
        logFile: payload,
        isPhotonLogin: true,
        photonLogined: true,
      };
    case 'setChannelRemark':
      return {
        ...state,
        channelRemark: [
          ...(state?.channelRemark ?? []),
          // {address: payload?.address, remark: payload?.remark},
          payload,
        ],
      };
    case 'resetPhoton':
      return {
        channelRemark: state?.channelRemark,
        isPhotonLogin: false,
        logFile: '',
        photonLogined: state?.photonLogined,
      };
    case 'switchNoInternet':
      return {
        ...state,
        noInternet: !state.noInternet,
      };
    case 'setDefaultAddress':
      return {
        ...state,
        defaultAddress: payload.address,
      };
    case 'initPhotonBalance':
      return {
        ...state,
        [payload.address]: {
          SMTInPhoton: payload.SMTInPhoton,
          MLTInPhoton: payload.MLTInPhoton,
          uploadTime: Date.now(),
        },
      };
    case 'updatePhotonBalance':
      return {
        ...state,
        [payload.address]: {
          ...state[payload.address],
          SMTInPhoton: payload.SMTInPhoton,
          MLTInPhoton: payload.MLTInPhoton,
          uploadTime: payload.uploadTime ?? state[payload.address].uploadTime,
        },
      };
    default:
      return state;
  }
};
