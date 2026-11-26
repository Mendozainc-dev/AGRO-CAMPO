import { Bytes, doc, getDocFromServer } from 'firebase/firestore';

import { getDatabase } from './firebase';

export const inspectionPhotoCollection = 'fotosInspecciones';
export const inspectionPhotoMaxBytes = 300 * 1024;

export function inspectionPhotoBytes(base64: string) {
  const jpeg = Bytes.fromBase64String(base64);
  const size = jpeg.toUint8Array().byteLength;
  if (size === 0 || size > inspectionPhotoMaxBytes) {
    throw new Error('La foto excede el tamaño permitido. Intenta tomar otra.');
  }
  return jpeg;
}

export async function readInspectionPhoto(inspectionId: string) {
  const snapshot = await getDocFromServer(doc(getDatabase(), inspectionPhotoCollection, inspectionId));
  const jpeg = snapshot.data()?.jpeg;
  if (!(jpeg instanceof Bytes)) throw new Error('No se encontró la foto de esta inspección.');
  return 'data:image/jpeg;base64,' + jpeg.toBase64();
}
