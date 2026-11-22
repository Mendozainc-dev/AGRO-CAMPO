import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { HarvestEntryForm } from '@/components/HarvestEntryForm';
import { GlassButton } from '@/components/ui/GlassButton';
import { useProducersAndPlots } from '@/hooks/use-producers-and-plots';
import { readRecentHarvests, type Harvest } from '@/services/harvests';

const tonnes = new Intl.NumberFormat('es-MX', { maximumSignificantDigits: 8 });

type History =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; entries: Harvest[] };

export function HarvestsScreen() {
  const { state: catalog, refresh: refreshCatalog } = useProducersAndPlots();
  const [mode, setMode] = useState<'history' | 'create'>('history');
  const [history, setHistory] = useState<History>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const plots = catalog.status === 'ready' ? catalog.producers.flatMap((producer) => producer.plots) : [];
  const plotsById = new Map(plots.map((plot) => [plot.id, plot]));

  useEffect(() => {
    let active = true;
    readRecentHarvests().then(
      (entries) => { if (active) setHistory({ status: 'ready', entries }); },
      () => { if (active) setHistory({ status: 'error' }); },
    );
    return () => { active = false; };
  }, [attempt]);

  function refreshHistory() {
    setHistory({ status: 'loading' });
    setAttempt((previous) => previous + 1);
  }

  function onSaved() {
    refreshHistory();
    setSaved(true);
    setMode('history');
  }

  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.title}>Cosechas</Text>
      <View style={styles.tabs}>
        <GlassButton variant="toggle" label="Visualizar" selected={mode === 'history'} onPress={() => setMode('history')} disabled={busy} />
        <GlassButton variant="toggle" label="Registrar" selected={mode === 'create'} onPress={() => { setSaved(false); setMode('create'); }} disabled={busy} />
      </View>

      {mode === 'history' && (
        <>
          {saved && <Text accessibilityLiveRegion="polite" style={styles.body}>Cosecha guardada.</Text>}
          {history.status === 'loading' && <ActivityIndicator accessibilityLabel="Cargando cosechas" color="#2b593b" />}
          {history.status === 'error' && (
            <>
              <Text accessibilityRole="alert" style={styles.body}>No se pudieron cargar las cosechas.</Text>
              <GlassButton label="Reintentar" onPress={refreshHistory} />
            </>
          )}
          {history.status === 'ready' && (
            history.entries.length > 0
              ? history.entries.map((entry) => {
                const plot = plotsById.get(entry.parcelaId);
                return (
                  <View key={entry.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text accessibilityRole="header" style={styles.buyer}>{entry.comprador}</Text>
                      <Text style={styles.date}>{entry.fecha}</Text>
                    </View>
                    <Text style={styles.body}>Volumen: {tonnes.format(entry.volumen)} t</Text>
                    <Text style={styles.body}>{plot?.ubicacion ?? 'Parcela ' + entry.parcelaId}</Text>
                  </View>
                );
              })
              : <Text style={styles.body}>Aún no hay cosechas registradas.</Text>
          )}
        </>
      )}

      {mode === 'create' && catalog.status === 'loading' && <ActivityIndicator accessibilityLabel="Cargando parcelas" color="#2b593b" />}
      {mode === 'create' && catalog.status === 'error' && (
        <>
          <Text accessibilityRole="alert" style={styles.body}>{catalog.message}</Text>
          <GlassButton label="Recargar parcelas" onPress={refreshCatalog} />
        </>
      )}
      {mode === 'create' && catalog.status === 'ready' && (
        <HarvestEntryForm plots={plots} onSaved={onSaved} busy={busy} onBusyChange={setBusy} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  title: { color: '#172b1b', fontSize: 23, fontWeight: '700' },
  tabs: { flexDirection: 'row', gap: 6 },
  card: { gap: 6, padding: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#d3dfd1', borderRadius: 10 },
  cardHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  buyer: { color: '#172b1b', fontSize: 17, fontWeight: '700', flexShrink: 1 },
  date: { color: '#224c31', backgroundColor: '#e7f1e5', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, fontSize: 12, fontWeight: '600' },
  body: { color: '#425447', fontSize: 14, lineHeight: 20 },
});
