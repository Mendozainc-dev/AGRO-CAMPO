import { FirebaseError } from 'firebase/app';
import { useEffect, useRef, useState } from 'react';

import { getAppAuth, openAccount, signOut } from '@/services/account';

function accountError(error: unknown) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
        return 'El correo o la contraseña no coinciden.';
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta con ese correo.';
      case 'auth/weak-password':
        return 'La contraseña no cumple los requisitos de Firebase.';
      case 'auth/operation-not-allowed':
        return 'Este método de acceso no está habilitado en Firebase.';
      case 'auth/popup-closed-by-user':
        return 'Cerraste la ventana de Google.';
      case 'auth/network-request-failed':
      case 'unavailable':
        return 'No se pudo conectar con Firebase. Revisa tu conexión.';
      case 'permission-denied':
        return 'Firestore no permitió acceder al perfil. Revisa las reglas de la base configurada.';
      default:
        return `Firebase no pudo completar la operación (${error.code}).`;
    }
  }

  return error instanceof Error ? error.message : 'No se pudo completar la operación.';
}

export function useAccount() {
  const [name, setName] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(true);
  const pending = useRef(true);

  useEffect(() => {
    let active = true;
    const restore = async () => {
      try {
        const auth = getAppAuth();
        await auth.authStateReady();
        if (!active || !auth.currentUser) return;
        const restoredName = await openAccount(auth.currentUser);
        if (active) setName(restoredName);
      } catch (error) {
        if (active) setNotice(accountError(error));
      } finally {
        if (active) {
          pending.current = false;
          setBusy(false);
        }
      }
    };
    void restore();
    return () => { active = false; };
  }, []);

  const run = async (operation: () => Promise<{ name?: string | null; notice?: string }>) => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setNotice('');
    try {
      const result = await operation();
      if (result.name !== undefined) setName(result.name);
      if (result.notice) setNotice(result.notice);
    } catch (error) {
      setNotice(accountError(error));
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };

  return { name, notice, setNotice, busy, run, logout: () => run(async () => {
    await signOut(getAppAuth());
    return { name: null };
  }) };
}
