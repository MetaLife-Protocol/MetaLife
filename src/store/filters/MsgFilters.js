export const findRootKey = (feedId, msgs) => {
  for (const rootKey in msgs) {
    if (msgs[rootKey][0].value.content.recps.includes(feedId)) {
      return rootKey;
    }
  }
  return '';
};

export const timeForwardSorter = (a, b) =>
  a.value.timestamp - b.value.timestamp;

export const timeBackwardSorter = (a, b) =>
  b.value.timestamp - a.value.timestamp;
