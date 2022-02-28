/**
 * parser for graph
 * @param graph
 * @param id
 * @returns {[][]} friends, following, follower, block, blocked, other
 */
export const friendsGraphParse = (graph, id, includeFriend = true) => {
  let following = [],
    follower = [],
    block = [],
    blocked = [],
    other = [],
    friends = [];
  Object.keys(graph).forEach(key => {
    Object.keys(graph[key]).forEach(subKey => {
      const value = graph[key][subKey];
      if (key == id) {
        value > 0
          ? following.push(subKey)
          : value == -1
          ? block.push(subKey)
          : other.push(subKey);
      } else if (subKey == id) {
        value > 0
          ? follower.push(key)
          : value == -1
          ? blocked.push(key)
          : other.push(key);
      }
    });
  });
  friends = following.filter(v => follower.includes(v));
  // kick out friend element(s)
  if (!includeFriend) {
    following = following.filter(v => !friends.includes(v));
    follower = follower.filter(v => !friends.includes(v));
  }
  return [friends, following, follower, block, blocked, other];
};

export const mutualFriend = (fA, fB) => fA.filter(v => fB.includes(v));
