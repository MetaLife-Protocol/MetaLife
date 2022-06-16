'use strict';

/**
 * @Author: lq
 * @Date: 2022-05-16
 * @Project:MetaLife
 */

import axios from 'axios';
import FormData from 'form-data';
import Toast from 'react-native-tiny-toast';

export function initNFT({privateKey, address}) {
  // const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
}

export function initIPFS() {
  // const ipfsClient = createIpfsHttpClient(HTTP_CLIENT_URL);
  // console.log('ipfsClient:::', ipfsClient);
}

export async function uploadFileToIFPS({
  filepath = '',
  fileType = 'audio/x-m4a',
  fileName = '',
}) {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  let data = new FormData();
  // data.append('file', stream, {
  //   filepath: encodeURIComponent(filepath),
  // });
  data.append(
    'file',
    {uri: filepath, name: fileName, type: fileType},
    {
      filepath: encodeURIComponent(filepath),
    },
  );
  const response = await axios.post(url, data, {
    maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
    headers: {
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYzc1YjdhNC1lZmNkLTQ4YjktYTliMy0yNTFmMDNiMjM2MjUiLCJlbWFpbCI6InNpaWlpQHFxLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJmZDg3ZWNmYzQxNmE0YTJmZDRjNiIsInNjb3BlZEtleVNlY3JldCI6ImMwOGQxNTEzOTgxYjA1MTYwNGVkNzNiNDI0YjA0ZTBkNWMxODA4ODkyZWFiMjkwYTRlMTJlMmYzMzEyMGZmOGUiLCJpYXQiOjE2NTUxMDY4NjR9.Irl4yggoBx5KYdCVaglXqwTpbAe6OmZqR3nHByUBhKs',
      // pinata_api_key: '5f0a6920de1814671e86',
      // pinata_secret_api_key:
      //   '2415964ec8a4ee1495d7bbb3f3b5551f92a06d6b6bf1a749e11f70849211a9c7',
    },
  });
  // .then(function (response) {
  //handle response here
  // console.log('SERVER response:', response);
  if (response.status === 200) {
    return response.data;
  }
  // })
  // .catch(function (error) {
  //   console.log('SERVER ERROR:', error);
  //   //handle error here
  // });
}
