import AsyncStorage from '@react-native-async-storage/async-storage';
import * as firebaseAuth from 'firebase/auth';
import type { Auth, Persistence } from 'firebase/auth';

import { getFirebaseApp } from './firebase';

let auth: Auth | undefined;

// Metro resolves Firebase's React Native entry, while TypeScript sees its shared declarations.
const nativeAuth = firebaseAuth as typeof firebaseAuth & {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
};

export function getAppAuth() {
  if (auth) return auth;

  const app = getFirebaseApp();
  try {
    auth = nativeAuth.initializeAuth(app, { persistence: nativeAuth.getReactNativePersistence(AsyncStorage) });
  } catch (error) {
    if (!(error instanceof Error) || !('code' in error) || error.code !== 'auth/already-initialized') throw error;
    auth = nativeAuth.getAuth(app);
  }

  return auth;
}
