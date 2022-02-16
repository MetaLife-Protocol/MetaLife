/**
 * Created on 21 Dec 2021 by lonmee
 */

export const daoInitValue = [];
export const daoReducer = (state = daoInitValue, {type, payload}) => {
  switch (type) {
    case 'add':
      return state.concat(payload);
    case 'remove':
      return state;
    case 'reset':
      return daoInitValue;
    default:
      return state;
  }
};
