import nodejs from 'nodejs-mobile-react-native';
import {makeClient} from './Client';

let ssb = window.ssb;

export const status = cb =>
  ssb.status((e, v) => (e ? console.error(e) : cb(v)));

/************************** ssb **************************/
export const replicationSchedulerStart = cb =>
  ssb.replicationScheduler.start((e, v) => (e ? console.error(e) : cb(v)));

export const suggestStart = cb =>
  ssb.suggest.start((e, v) => (e ? console.error(e) : cb(v)));

/************************** conn **************************/
export const stage = cb =>
  ssb.conn.stage((e, v) => (e ? console.error(e) : cb(v)));

export const connStart = cb =>
  ssb.conn.start((e, v) => (e ? console.error(e) : cb(v)));

export const bluetoothSearch = (interval, cb) =>
  ssb.bluetooth.makeDeviceDiscoverable(interval, (e, v) => {
    console.log('bluetoothSearch error', e);
    console.log('bluetoothSearch result', v);

    e ? console.error(e) : cb(v);
  });

export const connectPeer = (address, data = {}, cb = null) =>
  ssb.conn.connect(address, data, (e, v) =>
    e ? console.error(e) : cb && cb(v),
  );

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

export const getStagedPeers = cb =>
  ssb.conn.stagedPeers()(null, (e, v) => (e ? console.error(e) : cb(v)));

export const getConnectedPeers = cb =>
  ssb.conn.peers()(null, (e, v) => (e ? console.error(e) : cb(v)));

export const blobsGetter = (blobId, cb) =>
  ssb.blobs.get(blobId)(null, (e, v) => (e ? console.error(e) : cb(v)));

export const blobsSetter = (path, cb) =>
  ssb.blobsUtils.addFromPath(path, (e, v) => (e ? console.error(e) : cb(v)));

export const ping = cb =>
  ssb.conn.ping()(null, (e, v) => (e ? console.error(e) : cb && cb(v)));

/************************** friends **************************/
export const block = (fid, opts, cb) => {
  ssb.friends.block(fid, opts, (e, v) => (e ? console.error(e) : cb(v)));
};

export const follow = (fid, opts, cb) => {
  ssb.friends.follow(fid, opts, (e, v) => (e ? console.error(e) : cb(v)));
};

// ssb.deweird.source(['threads', 'publicSummary'],{})(null,(e, v)=>console.guid(v))
// ssb.friends.hopStream({old:true, live:true})(null, console.guid)
// ssb.friends.graphStream({ old: true, live: true })(null,console.guid)
export const graph = cb =>
  ssb.friends.graph((e, v) => (e ? console.error(e) : cb(v)));

export const getHops = (hop = 1, cb = null) =>
  ssb.friends.hops({start: ssb.id, reverse: true, max: hop}, (e, v) =>
    e ? console.log(e) : cb(v),
  );

/************************** profile & about **************************/
export const getProfile = (fid, cb) =>
  ssb.aboutSelf.get(fid, (e, v) => (e ? console.error(e) : cb(v)));
export const setAbout = (fid, {name, description, image}, cb) =>
  ssb.publishUtilsBack.publishAbout(
    {type: 'about', about: fid, name, description, image},
    (e, v) => (e ? console.error(e) : cb(v)),
  );
export const setAvatar = (fid, {name, description, image, avatar}, cb) =>
  ssb.publish(
    {type: 'about', about: fid, name, description, image, avatar},
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

/************************** mnemonic **************************/
export const getMnemonic = cb =>
  ssb.keysUtils.getMnemonic((e, v) => (e ? console.warn(e) : cb(v)));

/************************** invite **************************/
export const inviteAccept = (code, cb = null) => ssb.invite.accept(code, cb);

/************************** initialize **************************/
export const reqStartSSB = setInstance => {
  const {channel} = nodejs;
  channel.addListener(
    'identity',
    msg =>
      msg === 'IDENTITY_READY' &&
      makeClient()
        .then(value => setInstance((ssb = value)))
        .catch(error => console.error('ssb start error: ' + error)),
  );
};

/************************** listeners **************************/
export const addPublicUpdatesListener = cb => {
  ssb.threads.publicUpdates({
    reverse: true,
    includeSelf: true,
  })(null, (e, v) => {
    if (e) {
      console.warn('add public updates listener error:', e);
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

/************************** publish **************************/
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

/************************** retrieve **************************/
// id相关的消息
// ssb.threads.profileSummary({id:'@AvWTlEvVCO5uL+FYRPnIaFCbeAjpPltJlfSgzbitQjI=.ed25519',reverse:false})(null, console.guid)

// 拉取最新的一条公共
export const loadPublic = cb =>
  ssb.threads.public({reverse: true, threadMaxSize: 10})(null, (e, v) =>
    e ? console.warn(e) : cb && cb(v),
  );

export const loadMsg = (msgKey, isPrivate = false, cb = null) => {
  ssb.threads.thread({
    root: msgKey,
    private: isPrivate,
    threadMaxSize: isPrivate ? Infinity : 0,
  })(null, cb);
};

export const voted = (key, cb) => ssb.votes.voterStream(key)(null, cb);

// last feed
export const profileFeed = (id, cb) => ssb.threads.profile({id})(null, cb);

/************************** DB **************************/
export const indexingProgress = () =>
  new Promise((resolve, reject) =>
    ssb.db.indexingProgress()(null, (e, v) => (e ? reject(e) : resolve(v))),
  );
export const migrationProgress = () =>
  new Promise((resolve, reject) =>
    ssb.db2migrate.progress()(null, (e, v) => (e ? reject(e) : resolve(v))),
  );

export const ebtRequest = id =>
  ssb.ebt.request(id, true, null, e => e && console.error(e.message || e));

export const resyncProgress = () =>
  new Promise((resolve, reject) =>
    ssb.resyncUtils.progress()(null, (e, v) => (e ? reject(e) : resolve(v))),
  );

export const enableFirewall = () =>
  ssb.resyncUtils.enableFirewall(e => e && console.error(e.message || e));

// ssb.db2migrate.start(console.guid);
// ssb.db2migrate.stop(console.guid);

/************************** preset **************************/
export const foo = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve('resolved'), 1000);
  });
