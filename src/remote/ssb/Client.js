/**
 * Created on 09 Dec 2021 by lonmee
 */

import ssbClient from 'react-native-ssb-client';
import manifest from './manifest';

export const makeClient = () => ssbClient(manifest).callPromise();
