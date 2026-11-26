import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { GlassButton } from '@/components/ui/GlassButton';
import { readInspectionPhoto } from '@/services/inspection-photos';

type PhotoState = { status: 'loading' | 'error' } | { status: 'ready'; uri: string };

export function InspectionPhoto({ inspectionId }: { inspectionId: string }) {
  const [photo, setPhoto] = useState<PhotoState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    readInspectionPhoto(inspectionId).then(
      (uri) => { if (active) setPhoto({ status: 'ready', uri }); },
      () => { if (active) setPhoto({ status: 'error' }); },
    );
    return () => { active = false; };
  }, [inspectionId, attempt]);

  if (photo.status === 'ready') {
    return <Image source={photo.uri} style={styles.image} contentFit="contain" accessibilityLabel="Foto de la inspección" accessible />;
  }

  if (photo.status === 'loading') {
    return <ActivityIndicator color="#2b593b" accessibilityLabel="Cargando foto" />;
  }

  return (
    <View style={styles.notice}>
      <Text accessibilityRole="alert">No se pudo cargar la foto.</Text>
      <GlassButton label="Reintentar foto" variant="secondary" onPress={() => {
        setPhoto({ status: 'loading' });
        setAttempt((current) => current + 1);
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', aspectRatio: 4 / 3, maxHeight: 300, borderRadius: 8, backgroundColor: '#f1f5ec' },
  notice: { gap: 6, alignItems: 'flex-start' },
});
