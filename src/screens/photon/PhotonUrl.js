const GLOBAL_SWITCH_OPEN = true;

export default class PhotonUrl {
  /**
   * 光子部署的 Mesh token
   * 跟链上MESH 币的token一样
   * */
  static PHOTON_MESH_TOKEN_ADDRESS =
    '0xF0123C3267Af5CbBFAB985d39171f5F5758C0900';

  /**
   * 光子部署的 SMT token
   * */
  static PHOTON_SMT_TOKEN_ADDRESS = GLOBAL_SWITCH_OPEN
    ? '0x6601F810eaF2fa749EEa10533Fd4CC23B8C791dc'
    : '0xF6e8A227cbD5257d2f8a764F5788ce56E3554cB5';

  /**
   * MTL
   * @type {string}
   */
  static PHOTON_MTL_TOKEN_ADDRESS =
    '0xa27f8f580c01db0682ce185209ffb84121a2f711';
}
