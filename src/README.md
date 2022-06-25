> ### (patched) ~~add "var Buffer = require('buffer').Buffer;" to~~ 
>> mode_modules/pull-rn-channel/index.js  
>> mode_modules/packet-stream-codec/index.js  
>> mode_modules/pull-reader/index.js  
>> mode_modules/pull-reader/state.js

> ### install RN dev env
>> brew install nvm  
>> nvm install 12.19.0  
>> brew tap homebrew/cask-versions  
>> brew install --cask zulu11 react-native-debugger (npm install --save-dev react-devtools@4.14.0 react-devtools-core@4.14.0)  
>> brew install watchman
>
> ### install android sdk
> #### install `command-line tools` first
> and add export to zshrc
>> export ANDROID_HOME=$HOME/Library/Android/sdk  
>> export PATH=$PATH:$ANDROID_HOME/emulator   
>> export PATH=$PATH:$ANDROID_HOME/tools  
>> export PATH=$PATH:$ANDROID_HOME/tools/bin  
>> export PATH=$PATH:$ANDROID_HOME/platform-tools  
>> export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

>> sdkmanager 'build-tools;28.0.3' 'cmake;3.6.4111459' 'ndk;21.4.7075529' 'platforms;android-29' 'tools'

> ### install compile tools
>> brew install coreutils libtool autoconf automake
>
> ### add Env variable
>> `# nodejs-mobile-react-native for android`  
>> export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/21.4.7075529

> ### (patched) ~~resolve port conflict~~
> #### change port on serve-blob
>> - add `serveBlobs: {
     port: 26834
     }`, to [`ssb.ts:46`](backend/ssb.ts)
>
>> - fix
     `26835 to 26834` at [`port.js:1`](node_modules/ssb-serve-blobs/port.js)
> ### keep 8081 debug port on android
> `adb reverse tcp:8081 tcp:8081`
 
> ### pod repos 
>> https://mirrors.tuna.tsinghua.edu.cn/help/CocoaPods/
> ### local registry 
>> git clone git@github.com:MetaLife-Protocol/react-native-metalife-storage.git  
>> npm i react-native-metalife-storage --registry=https://github.com/MetaLife-Protocol/react-native-metalife-storage.git
