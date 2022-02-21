/* sync */
// global
import nodejs from 'nodejs-mobile-react-native';
import {makeClient} from './ssb/Client';

export let ssb = null;

const defaultCallBack = (e, v) => (e ? console.warn(e) : console.log(v));

export const status = cb =>
  ssb.status((e, v) => (e ? console.error(e) : cb(v)));
// conn
export const stage = cb =>
  ssb.conn.stage((e, v) => (e ? console.error(e) : cb(v)));
export const connStart = cb =>
  ssb.conn.start((e, v) => (e ? console.error(e) : cb(v)));
/* async */
export const block = (fid, opts, cb) => {
  ssb.friends.block(fid, opts, (e, v) => (e ? console.error(e) : cb(v)));
};
export const follow = (fid, opts, cb) => {
  ssb.friends.follow(fid, opts, (e, v) => (e ? console.error(e) : cb(v)));
};
export const isFollowing = (source, dest, cb) => {
  ssb.friends.isFollowing({source, dest}, cb);
};
export const connectPeer = (address, data, cb) =>
  ssb.conn.connect(address, data, (e, v) => (e ? console.error(e) : cb(v)));

/* source */
export const getStagedPeers = cb =>
  ssb.conn.stagedPeers()(null, (e, v) => (e ? console.error(e) : cb(v)));
export const getConnectedPeers = cb =>
  ssb.conn.peers()(null, (e, v) => (e ? console.error(e) : cb(v)));
export const blobsGetter = cb =>
  ssb.blobs.get()(null, (e, v) => (e ? console.error(e) : cb(v)));

/* about */
export const about = (fid, cb) =>
  ssb.aboutSelf.get(fid, (e, v) => (e ? console.error(e) : cb(v)));
export const setAbout = (fid, {name, description, imageUrl}, cb) =>
  ssb.aboutSelf.stream({
    id: fid,
    name,
    description,
    imageUrl,
  })(null, (e, v) => (e ? console.error(e) : cb(v)));

// profile
/*ssb.publishUtilsBack.publishAbout({type: 'about',
  about: "@XiFWjglNO9yTW3YPp1M6J6/46T4zBFh3RxeBlagpmAc=.ed25519",
  name:'.zZ',
  description:'bio',
  image: ''},(e,v)=>console.log(v))*/

// isFollowing
/*ssb.friends.isFollowing({source:"@XKv0b06yUZ30Va8RZAnijtMl3MdrDgHX677yTE6cFDY=.ed25519",dest:"@azYm7/Ae3TPvpQynRPsc+Wc8TbGOlQoiipfQfM6PIxQ=.ed25519"},(e,v)=>console.log(v))*/

// getMnemonic
// ssb.keysUtils.getMnemonic((e, v) => setOpLog(v + '\n'));

// invite
// ssb.invite.accept('106.52.171.12:8008:@eVs235wBX5aRoyUwWyZRbo9r1oZ9a7+V+wEvf+F/MCw=.ed25519~luAn8Yn38OzESHe8ZDhc5ZfRfswi1Ph+1EDuYVEVBgs=',(e,v)=>console.log(v))

/* duplex */
export const ping = ssb =>
  ssb.conn.ping()(null, (e, v) => (e ? console.error(e) : console.log(v)));

// ???
// ssb.deweird.source(['threads', 'publicSummary'],{})(null,(e, v)=>console.log(v))
export const graph = cb => ssb.friends.graph(cb);

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
  channel.post('identity', 'CREATE');
  // rn.send('RESTORE: word0 word1...');
  // channel.post('identity', 'RESTORE: word0 word1...');
};

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
  })(null, (e, v) =>
    e
      ? console.log(e ? "other's private msg?" : "what's msg?")
      : cb
      ? cb(v)
      : console.log(v),
  );
};

export const inviteAccept = (code, cb = null) => ssb.invite.accept(code, cb);
