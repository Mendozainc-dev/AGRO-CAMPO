import { StyleSheet, Text } from 'react-native';

import { ExpandableCard } from '@/components/ui/ExpandableCard';
import type { Inspection } from '@/services/inspections';
import type { Plot } from '@/services/producers-and-plots';

const detailLabels: Record<string, string> = {
  gradosBrix: 'Grados Brix',
  humedadGrano: 'Humedad del grano (%)',
  sistemaRiego: 'Sistema de riego',
  phSuelo: 'pH del suelo',
};

export function InspectionCard({ inspection, plot }: { inspection: Inspection; plot?: Plot }) {
  const fields = [
    ['Hallazgos', inspection.plagas],
    ['Riego', inspection.estadoRiego],
    ['Etapa', inspection.etapaFenologica],
    ...Object.entries(inspection.detalles).map(([key, value]) => [detailLabels[key] ?? key, value]),
    ['Observaciones', inspection.observaciones],
  ];

  return (
    <ExpandableCard
      title={plot?.ubicacion ?? 'Inspección de parcela'}
      summary={[inspection.fecha, plot?.cultivo].filter(Boolean).join(' · ')}
    >
      {inspection.tecnicoNombre && <Text style={styles.body}>Registrada por {inspection.tecnicoNombre}</Text>}
      {Number.isFinite(inspection.latitud) && Number.isFinite(inspection.longitud) && (
        <Text style={styles.body}>GPS: {inspection.latitud.toFixed(5)}, {inspection.longitud.toFixed(5)}</Text>
      )}
      {fields.filter(([, value]) => value !== '' && value != null).map(([label, value]) => (
        <Text key={label} style={styles.body}><Text style={styles.label}>{label}: </Text>{value}</Text>
      ))}
    </ExpandableCard>
  );
}

const styles = StyleSheet.create({
  body: { color: '#425447', fontSize: 14, lineHeight: 20 },
  label: { fontWeight: '700' },
});
