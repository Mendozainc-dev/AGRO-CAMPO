import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, runTransaction } from 'firebase/firestore';

import { getDatabase } from './firebase';
import { getAppAuth } from './firebase-auth';

export { getAppAuth };
export { signOut };

export async function registerWithEmail(name: string, email: string, password: string) {
  const auth = getAppAuth();
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  try {
    await updateProfile(user, { displayName: name });
    await sendEmailVerification(user);
  } finally {
    await signOut(auth);
  }
}

export async function loginWithEmail(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(getAppAuth(), email, password);
  if (!user.emailVerified) {
    try {
      await sendEmailVerification(user);
    } finally {
      await signOut(getAppAuth());
    }
    throw new Error('Te enviamos un correo de verificación. Confirma tu dirección y vuelve a iniciar sesión.');
  }

  return openAccount(user);
}

export async function openAccount(user: User) {
  try {
    if (!user.email || !user.emailVerified) {
      throw new Error('Verifica tu correo para acceder a AgroCampo.');
    }

    const database = getDatabase();
    const reference = doc(database, 'usuarios', user.uid);

    return await runTransaction(database, async (transaction) => {
      const existing = await transaction.get(reference);
      if (existing.exists()) {
        const { nombre, rol } = existing.data();
        if (typeof nombre !== 'string' || (rol !== 'tecnico' && rol !== 'admin')) {
          throw new Error('El perfil de AgroCampo tiene datos incompletos.');
        }
        return nombre;
      }

      const nombre = user.displayName?.trim();
      if (!nombre) throw new Error('Tu cuenta no tiene un nombre para crear el perfil de AgroCampo.');

      transaction.set(reference, { uid: user.uid, email: user.email, nombre, rol: 'tecnico' });
      return nombre;
    });
  } catch (error) {
    await signOut(getAppAuth());
    throw error;
  }
}
