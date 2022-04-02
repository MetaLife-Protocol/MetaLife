'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-21
 * @Project:MetaLife
 */

import PhotonUrl from './PhotonUrl';

/**
 * 启动服务
 */
export function getPhotonTokenSymbol(photonTokenAddress = '') {
  let tokenSymbol = 'SMT';
  if (PhotonUrl.PHOTON_SMT_TOKEN_ADDRESS === photonTokenAddress.toLowerCase()) {
    tokenSymbol = 'SMT';
  } else if (
    PhotonUrl.PHOTON_MESH_TOKEN_ADDRESS === photonTokenAddress.toLowerCase()
  ) {
    tokenSymbol = 'MESH';
  }
  return tokenSymbol;
}
