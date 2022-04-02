/**
 * Created on 02 Apr 2022 by lonmee
 */

export const setFeedId = id => {
  return {type: 'setFeedId', payload: id};
};

export const trainRangeFeed = () => {
  return {type: 'trainRangeFeed'};
};
