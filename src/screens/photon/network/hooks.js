import React from 'react';
import {uploadPhotonLog} from 'react-native-photon';
import Toast from 'react-native-tiny-toast';
import {store} from '../../../store/configureStore';
import {NormalDialog} from '../../../metalife-base';

export const uploadPhotonLogDialog = ({dialog}) => {
  dialog.show(
    <NormalDialog
      title={'Upload photon log'}
      content={
        'When running a photon error, submit a local photon running log to better troubleshoot problems encountered during photon operation.'
      }
      onConfirm={() => {
        uploadPhotonLog().then(res => {
          const resJson = JSON.parse(res);
          if (resJson.error_code === 0) {
            Toast.show('Upload photon log successfully');
          } else {
            showErrorDialog(dialog);
          }
          // console.log('uploadPhotonLog res::', resJson);
        });
      }}
    />,
  );
};

function showErrorDialog(dialog) {
  dialog.show(
    <NormalDialog
      title={'Upload log failed'}
      content={`Please go to the ${getLogFile()} path to upload the backup log to the customer service to better solve the problem.`}
      onConfirm={() => {}}
    />,
  );
}

function getLogFile() {
  const photon = store.getState()?.photon;
  return photon?.logFile || '';
}
