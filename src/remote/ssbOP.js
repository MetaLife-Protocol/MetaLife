// import nodejs from 'nodejs-mobile-react-native';
import {makeClient} from './ssb/Client';

export let ssb = window.ssb;

export const status = cb =>
  ssb.status((e, v) => (e ? console.error(e) : cb(v)));
// conn
export const stage = cb =>
  ssb.conn.stage((e, v) => (e ? console.error(e) : cb(v)));
export const connStart = cb =>
  ssb.conn.start((e, v) => (e ? console.error(e) : cb(v)));
//
export const replicationSchedulerStart = cb =>
  ssb.replicationScheduler.start((e, v) => (e ? console.error(e) : cb(v)));
export const suggestStart = cb =>
  ssb.suggest.start((e, v) => (e ? console.error(e) : cb(v)));
/* async */
export const block = (fid, opts, cb) => {
  ssb.friends.block(fid, opts, (e, v) => (e ? console.error(e) : cb(v)));
};
export const follow = (fid, opts, cb) => {
  ssb.friends.follow(fid, opts, (e, v) => (e ? console.error(e) : cb(v)));
};
export const connectPeer = (address, data = {}, cb = null) =>
  ssb.conn.connect(address, data, (e, v) => (e ? console.error(e) : cb(v)));

export const persistentConnectPeer = (address, data, cb) =>
  ssb.connUtils.persistentConnect(address, data, (e, v) =>
    e ? console.error(e) : cb && cb(v),
  );

export const disconnectPeer = (address, cb) =>
  ssb.connUtils.persistentDisconnect(address, (e, v) =>
    e ? console.error(e) : cb && cb(v),
  );

export const rememberPeer = (address, data, cb) =>
  ssb.conn.remember(address, data, (e, v) => (e ? console.error(e) : cb(v)));

export const forgetPeer = (address, cb) =>
  ssb.conn.forget(address, (e, v) => (e ? console.error(e) : cb(v)));

/* source */
export const getStagedPeers = cb =>
  ssb.conn.stagedPeers()(null, (e, v) => (e ? console.error(e) : cb(v)));
export const getConnectedPeers = cb =>
  ssb.conn.peers()(null, (e, v) => (e ? console.error(e) : cb(v)));
export const blobsGetter = (blobId, cb) =>
  ssb.blobs.get(blobId)(null, (e, v) => (e ? console.error(e) : cb(v)));

/* profile / about */
export const getProfile = (fid, cb) =>
  ssb.aboutSelf.get(fid, (e, v) => (e ? console.error(e) : cb(v)));
export const setAbout = (fid, {name, description, image}, cb) =>
  ssb.publishUtilsBack.publishAbout(
    {type: 'about', about: fid, name, description, image},
    (e, v) => (e ? console.error(e) : cb(v)),
  );

// isFollowing
export const isFollowing = (source, dest, cb = null) =>
  ssb.friends.isFollowing(
    {
      source,
      dest,
    },
    (e, v) => (e ? console.warn(e) : cb && cb(v)),
  );

// getMnemonic
export const getMnemonic = cb =>
  ssb.keysUtils.getMnemonic((e, v) => (e ? console.warn(e) : cb(v)));

// invite
/**
 * 106.52.171.12:8008:@eVs235wBX5aRoyUwWyZRbo9r1oZ9a7+V+wEvf+F/MCw=.ed25519~XOpv/D1TnStp6uLgVvOY2qsmuc9TUyrpuq/C0v3V4kw=
 * 18.136.101.14:8008:@zDQg3H5QxUNnfPv2dDH03jCl6Az7A9iNBi57zOIP9R4=.ed25519~CLz9rH2fGe0lCR3O0IICUbtFO9BPUHnX+HkTY0Dv9Uc=
 * @param code
 * @param cb
 * @returns {*}
 */
export const inviteAccept = (code, cb = null) => ssb.invite.accept(code, cb);

/* duplex */
export const ping = cb =>
  ssb.conn.ping()(null, (e, v) => (e ? console.error(e) : cb && cb(v)));

// ssb.deweird.source(['threads', 'publicSummary'],{})(null,(e, v)=>console.log(v))
// ssb.friends.hopStream({old:true, live:true})(null, console.log)
// ssb.friends.graphStream({ old: true, live: true })(null,console.log)
export const graph = cb =>
  ssb.friends.graph((e, v) => (e ? console.error(e) : cb(v)));
export const getHops = (hop = 1, cb = null) =>
  ssb.friends.hops({start: ssb.id, reverse: true, max: hop}, (e, v) =>
    e ? console.log(e) : cb(v),
  );

// export const reqStartSSB = setInstance => {
//   const {channel} = nodejs;
//   channel.addListener(
//     'identity',
//     msg =>
//       msg === 'IDENTITY_READY' &&
//       makeClient()
//         .then(value => setInstance((ssb = value)))
//         .catch(error => console.error('ssb start error: ' + error)),
//   );
//   channel.post('identity', 'CREATE');
//   // rn.send('RESTORE: word0 word1...');
//   // channel.post('identity', 'RESTORE: word0 word1...');
// };

export const addPublicUpdatesListener = cb => {
  ssb.threads.publicUpdates({
    reverse: true,
    includeSelf: true,
  })(null, (e, v) => {
    if (e) {
      console.log('add public updates listener error:', e);
    } else {
      console.log('public msg update with: ', v);
      cb && cb(v);
      addPublicUpdatesListener(cb);
    }
  });
};

export const addPrivateUpdatesListener = cb => {
  ssb.threads.privateUpdates({
    includeSelf: true,
  })(null, (e, v) => {
    if (e) {
      console.log('add private updates listener error:', e);
    } else {
      console.log('private msg update with: ', v);
      cb && cb(v);
      addPrivateUpdatesListener(cb);
    }
  });
};

export const sendMsg = (opt, cb = null) => {
  ssb.publish(opt, (e, v) => {
    if (e) {
      console.warn('send message error: ', e);
    } else {
      console.log((opt.recps ? 'private' : 'public') + ' msg sent:', v);
      cb && cb(v);
    }
  });
};

export const loadMsg = (msgKey, isPrivate = false, cb = null) => {
  ssb.threads.thread({
    root: msgKey,
    private: isPrivate,
  })(null, (e, v) => (e ? console.log(e) : cb ? cb(v) : console.log(v)));
};
