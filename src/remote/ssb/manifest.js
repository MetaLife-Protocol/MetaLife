/**
 * Created on 09 Dec 2021 by lonmee
 */
// https://github.com/ssb-js/secret-stack
// https://github.com/ssb-js/multiserver
// https://github.com/staltz/react-native-ssb-client
// https://github.com/pull-stream/pull-stream
export default {
  // https://github.com/ssb-ngi-pointer/ssb-db2
  auth: 'async',
  address: 'sync',
  manifest: 'sync',
  get: 'async',
  createFeedStream: 'source',
  createLogStream: 'source',
  messagesByType: 'source',
  createHistoryStream: 'source',
  createUserStream: 'source',
  links: 'source',
  relatedMessages: 'async',
  add: 'async',
  publish: 'async',
  getAddress: 'sync',
  getLatest: 'async',
  latest: 'source',
  latestSequence: 'async',
  status: 'sync',
  progress: 'sync',
  whoami: 'sync',
  usage: 'sync',

  // SSB SERVER
  plugins: {
    install: 'source',
    uninstall: 'source',
    enable: 'async',
    disable: 'async',
  },
  // https://github.com/ssbc/ssb-invite
  invite: {
    create: 'async',
    accept: 'async',
    use: 'async',
  },
  block: {
    isBlocked: 'sync',
  },

  db: {
    indexingProgress: 'source',
  },
  db2migrate: {
    start: 'sync',
    stop: 'sync',
    progress: 'source',
  },

  // Third-party
  deweirdProducer: {
    start: 'async',
    more: 'async',
    close: 'async',
  },
  //read: https://github.com/ssbc/ssb-friends
  friends: {
    isFollowing: 'async',
    isBlocking: 'async',
    follow: 'async',
    block: 'async',
    hops: 'async',
    hopStream: 'source',
    graph: 'async',
    graphStream: 'source',
  },
  ebt: {
    replicate: 'duplex',
    replicateFormat: 'duplex',
    request: 'sync',
    block: 'sync',
    peerStatus: 'sync',
    clock: 'async',
  },
  replicationScheduler: {
    start: 'sync',
    reconfigure: 'sync',
  },
  //read: no reference https://github.com/ssbc/ssb-server/tree/99fad7c5f6e436cbd670346b4da20c57222a1419/plugins/blobs
  blobs: {
    get: 'source',
    getSlice: 'source',
    add: 'sink',
    rm: 'async',
    ls: 'source',
    has: 'async',
    size: 'async',
    meta: 'async',
    want: 'async',
    push: 'async',
    changes: 'source',
    createWants: 'source',
  },
  //read: https://github.com/staltz/ssb-blobs-purge
  blobsPurge: {
    start: 'sync',
    stop: 'sync',
    changes: 'source',
  },
  //read: https://github.com/ssbc/ssb-threads
  private: {
    publish: 'async',
    unbox: 'sync',
    read: 'source',
  },
  //read: https://github.com/ssb-ngi-pointer/ssb-db2
  aboutSelf: {
    get: 'async',
    stream: 'source',
  },
  suggest: {
    start: 'sync',
    profile: 'async',
  },
  query: {
    read: 'source',
  },
  //read: https://github.com/ssbc/ssb-threads
  threads: {
    public: 'source',
    publicSummary: 'source',
    publicUpdates: 'source',
    hashtagSummary: 'source',
    private: 'source',
    privateUpdates: 'source',
    profile: 'source',
    profileSummary: 'source',
    thread: 'source',
    threadUpdates: 'source',
  },
  bluetooth: {
    nearbyScuttlebuttDevices: 'source',
    bluetoothScanState: 'source',
    makeDeviceDiscoverable: 'async',
    isEnabled: 'async',
  },
  //read: https://github.com/staltz/ssb-conn
  conn: {
    remember: 'sync',
    forget: 'sync',
    dbPeers: 'sync',
    connect: 'async',
    disconnect: 'async',
    peers: 'source',
    stage: 'sync',
    unstage: 'sync',
    stagedPeers: 'source',
    start: 'sync',
    stop: 'sync',
    ping: 'duplex',
  },
  connFirewall: {
    attempts: 'source',
  },
  roomClient: {
    consumeAliasUri: 'async',
    registerAlias: 'async',
    revokeAlias: 'async',
  },
  httpAuthClient: {
    produceSignInWebUrl: 'async',
    consumeSignInSsbUri: 'async',
    invalidateAllSessions: 'async',
  },
  httpInviteClient: {
    claim: 'async',
  },
  tunnel: {
    announce: 'sync',
    leave: 'sync',
    isRoom: 'async',
    connect: 'duplex',
    endpoints: 'source',
    ping: 'sync',
  },

  // This project's plugins
  blobsUtils: {
    addFromPath: 'async',
  },
  aliasUtils: {
    get: 'async',
    stream: 'source',
  },
  connUtils: {
    persistentConnect: 'async',
    persistentDisconnect: 'async',
    peers: 'source',
    stagedPeers: 'source',
  },
  dbUtils: {
    rawLogReversed: 'source',
    mentionsMe: 'source',
    postsCount: 'async',
    preferredReactions: 'source',
    selfPublicRoots: 'source',
    selfPublicReplies: 'source',
    selfPrivateRootIdsLive: 'source',
    exitReadOnlyMode: 'async',
  },
  publishUtilsBack: {
    publish: 'async',
    publishAbout: 'async',
  },
  keysUtils: {
    getMnemonic: 'sync',
  },
  searchUtils: {
    query: 'source',
  },
  settingsUtils: {
    read: 'sync',
    updateHops: 'sync',
    updateBlobsPurge: 'sync',
    updateShowFollows: 'sync',
    updateDetailedLogs: 'sync',
    updateAllowCheckingNewVersion: 'sync',
  },
  resyncUtils: {
    progress: 'source',
    enableFirewall: 'sync',
  },
  syncing: {
    migrating: 'source',
    indexing: 'source',
  },
  votes: {
    voterStream: 'source',
  },
};
