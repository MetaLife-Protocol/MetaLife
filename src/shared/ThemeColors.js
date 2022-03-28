'use strict';

import SchemaStyles, {colorsBasics} from './SchemaStyles';
import {useMemo} from 'react';

/**
 * @Author: lq
 * @Date: 2022-03-16
 * @Project:MetaLife
 */

export function getTheme(isLightTheme) {
  if (isLightTheme) {
    return {
      ...colorsBasics,
      isLight: true,
      c_FFFFFF_000000: '#FFF',
      c_000000_FFFFFF: '#000',
      c_F8F9FD_000000: '#F8F9FD',
      c_FFFFFF_111717: '#FFF',
      c_64D39F: '#64D39F',
    };
  } else {
    return {
      ...colorsBasics,
      isLight: false,
      c_FFFFFF_000000: '#000',
      c_000000_FFFFFF: '#FFF',
      c_F8F9FD_000000: '#000',
      c_FFFFFF_111717: '#111717',
      c_8E8E92: '#8E8E92',
      c_64D39F: '#64D39F',
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
