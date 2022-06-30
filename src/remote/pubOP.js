/**
 * Created on 18 May 2022 by lonmee
 *
 */

const pubIp = ['106.52.171.12', '13.213.41.31'];
const url = `http://${pubIp[0]}:10008/ssb/api/`;
const api = ['tipped-who-off', 'id2eth'];

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

/**
 *
 * @param params
 * {
 *  "client_id":"@C49GskstTGIrvYPqvTk+Vjyj23tD0wbCSkvX7A4zoHw=.ed25519",
 *  "client_eth_address":"0xce92bddda9de3806e4f4b55f47d20ea82973f2d7"
 * }
 * @param cb
 */
export function bindIDAndWallet(params, cb) {
  fetch(url + api[1], {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  }).then(r => cb(JSON.parse(r._bodyText).data));
}
