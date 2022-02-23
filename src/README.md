### at node_moudles
> add "var Buffer = require('buffer').Buffer;" to  
mode_modules/pull-rn-channel/index.js  
mode_modules/packet-stream-codec/index.js  
mode_modules/pull-reader/index.js  
mode_modules/pull-reader/state.js

* patch-package needed *

> add  
> serveBlobs: {
  port: 26834, //26835 / 3921
  },  
> to [`ssb.ts:45`](backend/ssb.ts)
### at Android
~~create folder named "rnos" under "node_modules/react-native-os-staltz/android/src/main/java/com/peel/react" and put RNOS.java / RNOSModule.java in it;
fault in "react-native-os-staltz" package;~~
