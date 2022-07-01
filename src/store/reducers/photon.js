/**
 * Created on 21 Dec 2021 by lonmee
 */

export const initValue = {
  isPhotonLogin: false,
  logFile: '',
  channelRemark: [],
  photonLogined: false,
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
    default:
      return state;
  }
};
