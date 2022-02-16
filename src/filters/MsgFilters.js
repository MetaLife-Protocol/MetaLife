export const findRootKey = (feedId, msgs) => {
  for (const rootKey in msgs) {
    if (msgs[rootKey][0].value.content.recps.includes(feedId)) {
      return rootKey;
    }
  }
  return '';
};
