/**
 * Created on 21 Dec 2021 by lonmee
 */

export const initValue = {};
export const photonReducer = (state = initValue, {type, payload}) => {
  switch (type) {
    case 'setLogFile':
      return {...state, logFile: payload};
    case 'reset':
      return initValue;
    default:
      return state;
  }
};
