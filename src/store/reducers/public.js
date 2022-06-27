/**
 * Created on 21 Dec 2021 by lonmee
 */
import {timeBackwardSorter} from '../filters/MsgFilters';

const initState = [];

export const publicReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'addPublicMsg':
      return [payload, ...state].sort(timeBackwardSorter);
    case 'clearPublicMsg':
      return payload
        ? state.filter(msg => msg.value.author !== payload)
        : initState;
    default:
      return state;
  }
};
