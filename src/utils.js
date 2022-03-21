import {PermissionsAndroid, Platform} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import Toast from 'react-native-tiny-toast';
import CameraRoll from '@react-native-community/cameraroll';

/**
 * Created on 22 Feb 2022 by lonmee
 */

export const localDate = timestamp => {
  const date = new Date(timestamp),
    time = date.toLocaleTimeString(),
    day = date.toLocaleDateString();
  return time + ' ' + day;
};

export function saveImg(img) {
  // console.log('saveImg', img);
  const promise = CameraRoll.saveToCameraRoll(img);
  promise
    .then(function (result) {
      alert('保存成功！地址如下：\n' + result);
    })
    .catch(function (error) {
      alert('保存失败！\n' + error);
    });
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
