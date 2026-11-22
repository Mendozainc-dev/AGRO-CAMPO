import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { getAppAuth, openAccount } from './account';

export async function loginWithGoogle() {
  const { user } = await signInWithPopup(getAppAuth(), new GoogleAuthProvider());
  return openAccount(user);
}
