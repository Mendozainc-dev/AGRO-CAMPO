import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { launchCameraAsync, requestCameraPermissionsAsync } from 'expo-image-picker';
import { Platform } from 'react-native';

import { inspectionPhotoMaxBytes } from '@/services/inspection-photos';

export async function captureInspectionPhoto() {
  if (Platform.OS !== 'web' && !(await requestCameraPermissionsAsync()).granted) {
    throw new Error('Permite el acceso a la cámara para tomar la foto.');
  }

  const capture = await launchCameraAsync({ mediaTypes: ['images'], quality: 0.85 });
  if (capture.canceled) return null;

  const original = capture.assets[0];
  const context = ImageManipulator.manipulate(original.uri);
  const side = original.width >= original.height ? 'width' : 'height';
  const maxSide = Math.max(original.width, original.height);

  for (const target of [1024, 720]) {
    if (maxSide > target) context.resize({ [side]: target });
    const image = await context.renderAsync();
    const result = await image.saveAsync({ compress: 0.65, format: SaveFormat.JPEG, base64: true });
    const base64 = result.base64;
    if (base64 && base64.length <= inspectionPhotoMaxBytes * 4 / 3) return { uri: result.uri, base64 };
  }

  throw new Error('No se pudo comprimir la foto lo suficiente. Intenta tomar otra.');
}
