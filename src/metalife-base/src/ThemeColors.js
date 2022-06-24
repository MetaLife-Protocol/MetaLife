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
      c_4E586E: '#4E586E',
      c_F0F0F0_000000: '#F0F0F0',
      c_ACB1BB_6A7895: '#ACB1BB',
      c_FFFFFF_232929: '#FFF',
      c_F1F1F2_282C2D: '#F1F1F2',
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
      c_4E586E: '#4E586E',
      c_F0F0F0_000000: '#000000',
      c_ACB1BB_6A7895: '#6A7895',
      c_FFFFFF_232929: '#232929',
      c_F1F1F2_282C2D: '#282C2D',
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
