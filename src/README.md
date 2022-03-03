### at node_moudles
> add "var Buffer = require('buffer').Buffer;" to  
mode_modules/pull-rn-channel/index.js  
mode_modules/packet-stream-codec/index.js  
mode_modules/pull-reader/index.js  
mode_modules/pull-reader/state.js

* patch-package needed *

> change port on serve-blob  
> add  
> serveBlobs: {
  port: 26834, //26835 / 3921
  },  
> to [`ssb.ts:46`](backend/ssb.ts)  
> fix 26835 to 26834  
> at [`port.js:1`](node_modules/ssb-serve-blobs/port.js)
