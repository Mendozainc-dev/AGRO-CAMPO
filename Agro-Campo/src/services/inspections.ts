import {
  collection, doc, getDocFromServer, getDocsFromServer, limit, orderBy, query, runTransaction,
} from 'firebase/firestore';

import { isFieldDate } from '@/utils/field-date';

import { getDatabase } from './firebase';
import { getAppAuth } from './firebase-auth';
import { inspectionPhotoBytes, inspectionPhotoCollection } from './inspection-photos';
import type { Plot } from './producers-and-plots';

type Coordinates = { latitude: number; longitude: number };
type Details = Record<string, string | number>;

type InspectionFields = {
  fecha: string;
  plagas: string;
  estadoRiego: string;
  etapaFenologica: string;
  observaciones: string;
};

export type Inspection = InspectionFields & {
  id: string;
  parcelaId: string;
  tecnicoNombre: string;
  latitud: number;
  longitud: number;
  detalles: Details;
  hasPhoto: boolean;
};

export type InspectionDraft = InspectionFields & {
  brix: string;
  humidity: string;
  irrigationSystem: string;
  soilPh: string;
};

export async function readRecentInspections(): Promise<Inspection[]> {
  const snapshot = await getDocsFromServer(query(
    collection(getDatabase(), 'inspecciones'), orderBy('fecha', 'desc'), limit(50),
  ));

  return snapshot.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      parcelaId: data.parcelaId,
      fecha: data.fecha,
      tecnicoNombre: data.tecnicoNombre,
      latitud: data.latitud,
      longitud: data.longitud,
      plagas: data.plagas,
      estadoRiego: data.estadoRiego,
      etapaFenologica: data.etapaFenologica,
      observaciones: data.observaciones,
      detalles: data.detalles ?? {},
      hasPhoto: Array.isArray(data.fotos) && data.fotos.includes(`${inspectionPhotoCollection}/${document.id}`),
    };
  });
}

function optionalNumber(raw: string, label: string, max: number): number | undefined {
  const input = raw.trim();
  if (!input) return undefined;
  const value = Number(input.replace(',', '.'));
  if (!/^\d+(?:[.,]\d+)?$/.test(input) || !Number.isFinite(value) || value > max) {
    throw new Error(`${label} debe estar entre 0 y ${max}.`);
  }
  return value;
}

function getDetails(crop: string, draft: InspectionDraft): Details {
  if (crop === 'fresa') {
    const brix = optionalNumber(draft.brix, 'Los grados Brix', 100);
    return brix === undefined ? {} : { gradosBrix: brix };
  }

  if (crop === 'sorgo') {
    const humidity = optionalNumber(draft.humidity, 'La humedad del grano', 100);
    return humidity === undefined ? {} : { humedadGrano: humidity };
  }

  const details: Details = {};
  const system = draft.irrigationSystem.trim();
  const soilPh = optionalNumber(draft.soilPh, 'El pH del suelo', 14);
  if (system) details.sistemaRiego = system;
  if (soilPh !== undefined) details.phSuelo = soilPh;
  return details;
}

export async function createInspection(plot: Plot, coordinates: Coordinates, draft: InspectionDraft, photoBase64?: string) {
  const fecha = draft.fecha.trim();
  if (!isFieldDate(fecha)) {
    throw new Error('Ingresa una fecha válida en formato AAAA-MM-DD.');
  }

  const { latitude, longitude } = coordinates;
  if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 || !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
    throw new Error('Vuelve a capturar la ubicación GPS.');
  }

  const detalles = getDetails(plot.cultivo, draft);
  const user = getAppAuth().currentUser;
  if (!user?.emailVerified) throw new Error('Necesitas iniciar sesión con un correo verificado.');

  const db = getDatabase();
  const profile = await getDocFromServer(doc(db, 'usuarios', user.uid));
  const tecnicoNombre = profile.data()?.nombre;
  if (typeof tecnicoNombre !== 'string' || !tecnicoNombre) {
    throw new Error('No se pudo identificar el nombre de tu perfil.');
  }

  const reference = doc(collection(db, 'inspecciones'));
  const jpeg = photoBase64 ? inspectionPhotoBytes(photoBase64) : null;
  const photo = jpeg ? doc(db, inspectionPhotoCollection, reference.id) : null;
  await runTransaction(db, async (transaction) => {
    if (photo && jpeg) transaction.set(photo, { jpeg });
    transaction.set(reference, {
      parcelaId: plot.id,
      fecha,
      tecnicoId: user.uid,
      tecnicoNombre,
      latitud: latitude,
      longitud: longitude,
      fotos: photo ? [photo.path] : [],
      plagas: draft.plagas.trim(),
      estadoRiego: draft.estadoRiego.trim(),
      etapaFenologica: draft.etapaFenologica.trim(),
      observaciones: draft.observaciones.trim(),
      detalles,
    });
  });
}
