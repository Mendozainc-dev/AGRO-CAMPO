import { addDoc, collection, doc, getDocFromServer, getDocsFromServer } from 'firebase/firestore';

import { getDatabase } from './firebase';
import { getAppAuth } from './firebase-auth';

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

export const crops = ['fresa', 'sorgo', 'hortalizas'] as const;
export type Crop = typeof crops[number];

export async function canCreateCatalogRecords() {
  const user = getAppAuth().currentUser;
  if (!user?.emailVerified) return false;

  const profile = await getDocFromServer(doc(getDatabase(), 'usuarios', user.uid));
  return profile.data()?.rol === 'admin';
}

export async function createProducer(input: { nombre: string; comunidad: string; telefono: string }) {
  const nombre = input.nombre.trim();
  const comunidad = input.comunidad.trim();
  const telefono = input.telefono.trim();

  if (!nombre || nombre.length > 150 || !comunidad || comunidad.length > 100 || telefono.length > 30) {
    throw new Error('Completa el nombre y la comunidad dentro del límite de cada campo.');
  }

  await addDoc(collection(getDatabase(), 'productores'), {
    nombre, comunidad, telefono, createdAt: new Date().toISOString(),
  });
}

export async function createPlot(input: { productorId: string; cultivo: Crop; superficie: string; ubicacion: string }) {
  const ubicacion = input.ubicacion.trim();
  const area = input.superficie.trim();
  const superficie = Number(area.replace(',', '.'));

  if (!input.productorId || !crops.includes(input.cultivo) || !ubicacion || ubicacion.length > 200
    || !/^\d+(?:[.,]\d+)?$/.test(area) || !Number.isFinite(superficie) || superficie <= 0) {
    throw new Error('Elige un productor y completa la ubicación y una superficie mayor a cero.');
  }

  await addDoc(collection(getDatabase(), 'parcelas'), {
    productorId: input.productorId, cultivo: input.cultivo, superficie, ubicacion,
  });
}
