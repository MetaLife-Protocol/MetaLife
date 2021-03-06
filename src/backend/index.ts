// SPDX-FileCopyrightText: 2018-2022 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import identity = require('./identity');
const {restore, migrate} = identity;
import startSSB = require('./ssb');

interface Channel {
  addListener(type: string, fn: (msg: string) => void): void;
  post(type: string, msg: string): void;
}
let channel: Channel;

// Setup Channel
const rnBridge = require('rn-bridge');
channel = {
  addListener(type, fn) {
    rnBridge.channel.on(type, fn);
  },
  post(type, msg) {
    rnBridge.channel.post(type, msg);
  },
};

// Setup initial communication with the frontend, to create or restore identity
let startedSSB = false;
channel.addListener('identity', request => {
  if (startedSSB) {
    return;
  }
  let response: string;
  if (request === 'CREATE') {
    startedSSB = true;
    startSSB(true);
    response = 'IDENTITY_READY';
  } else if (request === 'USE') {
    startedSSB = true;
    startSSB(false);
    response = 'IDENTITY_READY';
  } else if (request.startsWith('RESTORE:')) {
    const words = request.split('RESTORE: ')[1].trim();
    response = restore(words);
    if (response === 'IDENTITY_READY') {
      startedSSB = true;
      startSSB(false);
    }
  } else if (request === 'MIGRATE') {
    migrate(() => {
      startedSSB = true;
      startSSB(false);
    });
    response = 'IDENTITY_READY';
  } else {
    return;
  }
  channel.post('identity', response);
});
