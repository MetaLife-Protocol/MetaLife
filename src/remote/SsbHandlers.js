/**
 * Created on 02 Apr 2022 by lonmee
 */

import {addPrivateUpdatesListener, addPublicUpdatesListener} from './ssbOP';
import {markMsgCBByType} from '../store/MsgCB';
import {AppState} from 'react-native';
import {
  aboutHandler,
  appStateChangeHandler,
  contactHandler,
  postHandler,
  privateUpdateHandler,
  publicUpdateHandler,
  voteHandler,
} from './SsbListeners';

export function initializeHandlers() {
  console.log('add ssb listeners');
  /******** msg handlers ********/
  addPublicUpdatesListener(publicUpdateHandler);
  addPrivateUpdatesListener(privateUpdateHandler);
  /******** msg checker ********/
  markMsgCBByType('contact', contactHandler);
  markMsgCBByType('about', aboutHandler);
  markMsgCBByType('vote', voteHandler);
  markMsgCBByType('post', postHandler);
  /******** app state handlers ********/
  AppState.addEventListener('change', appStateChangeHandler);
}
