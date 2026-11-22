import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ProducerCard } from '@/components/ProducerCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useProducersAndPlots } from '@/hooks/use-producers-and-plots';

export function ProducersAndPlotsScreen() {
  const { state, refresh } = useProducersAndPlots();

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={styles.title}>Productores y parcelas</Text>
        <Text style={styles.description}>Consulta los cultivos, la superficie y la ubicación de cada parcela.</Text>
      </View>

      {state.status === 'loading' && (
        <View style={styles.feedback}>
          <ActivityIndicator color="#2b593b" />
          <Text accessibilityLiveRegion="polite" style={styles.description}>Cargando padrón…</Text>
        </View>
      )}

      {state.status === 'error' && (
        <View style={styles.feedback}>
          <Text accessibilityRole="alert" style={styles.description}>{state.message}</Text>
          <GlassButton label="Reintentar" onPress={refresh} />
        </View>
      )}

      {state.status === 'ready' && (
        state.producers.length ? state.producers.map((producer) => <ProducerCard key={producer.id} producer={producer} />) : (
          <Text style={styles.description}>Aún no hay productores registrados.</Text>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  heading: { gap: 4 },
  title: { color: '#172b1b', fontSize: 23, fontWeight: '700' },
  description: { color: '#425447', fontSize: 14, lineHeight: 20 },
  feedback: { gap: 10, alignItems: 'flex-start', paddingVertical: 8 },
});
