import {
  retrieveWithSession,
  storeWithSession,
} from 'react-native-metalife-storage';
import {getSignedSecretSession} from '../remote/wallet/WalletAPI';

/**
 * Created on 14 Jul 2022 by lonmee
 *
 */

export function sddsafsadf(originKey, data, cb) {
  let signedMessage = getSignedSecretSession(originKey);

  storeWithSession(originKey, signedMessage, data)
    .then(() => {
      cb(true, null);
    })
    .catch(err => {
      cb(false, err);
    });
}

export function yjggfjgjghfg(originKey, cb) {
  let signedMessage = getSignedSecretSession(originKey);
  retrieveWithSession(originKey, signedMessage)
    .then(res => {
      cb(true, res);
    })
    .catch(err => {
      cb(false, err);
    });
}
