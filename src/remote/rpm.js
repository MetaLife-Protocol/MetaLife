/**
 * Created on 09 May 2022 by lonmee
 *
 */

export function fetchImg(params, cb) {
  fetch('https://render.readyplayer.me/render', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  }).then(function (res) {
    cb && cb(res);
  });
}

export function XHRImg(params, cb) {
  const http = new XMLHttpRequest();
  http.open('POST', 'https://render.readyplayer.me/render');
  http.setRequestHeader('Content-type', 'application/json');
  http.send(JSON.stringify(params));
  http.onload = function () {
    cb & cb(http.responseText);
  };
}
