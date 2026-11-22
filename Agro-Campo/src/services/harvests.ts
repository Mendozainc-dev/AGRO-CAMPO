import { collection, doc, getDocsFromServer, limit, orderBy, query, runTransaction } from 'firebase/firestore';

import { isFieldDate } from '@/utils/field-date';

import { getDatabase } from './firebase';
import { getAppAuth } from './firebase-auth';

type HarvestDraft = {
  parcelaId: string;
  volumen: string;
  comprador: string;
  fecha: string;
};

export type Harvest = Omit<HarvestDraft, 'volumen'> & { id: string; volumen: number };

export async function readRecentHarvests(): Promise<Harvest[]> {
  const results = await getDocsFromServer(query(
    collection(getDatabase(), 'cosechas'), orderBy('fecha', 'desc'), limit(50),
  ));

  return results.docs.map((document) => {
    const { parcelaId, volumen, comprador, fecha } = document.data();
    return { id: document.id, parcelaId, volumen, comprador, fecha };
  });
}

export async function createHarvest(draft: HarvestDraft) {
  const { parcelaId } = draft;
  const amount = draft.volumen.trim();
  const volumen = Number(amount.replace(',', '.'));
  const comprador = draft.comprador.trim();
  const fecha = draft.fecha.trim();

  if (!parcelaId || !comprador || comprador.length > 150) {
    throw new Error('Selecciona una parcela e ingresa el nombre del comprador.');
  }
  if (!/^\d+(?:[.,]\d+)?$/.test(amount) || !Number.isFinite(volumen) || volumen <= 0 || volumen >= 1e308) {
    throw new Error('Ingresa un volumen en toneladas mayor que cero.');
  }
  if (!isFieldDate(fecha)) throw new Error('Ingresa una fecha válida en formato AAAA-MM-DD.');

  if (!getAppAuth().currentUser?.emailVerified) {
    throw new Error('Necesitas iniciar sesión con un correo verificado.');
  }

  const db = getDatabase();
  const reference = doc(collection(db, 'cosechas'));
  await runTransaction(db, async (transaction) => {
    transaction.set(reference, { parcelaId, volumen, comprador, fecha });
  });
}
