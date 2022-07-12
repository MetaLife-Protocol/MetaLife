import axios from 'axios';

/**
 * Created on 06 Jul 2022 by lonmee
 *
 * API Key: c679b843a650d97ee74c
 * API Secret: efb62a23260601916bac242b794031a852dfe4f0324e2780933c754fb7cb97e7
 * JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4MzVjNGJmNS1hY2UzLTQ1ODgtODEyYS1mMTc1NTc0MzIwODMiLCJlbWFpbCI6ImhlbnJ5QHNtYXJ0bWVzaC5pbyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjNjc5Yjg0M2E2NTBkOTdlZTc0YyIsInNjb3BlZEtleVNlY3JldCI6ImVmYjYyYTIzMjYwNjAxOTE2YmFjMjQyYjc5NDAzMWE4NTJkZmU0ZjAzMjRlMjc4MDkzM2M3NTRmYjdjYjk3ZTciLCJpYXQiOjE2NTY1NjU0MzF9.5fm8vAbpsLF4-eNpCZW_gRV42eANUykBACF-p9PkYUU
 *
 * ipfs:
 * https://app.pinata.cloud/pinmanager login
 * https://www.pinata.cloud/
 * https://medium.com/pinata/host-your-opensea-nft-collection-on-squarespace-with-pinata-3cb16413aebf
 * https://docs.pinata.cloud/gateways/ipfs-gateway-tools
 */

const gateways = 'metalife.mypinata.cloud';
export const ipfsBaseURL = `https://${gateways}/ipfs/`;

export function getNftAssetsJson(uri) {
  const cid = uri.split('/').pop();
  return axios.get(ipfsBaseURL + cid, {
    maxBodyLength: 'Infinity', //this is needed to prevent axios from error out with large files
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4MzVjNGJmNS1hY2UzLTQ1ODgtODEyYS1mMTc1NTc0MzIwODMiLCJlbWFpbCI6ImhlbnJ5QHNtYXJ0bWVzaC5pbyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjNjc5Yjg0M2E2NTBkOTdlZTc0YyIsInNjb3BlZEtleVNlY3JldCI6ImVmYjYyYTIzMjYwNjAxOTE2YmFjMjQyYjc5NDAzMWE4NTJkZmU0ZjAzMjRlMjc4MDkzM2M3NTRmYjdjYjk3ZTciLCJpYXQiOjE2NTY1NjU0MzF9.5fm8vAbpsLF4-eNpCZW_gRV42eANUykBACF-p9PkYUU',
    },
  });
}

/**
 * e.g. https://metalife.mypinata.cloud/ipfs/bafkreigtmwt6s7uetx7qjv3th3xb5lzc5v6ssolqvjuwauo2ftd3hf2hna
 * @param cid
 * @returns {Promise<Response>}
 */
export const getNftAssets = cid => fetch(ipfsBaseURL + cid);
export const getNftAssetsUri = uri => fetch(ipfsBaseURL + uri);

export async function getList(uri, cb) {
  // let responst = await fetch(uri, {method: 'GET'})
  //   .then(response => response.json())
  //   .then(responseJson => {
  //     cb && cb(responseJson);
  //   });
  try {
    let response = await fetch(uri, {method: 'GET'});
    console.log('res2', response);
    let responseJson = await response.json();
    console.log('res1', responseJson);
    return responseJson;
  } catch (error) {
    console.log('error1', error);
  }
}
