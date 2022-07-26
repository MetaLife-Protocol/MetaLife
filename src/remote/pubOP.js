/**
 * Created on 18 May 2022 by lonmee
 *
 */

import axios from 'axios';

const pubIp = ['106.52.171.12', '13.213.41.31'];
const port = ['10008'];
const url = `http://${pubIp[0]}:${port[0]}/ssb/api/`;
const url2 = `http://${pubIp[1]}:${port[0]}/ssb/api/`;
const api = ['tipped-who-off', 'id2eth', 'get-pubhost-by-ip'];

/**
 * Body:
 * {
 *     "plaintiff":"@C49GskstTGIrvYPqvTk+Vjyj23tD0wbCSkvX7A4zoHw=.ed25519",
 *     "defendant":"@Sg5b3BjZH8XWyJ7mGpH3txrDJmIQtSGxV6MbH6CgeCw=.ed25519",
 *     "messagekey":"%w5S3q0eVkTzcfpIKdIR3tJueFTMIOQP1lwcsQkhWSMs=.sha256",
 *     "reasons":"sex"
 * }
 * Response:
 * {
 *     "error_code": 0,
 *     "error_message": "SUCCESS",
 *     "data": "Success, the pub administrator will verify as soon as possible, thank you for your report👍"
 * }
 * @param params
 */
export function report(params, cb) {
  fetch(url + api[0], {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
    .then(r => cb(JSON.parse(r._bodyText).data))
    .catch(console.warn);
}

export function pubHostByIp() {
  return fetch(url + api[2]);
}

/**
 *
 * @param params
 * {
 *  "client_id":"@C49GskstTGIrvYPqvTk+Vjyj23tD0wbCSkvX7A4zoHw=.ed25519",
 *  "client_eth_address":"0xce92bddda9de3806e4f4b55f47d20ea82973f2d7"
 * }
 * @param cb
 */
export function bindIDAndWallet(ipAndPort, params, cb) {
  fetch('http://' + ipAndPort + '/ssb/api/' + api[1], {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
    .then(r => r.json().then(cb))
    .catch(console.warn);
}

export async function getPubsRewardList(params) {
  const config = {
    timeout: 3000,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let result = [];
  try {
    const pub1 = await axios.post(url + 'get-reward-info', params, config);
    if (pub1.status === 200 && pub1.data.error_code === 0) {
      result = result.concat(
        pub1.data.data
          .filter(it => it.grant_success === 'success')
          .map(it => {
            it.pub = 'MetaLife Planet 1';
            return it;
          }),
      );
    }
  } catch (e) {}
  try {
    const pub2 = await axios.post(url2 + 'get-reward-info', params, config);
    if (pub2.status === 200 && pub2.data.error_code === 0) {
      result = result.concat(
        pub2.data.data
          .filter(it => it.grant_success === 'success')
          .map(it => {
            it.pub = 'MetaLife Planet 2';
            return it;
          }),
      );
    }
  } catch (e) {}
  return result;
}
export async function getPubsRewardTotal(params) {
  const postParams = {
    ...params,
    grant_success: 'success',
  };
  const config = {
    timeout: 3000,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let result = [];
  try {
    const pub1 = await axios.post(
      url + 'get-reward-subtotals',
      postParams,
      config,
    );
    if (pub1.status === 200 && pub1.data.error_code === 0) {
      result = result.concat(pub1.data.data);
    }
  } catch (e) {}
  try {
    const pub2 = await axios.post(
      url2 + 'get-reward-subtotals',
      postParams,
      config,
    );
    if (pub2.status === 200 && pub2.data.error_code === 0) {
      result = result.concat(pub2.data.data);
    }
  } catch (e) {}

  return result;
}
