'use strict';

/**
 * @Author: lq
 * @Date: 2022-05-16
 * @Project:MetaLife
 */
// import Web3 from 'web3';
import RNFS from 'react-native-fs';
// import createIpfsHttpClient from 'ipfs-http-client';
import {HTTP_CLIENT_URL} from './nftConfig';
import axios from 'axios';

export function initNFT({privateKey, address}) {
  // const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
}

export function initIPFS() {
  // const ipfsClient = createIpfsHttpClient(HTTP_CLIENT_URL);
  // console.log('ipfsClient:::', ipfsClient);
}

export function uploadFileToIFPS({
  filepath = '',
  fileType = 'audio/x-m4a',
  fileName = '',
}) {
  console.log('uploadFileToIFPS filepath::', filepath);

  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const FormData = require('form-data');
  let data = new FormData();
  data.append('file', RNFS.readFile(filepath, 'utf8'));

  axios
    .post(url, data, {
      maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: '5f0a6920de1814671e86',
        pinata_secret_api_key:
          '2415964ec8a4ee1495d7bbb3f3b5551f92a06d6b6bf1a749e11f70849211a9c7',
      },
    })
    .then(function (response) {
      //handle response here
      console.log('SERVER response:', response);
    })
    .catch(function (error) {
      console.log('SERVER ERROR:', error);
      //handle error here
    });

  // const files = [
  //   {
  //     name: 'test1',
  //     filename: fileName,
  //     filepath: filepath,
  //     filetype: fileType,
  //   },
  // ];
  // const uploadBegin = response => {
  //   const jobId = response.jobId;
  //   console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
  // };
  //
  // const uploadProgress = response => {
  //   const percentage = Math.floor(
  //     (response.totalBytesSent / response.totalBytesExpectedToSend) * 100,
  //   );
  //   console.log('UPLOAD IS ' + percentage + '% DONE!');
  // };
  //
  // RNFS.uploadFiles({
  //   toUrl: url,
  //   files: files,
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     // 'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
  //     'Content-Type': 'multipart/form-data; boundary=gc0p4Jq0M2Yt08jU534c0p',
  //     // 'Content-Type': 'multipart/form-data',
  //     pinata_api_key: '4cd99bf33f054563a462',
  //     pinata_secret_api_key:
  //       '4fc0fde61c827ef9d163ac31d34e8e23b3bedfd87c468087abacf9450abd8609',
  //   },
  //   fields: {
  //     hello: 'world',
  //   },
  //   begin: uploadBegin,
  //   progress: uploadProgress,
  // })
  //   .promise.then(response => {
  //     if (response.statusCode == 200) {
  //       console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
  //     } else {
  //       console.log('SERVER ERROR', response);
  //     }
  //   })
  //   .catch(err => {
  //     if (err.description === 'cancelled') {
  //       // cancelled by user
  //     }
  //     console.log(err);
  //   });
}
