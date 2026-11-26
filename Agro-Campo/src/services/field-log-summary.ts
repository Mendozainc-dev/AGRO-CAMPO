import { collection, getCountFromServer } from 'firebase/firestore';

import { getDatabase } from './firebase';

const collections = ['parcelas', 'productores', 'inspecciones', 'aplicaciones', 'cosechas'] as const;

export type FieldLogSummary = Record<(typeof collections)[number], number>;

export async function readFieldLogSummary(): Promise<FieldLogSummary> {
  const database = getDatabase();
  const [parcelas, productores, inspecciones, aplicaciones, cosechas] = await Promise.all(
    collections.map((name) => getCountFromServer(collection(database, name))),
  );

  return {
    parcelas: parcelas.data().count,
    productores: productores.data().count,
    inspecciones: inspecciones.data().count,
    aplicaciones: aplicaciones.data().count,
    cosechas: cosechas.data().count,
  };
}
