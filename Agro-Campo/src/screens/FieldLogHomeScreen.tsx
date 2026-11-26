import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { GlassButton } from '@/components/ui/GlassButton';
import { readFieldLogSummary, type FieldLogSummary } from '@/services/field-log-summary';

const numberFormat = new Intl.NumberFormat('es-MX');

const metrics = [
  { key: 'productores', label: 'Productores' },
  { key: 'inspecciones', label: 'Inspecciones' },
  { key: 'aplicaciones', label: 'Aplicaciones' },
  { key: 'cosechas', label: 'Cosechas' },
] as const;

type SummaryState =
  | { status: 'loading' }
  | { status: 'ready'; summary: FieldLogSummary }
  | { status: 'error' };

export function FieldLogHomeScreen() {
  const [state, setState] = useState<SummaryState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    readFieldLogSummary().then(
      (summary) => { if (active) setState({ status: 'ready', summary }); },
      () => { if (active) setState({ status: 'error' }); },
    );
    return () => { active = false; };
  }, [attempt]);

  function retry() {
    setState({ status: 'loading' });
    setAttempt((current) => current + 1);
  }

  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.heading}>Resumen de la bitácora</Text>

      {state.status === 'loading' && (
        <View style={styles.feedback}>
          <ActivityIndicator color="#2b593b" />
          <Text accessibilityLiveRegion="polite" style={styles.body}>Cargando resumen…</Text>
        </View>
      )}
      {state.status === 'error' && (
        <View style={styles.feedback}>
          <Text accessibilityRole="alert" style={styles.body}>No se pudo cargar el resumen de Firestore.</Text>
          <GlassButton label="Reintentar" onPress={retry} />
        </View>
      )}
      {state.status === 'ready' && (
        <>
          <View style={styles.feature}>
            <View style={styles.featureText}>
              <Text style={styles.featureLabel}>Parcelas registradas</Text>
              <Text style={styles.featureCount}>{numberFormat.format(state.summary.parcelas)}</Text>
            </View>
            <SymbolView name={{ ios: 'map.fill', android: 'map', web: 'map' }} tintColor="#d6efd9" size={36} style={styles.featureIcon} />
          </View>
          <View style={styles.grid}>
            {metrics.map(({ key, label }) => (
              <View key={key} style={styles.cell}>
                <View style={styles.metric}>
                  <Text style={styles.body}>{label}</Text>
                  <Text style={styles.metricCount}>{numberFormat.format(state.summary[key])}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  heading: { color: '#172b1b', fontSize: 23, fontWeight: '700' },
  feedback: { gap: 10, alignItems: 'flex-start', paddingVertical: 8 },
  body: { color: '#425447', fontSize: 14, lineHeight: 20 },
  feature: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18,
    backgroundColor: '#234f34', borderRadius: 10,
  },
  featureText: { flex: 1, gap: 4 },
  featureLabel: { color: '#e4f2e5', fontSize: 14, fontWeight: '600' },
  featureCount: { color: '#fff', fontSize: 36, fontWeight: '700' },
  featureIcon: { width: 36, height: 36 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4, rowGap: 8 },
  cell: { width: '50%', paddingHorizontal: 4 },
  metric: {
    gap: 4, padding: 12, flex: 1, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#d3dfd1', borderRadius: 10,
  },
  metricCount: { color: '#224c31', fontSize: 25, fontWeight: '700' },
});
