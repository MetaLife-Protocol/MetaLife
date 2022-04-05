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
  setStore,
  voteHandler,
} from './SsbListeners';

export function initializeHandlers(store) {
  setStore(store);
  console.log('add ssb listeners');
  /******** archive msg handlers ********/
  addPublicUpdatesListener(publicUpdateHandler);
  addPrivateUpdatesListener(privateUpdateHandler);
  /******** executable msg checker ********/
  markMsgCBByType('contact', contactHandler);
  markMsgCBByType('about', aboutHandler);
  markMsgCBByType('vote', voteHandler);
  markMsgCBByType('post', postHandler);
  /******** app state handlers ********/
  AppState.addEventListener('change', appStateChangeHandler);
}