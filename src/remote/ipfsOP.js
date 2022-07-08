import FormData from 'form-data';
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
const ipfsBaseURL = `https://${gateways}/ipfs/`;

export function getNftAssetsJson(cid) {
  fetch(ipfsBaseURL + cid, {
    maxBodyLength: 'Infinity',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(r => console.log);
}
