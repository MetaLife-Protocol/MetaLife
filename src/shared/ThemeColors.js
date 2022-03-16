'use strict';

import SchemaStyles from './SchemaStyles';
import {useMemo} from 'react';

/**
 * @Author: lq
 * @Date: 2022-03-16
 * @Project:MetaLife
 */

export function getTheme(isLightTheme) {
  if (isLightTheme) {
    return {
      isLight: true,
      c_FFFFFF_000000: '#FFF',
      c_000000_FFFFFF: '#000',
    };
  } else {
    return {
      isLight: false,
      c_FFFFFF_000000: '#000',
      c_000000_FFFFFF: '#FFF',
    };
  }
}

export function useTheme() {
  const {theme} = SchemaStyles();
  return useMemo(() => getTheme(!theme.dark), [theme.dark]);
}

export function useStyle(createFun) {
  const theme = useTheme();
  return useMemo(() => {
    return createFun(theme);
  }, [theme, createFun]);
}
