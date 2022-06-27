/**
 * Created on 02 Apr 2022 by lonmee
 */

import {addPrivateUpdatesListener, addPublicUpdatesListener} from './ssbOP';
import {markMsgCBByType} from '../../store/MsgCB';
import {AppState} from 'react-native';
import {
  aboutHandler,
  appStateHandler,
  contactHandler,
  populateHandlers,
  postHandler,
  privateHandler,
  pubHandler,
  publicHandler,
  voteHandler,
} from './SsbHandlers';

export function initializeHandlers(store) {
  console.log('initialize ssb listeners');
  populateHandlers(store);
  /******** archive msg handlers ********/
  addPublicUpdatesListener(publicHandler);
  addPrivateUpdatesListener(privateHandler);
  /******** executable msg checker ********/
  markMsgCBByType('contact', contactHandler);
  markMsgCBByType('about', aboutHandler);
  markMsgCBByType('post', postHandler);
  markMsgCBByType('vote', voteHandler);
  markMsgCBByType('pub', pubHandler);
  /******** app state handlers ********/
  AppState.addEventListener('change', appStateHandler);
}
