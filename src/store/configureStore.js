import reducer from '../reducers/Reducer';
import {createStore} from 'redux';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import I18n from 'react-native-i18n';
import {populateStyles} from '../shared/SchemaStyles';
import {devToolsEnhancer} from 'redux-devtools-extension';

/**
 * Created on 11 Nov 2021 by lonmee
 */
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['ssb'],
};
const persistedReducer = persistReducer(persistConfig, reducer);

export const store = createStore(persistedReducer, devToolsEnhancer());

export const persistor = persistStore(store, [
  {manualPersist: false},
  a => console.log('rehydration finished with: ', a),
]);

store.subscribe(() => {
  const {
    cfg: {darkMode, lang},
  } = store.getState();
  lang === I18n.locale || (I18n.locale = lang);
  populateStyles(darkMode);
});
