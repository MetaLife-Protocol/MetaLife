import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import React from 'react';
import App from './src/App';
import {persistor, store} from './src/store/configureStore';
import {PersistGate} from 'redux-persist/integration/react';
import nodejs from 'nodejs-mobile-react-native';
import {Dialog} from './src/metalife-base';

process.nextTick = process.nextTick || setImmediate;

setTimeout(() => {
  const {start, channel} = nodejs;
  channel.addListener('exception', console.warn);
  channel.addListener('log4RN', console.log);
  start('loader.js');
}, 1);

const WrappedApp = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Dialog>
          <App />
        </Dialog>
      </PersistGate>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => WrappedApp);
