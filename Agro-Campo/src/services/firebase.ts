import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const databaseId = process.env.EXPO_PUBLIC_FIRESTORE_DATABASE_ID;

export function getFirebaseApp() {
  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId || !databaseId) {
    throw new Error('Falta la configuración de Firebase en .env.local.');
  }

  return getApps().length ? getApp() : initializeApp(config);
}

export function getDatabase() {
  return getFirestore(getFirebaseApp(), databaseId!);
}
