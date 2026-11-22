import { StyleSheet, Text, View } from 'react-native';

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
    <View style={styles.card}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>{plot?.cultivo ?? 'Inspección de parcela'}</Text>
        <Text style={styles.date}>{inspection.fecha}</Text>
      </View>
      {plot && <Text style={styles.body}>{plot.ubicacion}</Text>}
      {inspection.tecnicoNombre && <Text style={styles.body}>Registrada por {inspection.tecnicoNombre}</Text>}
      {Number.isFinite(inspection.latitud) && Number.isFinite(inspection.longitud) && (
        <Text style={styles.body}>GPS: {inspection.latitud.toFixed(5)}, {inspection.longitud.toFixed(5)}</Text>
      )}
      {fields.filter(([, value]) => value !== '' && value != null).map(([label, value]) => (
        <Text key={label} style={styles.body}><Text style={styles.label}>{label}: </Text>{value}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 6, padding: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#d3dfd1', borderRadius: 10 },
  header: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { color: '#172b1b', fontSize: 17, fontWeight: '700', textTransform: 'capitalize' },
  date: { color: '#224c31', backgroundColor: '#e7f1e5', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, fontSize: 12, fontWeight: '600' },
  body: { color: '#425447', fontSize: 14, lineHeight: 20 },
  label: { fontWeight: '700' },
});
