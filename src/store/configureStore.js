import reducer from './reducers/Reducer';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import I18n from 'react-native-i18n';
import {populateStyles} from '../shared/UseSchemaStyles';
import {configureStore} from '@reduxjs/toolkit';
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from 'redux-persist';
import {useStore} from 'react-redux';

/**
 * use default reconciler - autoMergeLevel1
 * Created on 11 Nov 2021 by lonmee
 */
const persistConfig = {
  key: 'root',
  keyPrefix: '', // the redux-persist default is `persist:` which doesn't work with some file systems
  storage: AsyncStorage,
  blacklist: ['runtime'],
};
let middleware = getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
    // serializableCheck: {
    //   // Ignore these action types
    //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    //   // Ignore these field paths in all actions
    //   ignoredActionPaths: [],
    //   // Ignore these paths in the state
    //   ignoredPaths: [],
    // },
    thunk: false,
    immutableCheck: false,
  });
if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middleware = getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      // serializableCheck: {
      //   // Ignore these action types
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      //   // Ignore these field paths in all actions
      //   ignoredActionPaths: [],
      //   // Ignore these paths in the state
      //   ignoredPaths: [],
      // },
      thunk: false,
      immutableCheck: false,
    }).concat(createDebugger());
}

export const store = configureStore({
  reducer: persistReducer(persistConfig, reducer),
  middleware: middleware,
});

export const persistor = persistStore(
  store,
  {manualPersist: false /*true*/},
  a => console.log('rehydration finished with: ', a),
);

store.subscribe(() => {
  const {
    cfg: {darkMode, lang},
  } = store.getState();
  lang === I18n.locale || (I18n.locale = lang);
  populateStyles(darkMode);
});
