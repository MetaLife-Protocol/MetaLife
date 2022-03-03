import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import React from 'react';
import App from './src/App';
import {persistor, store} from './src/store/configureStore';
import {PersistGate} from 'redux-persist/integration/react';
import nodejs from 'nodejs-mobile-react-native';

setTimeout(() => {
  nodejs.start('loader.js');
  nodejs.channel.addListener('exception', console.warn);
  nodejs.channel.addListener('log4RN', console.warn);
}, 1);

const WrappedApp = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => WrappedApp);
