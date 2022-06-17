/**
 * Created on 17 Jun 2022 by lonmee
 *
 */
import {createWallet} from 'react-native-web3-wallet';

export function createAccount(pw, cb) {
  createWallet(pw, "m/44'/60'/0'/0/0")
    .then(res => cb && cb(res))
    .catch(reason => console.warn(reason));
}
