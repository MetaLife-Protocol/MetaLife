'use strict';

/**
 * @Author: lq
 * @Date: 2022-05-16
 * @Project:MetaLife
 */
// import Web3 from 'web3';
import RNFS from 'react-native-fs';

export function initNFT({privateKey, address}) {
  // const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
}

export function uploadFileToIFPS({
  filepath = '',
  fileType = 'audio/x-m4a',
  fileName = '',
}) {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const files = [
    {
      name: 'test1',
      filename: fileName,
      filepath: filepath,
      filetype: fileType,
    },
  ];
  const uploadBegin = response => {
    const jobId = response.jobId;
    console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
  };

  const uploadProgress = response => {
    const percentage = Math.floor(
      (response.totalBytesSent / response.totalBytesExpectedToSend) * 100,
    );
    console.log('UPLOAD IS ' + percentage + '% DONE!');
  };

  RNFS.uploadFiles({
    toUrl: url,
    files: files,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      // 'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      'Content-Type': 'multipart/form-data; boundary=gc0p4Jq0M2Yt08jU534c0p',
      // 'Content-Type': 'multipart/form-data',
      pinata_api_key: '4cd99bf33f054563a462',
      pinata_secret_api_key:
        '4fc0fde61c827ef9d163ac31d34e8e23b3bedfd87c468087abacf9450abd8609',
    },
    fields: {
      hello: 'world',
    },
    begin: uploadBegin,
    progress: uploadProgress,
  })
    .promise.then(response => {
      if (response.statusCode == 200) {
        console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
      } else {
        console.log('SERVER ERROR', response);
      }
    })
    .catch(err => {
      if (err.description === 'cancelled') {
        // cancelled by user
      }
      console.log(err);
    });
}
