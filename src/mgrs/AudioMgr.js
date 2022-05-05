/**
 * Created on 05 May 2022 by lonmee
 *
 */
import SoundPlayer from 'react-native-sound-player';

let curUrl;
let cb;

SoundPlayer.addEventListener('FinishedLoadingURL', console.log);
SoundPlayer.addEventListener('FinishedPlaying', data => {
  console.log(data);
  cb && cb();
});

function play(url, callback) {
  curUrl && stop();
  curUrl = url;
  cb = callback;
  SoundPlayer.playUrl(url);
}

function stop() {
  if (curUrl) {
    SoundPlayer.stop();
    cb && cb();
    curUrl = cb = null;
  }
}

export {play, stop};
