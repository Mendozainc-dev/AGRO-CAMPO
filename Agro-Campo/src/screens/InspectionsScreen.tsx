import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { FieldRecordList } from '@/components/FieldRecordList';
import { InspectionCard } from '@/components/InspectionCard';
import { InspectionEntryForm } from '@/components/InspectionEntryForm';
import { GlassButton } from '@/components/ui/GlassButton';
import { useProducersAndPlots } from '@/hooks/use-producers-and-plots';
import { readRecentInspections, type Inspection } from '@/services/inspections';

type History =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; entries: Inspection[] };

export function InspectionsScreen() {
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
    readRecentInspections().then(
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
      <Text accessibilityRole="header" style={styles.title}>Inspecciones</Text>
      <View style={styles.tabs}>
        <GlassButton variant="toggle" label="Visualizar" selected={mode === 'history'} onPress={() => setMode('history')} disabled={busy} />
        <GlassButton variant="toggle" label="Registrar" selected={mode === 'create'} onPress={() => { setSaved(false); setMode('create'); }} disabled={busy} />
      </View>

      {mode === 'history' && (
        <>
          {saved && <Text accessibilityLiveRegion="polite" style={styles.body}>Inspección guardada.</Text>}
          {history.status === 'loading' && <ActivityIndicator accessibilityLabel="Cargando inspecciones" color="#2b593b" />}
          {history.status === 'error' && (
            <>
              <Text accessibilityRole="alert" style={styles.body}>No se pudieron cargar las inspecciones.</Text>
              <GlassButton label="Reintentar" onPress={refreshHistory} />
            </>
          )}
          {history.status === 'ready' && (
            <FieldRecordList
              searchLabel="Buscar parcela, fecha, técnico o hallazgo"
              emptyMessage="Aún no hay inspecciones registradas."
              records={history.entries.map((inspection) => {
                const plot = plotsById.get(inspection.parcelaId);
                return {
                  id: inspection.id,
                  crops: plot ? [plot.cultivo] : [],
                  searchText: () => [plot?.ubicacion, plot?.cultivo, inspection.parcelaId, inspection.fecha, inspection.tecnicoNombre,
                    inspection.plagas, inspection.estadoRiego, inspection.etapaFenologica, inspection.observaciones].join(' '),
                  render: () => <InspectionCard inspection={inspection} plot={plot} />,
                };
              })}
            />
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
        <InspectionEntryForm plots={plots} onSaved={onSaved} onBusyChange={setBusy} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  title: { color: '#172b1b', fontSize: 23, fontWeight: '700' },
  tabs: { flexDirection: 'row', gap: 6 },
  body: { color: '#425447', fontSize: 14, lineHeight: 20 },
});
