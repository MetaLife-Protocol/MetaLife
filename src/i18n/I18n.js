import I18n from 'react-native-i18n';
import en from './locales/en';
import zh from './locales/zh';

/**
 * Created on 08 Nov 2021 by lonmee
 */
I18n.fallbacks = true;

I18n.translations = {
  en,
  zh,
};

export default I18n;
