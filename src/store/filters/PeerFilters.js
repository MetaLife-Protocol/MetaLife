/**
 * Created on 28 Feb 2022 by lonmee
 */

export const getAddressForFid = (contact, stagedPeers) =>
  stagedPeers.filter(([_, {key}]) => key === contact)[0][0];
