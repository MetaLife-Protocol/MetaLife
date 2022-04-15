/**
 * Created on 02 Apr 2022 by lonmee
 */

import {addPrivateUpdatesListener, addPublicUpdatesListener} from './ssbOP';
import {markMsgCBByType} from '../store/MsgCB';
import {AppState} from 'react-native';
import {
  aboutHandler,
  appStateHandler,
  contactHandler,
  postHandler,
  privateHandler,
  publicHandler,
  voteHandler,
} from './SsbHandlers';

export function initializeHandlers() {
  console.log('add ssb listeners');
  /******** archive msg handlers ********/
  addPublicUpdatesListener(publicHandler);
  addPrivateUpdatesListener(privateHandler);
  /******** executable msg checker ********/
  markMsgCBByType('contact', contactHandler);
  markMsgCBByType('about', aboutHandler);
  markMsgCBByType('post', postHandler);
  markMsgCBByType('vote', voteHandler);
  /******** app state handlers ********/
  AppState.addEventListener('change', appStateHandler);
}
