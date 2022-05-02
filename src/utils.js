import {PermissionsAndroid, Platform} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import Toast from 'react-native-tiny-toast';

/**
 * Created on 22 Feb 2022 by lonmee
 */

export const localDate = timestamp => {
  const date = new Date(timestamp),
    time = date.toLocaleTimeString(),
    day = date.toLocaleDateString();
  return time + ' ' + day;
};

export const restrict = event =>  {
  const regex = new RegExp("^[a-zA-Z]+$");
  const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
  if (!regex.test(key)) {
      event.preventDefault();
      return false;
  }
}

export const checkAndLaunchCamera = completeHandler => {
  Platform.select({
    ios: () =>
      launchCamera(
        {
          cameraType: 'front',
          maxHeight: 1920,
          maxWidth: 1080,
          quality: 0.88,
          mediaType: 'photo',
        },
        completeHandler,
      ),
    android: () =>
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
        .then(value =>
          value
            ? launchCamera(
                {
                  cameraType: 'front',
                  maxHeight: 1920,
                  maxWidth: 1080,
                  quality: 0.88,
                  mediaType: 'photo',
                },
                completeHandler,
              )
            : PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                  title: 'connections.modes.bluetooth.permission_request.title',
                  message:
                    'connections.modes.bluetooth.permission_request.message',
                  buttonPositive: 'call_to_action.yes',
                  buttonNegative: 'call_to_action.no',
                },
              ).then(value =>
                value === 'granted'
                  ? launchCamera(
                      {
                        cameraType: 'front',
                        maxHeight: 1920,
                        maxWidth: 1080,
                        quality: 0.88,
                        mediaType: 'photo',
                      },
                      completeHandler,
                    )
                  : Toast.show('please grant the privacy of camera'),
              ),
        )
        .catch(Toast.show),
  })();
};

/*
export const encryptKey = (password, salt)  => {
  return pbkdf2.pbkdf2Sync(password, salt, 1, 256 / 8, 'sha512')
}

export const encryptString = (password, hexString) => {
  const textBytes = aesjs.utils.utf8.toBytes(hexString)
  const aesCtr = new aesjs.ModeOfOperation.ctr(password)
  const encrypted = aesCtr.encrypt(textBytes)

  return {
      bytes: encrypted,
      hex: aesjs.utils.hex.fromBytes(encrypted),
  }
}

export const decryptString = (password, salt, hexString) => {
  const key = encryptKey(password, salt)
  const encryptedBytes = aesjs.utils.hex.toBytes(hexString)
  const aesCtr = new aesjs.ModeOfOperation.ctr(key)
  const decryptedBytes = aesCtr.decrypt(encryptedBytes)

  return aesjs.utils.utf8.fromBytes(decryptedBytes)
}

export const validatePrivateKey = (address)  => {
  try {
      return Web3.utils.isAddress(address)
  } catch (e) {
      return false
  }
}

export const encryptKeyStore = (provider, privateKey, password) => {
  const keystoreV3Json = provider.eth.accounts.encrypt(privateKey, password)
  return JSON.stringify(keystoreV3Json);
}

export const decryptKeyStore = (provider, keystoreV3hex, password) => {
  if (!password) {
      return false
  }
  const keystoreV3Json = JSON.parse(keystoreV3hex)
  const privateKey = provider.eth.accounts.decrypt(keystoreV3Json, password)
  return privateKey;
}
*/