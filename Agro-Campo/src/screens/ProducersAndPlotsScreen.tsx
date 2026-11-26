import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { CatalogEntryForm } from '@/components/CatalogEntryForm';
import { FieldRecordList } from '@/components/FieldRecordList';
import { ProducerCard } from '@/components/ProducerCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useProducersAndPlots } from '@/hooks/use-producers-and-plots';

export function ProducersAndPlotsScreen() {
  const { state, refresh } = useProducersAndPlots();
  const [mode, setMode] = useState<'browse' | 'create'>('browse');
  const [confirmation, setConfirmation] = useState('');

  const onSaved = (message: string) => {
    setConfirmation(message);
    refresh();
    setMode('browse');
  };

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={styles.title}>Productores y parcelas</Text>
      </View>
      <View style={styles.tabs}>
        <GlassButton label="Visualizar" variant="toggle" selected={mode === 'browse'} onPress={() => setMode('browse')} />
        <GlassButton label="Integrar" variant="toggle" selected={mode === 'create'} onPress={() => { setConfirmation(''); setMode('create'); }} />
      </View>

      {mode === 'create' && (
        <CatalogEntryForm producers={state.status === 'ready' ? state.producers : []} onSaved={onSaved} />
      )}

      {mode === 'browse' && confirmation !== '' && (
        <Text accessibilityLiveRegion="polite" style={styles.description}>{confirmation}</Text>
      )}

      {mode === 'browse' && state.status === 'loading' && (
        <View style={styles.feedback}>
          <ActivityIndicator color="#2b593b" />
          <Text accessibilityLiveRegion="polite" style={styles.description}>Cargando padrón…</Text>
        </View>
      )}

      {mode === 'browse' && state.status === 'error' && (
        <View style={styles.feedback}>
          <Text accessibilityRole="alert" style={styles.description}>{state.message}</Text>
          <GlassButton label="Reintentar" onPress={refresh} />
        </View>
      )}

      {mode === 'browse' && state.status === 'ready' && (
        <FieldRecordList
          searchLabel="Buscar productor, comunidad o parcela"
          emptyMessage="Aún no hay productores registrados."
          records={state.producers.map((producer) => ({
            id: producer.id,
            crops: producer.plots.map((plot) => plot.cultivo),
            searchText: (crop) => [
              producer.nombre,
              producer.comunidad,
              ...producer.plots.filter((plot) => !crop || plot.cultivo === crop)
                .flatMap((plot) => [plot.cultivo, plot.ubicacion]),
            ].join(' '),
            render: (crop) => (
              <ProducerCard producer={crop
                ? { ...producer, plots: producer.plots.filter((plot) => plot.cultivo === crop) }
                : producer}
              />
            ),
          }))}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  heading: { gap: 4 },
  tabs: { flexDirection: 'row', gap: 6 },
  title: { color: '#172b1b', fontSize: 23, fontWeight: '700' },
  description: { color: '#425447', fontSize: 14, lineHeight: 20 },
  feedback: { gap: 10, alignItems: 'flex-start', paddingVertical: 8 },
});
