import { collection, doc, getDocsFromServer, limit, orderBy, query, runTransaction } from 'firebase/firestore';

import { isFieldDate } from '@/utils/field-date';

import { getDatabase } from './firebase';
import { getAppAuth } from './firebase-auth';

type ApplicationDraft = {
  parcelaId: string;
  producto: string;
  dosis: string;
  fecha: string;
};

export type FieldApplication = ApplicationDraft & { id: string };

export async function readRecentApplications(): Promise<FieldApplication[]> {
  const results = await getDocsFromServer(query(
    collection(getDatabase(), 'aplicaciones'), orderBy('fecha', 'desc'), limit(50),
  ));
  return results.docs.map((document) => {
    const { parcelaId, producto, dosis, fecha } = document.data();
    return { id: document.id, parcelaId, producto, dosis, fecha };
  });
}

export async function createApplication(draft: ApplicationDraft) {
  const { parcelaId } = draft;
  const producto = draft.producto.trim();
  const dosis = draft.dosis.trim();
  const fecha = draft.fecha.trim();

  if (!parcelaId || !producto || producto.length > 150 || !dosis || dosis.length > 100) {
    throw new Error('Selecciona una parcela y completa el producto y la dosis.');
  }
  if (!isFieldDate(fecha)) throw new Error('Ingresa una fecha válida en formato AAAA-MM-DD.');

  const user = getAppAuth().currentUser;
  if (!user?.emailVerified) throw new Error('Necesitas iniciar sesión con un correo verificado.');

  const db = getDatabase();
  const reference = doc(collection(db, 'aplicaciones'));
  await runTransaction(db, async (transaction) => {
    transaction.set(reference, { parcelaId, producto, dosis, fecha, tecnicoId: user.uid });
  });
}
