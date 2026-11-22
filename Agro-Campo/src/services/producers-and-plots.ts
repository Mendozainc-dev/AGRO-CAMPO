import { collection, getDocsFromServer } from 'firebase/firestore';

import { getDatabase } from './firebase';

export type Plot = {
  id: string;
  cultivo: string;
  superficie: number;
  ubicacion: string;
};

export type ProducerWithPlots = {
  id: string;
  nombre: string;
  comunidad: string;
  telefono: string;
  plots: Plot[];
};

const bySpanishName = new Intl.Collator('es-MX');

export async function readProducersAndPlots(): Promise<ProducerWithPlots[]> {
  const db = getDatabase();
  const [producers, plots] = await Promise.all([
    getDocsFromServer(collection(db, 'productores')),
    getDocsFromServer(collection(db, 'parcelas')),
  ]);

  const plotsByProducer = new Map<string, Plot[]>();
  for (const document of plots.docs) {
    const { productorId, cultivo, superficie, ubicacion } = document.data();
    if (typeof productorId !== 'string' || typeof cultivo !== 'string'
      || typeof superficie !== 'number' || !Number.isFinite(superficie) || typeof ubicacion !== 'string') {
      throw new Error('Hay una parcela con datos incompletos en Firestore.');
    }

    const producerPlots = plotsByProducer.get(productorId) ?? [];
    producerPlots.push({ id: document.id, cultivo, superficie, ubicacion });
    plotsByProducer.set(productorId, producerPlots);
  }

  return producers.docs.map((document) => {
    const { nombre, comunidad, telefono } = document.data();
    if (typeof nombre !== 'string' || typeof comunidad !== 'string') {
      throw new Error('Hay un productor con datos incompletos en Firestore.');
    }

    return {
      id: document.id,
      nombre,
      comunidad,
      telefono: typeof telefono === 'string' ? telefono.trim() : '',
      plots: (plotsByProducer.get(document.id) ?? [])
        .sort((left, right) => bySpanishName.compare(left.cultivo, right.cultivo)),
    };
  }).sort((left, right) => bySpanishName.compare(left.nombre, right.nombre));
}
