'use strict';

/**
 * @Author: lq
 * @Date: 2022-05-16
 * @Project:MetaLife
 */

import axios from 'axios';
import FormData from 'form-data';
import Toast from 'react-native-tiny-toast';
import {getSignerContract} from 'react-native-web3-wallet';
import {erc20ABI} from '../../remote/wallet/App';

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

// getSignerContract(
//   'https://jsonapi1.smartmesh.io/',
//   '0xa27f8f580c01db0682ce185209ffb84121a2f711',
//   erc20ABI,
//   JSON.stringify(keystore),
//   'qwerty',
// )
//   .then(contract => {
//     contract
//       .balanceOf('0x6025B091C6AB619F8e2F75170EB69dc57040dc6e')
//       .then(res => {
//         console.log(bigNumberFormatUnits(res));
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   })
//   .catch(err => {
//     console.log(err);
//   });
let contractSingle;
export function initNFTContract(keystore) {
  getSignerContract(
    'https://jsonapi1.smartmesh.io/',
    '0xa27f8f580c01db0682ce185209ffb84121a2f711',
    erc20ABI,
    JSON.stringify(keystore),
    '123456',
  )
    .then(contract => {
      console.log('contract:::', contract);
      contractSingle = contract;
      // contract
      //   .balanceOf('0x6025B091C6AB619F8e2F75170EB69dc57040dc6e')
      //   .then(res => {
      //     console.log(bigNumberFormatUnits(res));
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    })
    .catch(e => {
      console.warn('err:::', e);
    });
}

// 创建集合
// 接口：` metaMaster -> createCollection(string, string, string, uint, string, address, uint)`
// 权限：public
// 参数：
//  -string: collection name
// -string: collection symbol
// -string: collection baseURI: 原来代码此处写死https://gateway.pinata.cloud/ipfs/  ？
//   -uint: 最大供应量，不能超过uint96
// -string: collection的描述信息，可以是描述，也可以是logo图片地址
// -address: 接收版权费的地址
// -uint: 版权费率，单位是BP基点，2.5%即为250
// 创建后会返回一个地址，即为创建的collection地址，可以按用户查询collection接口获取其地址。

export function createCollection({
  name,
  symbol,
  baseURI, //ipfsId
  maxNum,
  logo,
  address,
  ratio = 250,
}) {
  console.log('contractSingle::', contractSingle);
  // if (contractSingle) {
  //   contractSingle
  //     .createCollection(name, symbol, baseURI, maxNum, logo, address, ratio)
  //     .then(res => {
  //       console.log('createCollection:::', res);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }
}
