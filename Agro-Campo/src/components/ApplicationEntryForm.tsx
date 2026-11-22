import { FirebaseError } from 'firebase/app';
import { useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { createApplication } from '@/services/applications';
import type { Plot } from '@/services/producers-and-plots';
import { todayFieldDate } from '@/utils/field-date';

type ApplicationEntryFormProps = {
  plots: Plot[];
  busy: boolean;
  onBusyChange: (busy: boolean) => void;
  onSaved: () => void;
};

export function ApplicationEntryForm({ plots, busy, onBusyChange, onSaved }: ApplicationEntryFormProps) {
  const [plotId, setPlotId] = useState('');
  const [product, setProduct] = useState('');
  const [dose, setDose] = useState('');
  const [date, setDate] = useState(todayFieldDate);
  const [error, setError] = useState('');
  const pending = useRef(false);

  async function save() {
    if (pending.current || !plotId) return;
    pending.current = true;
    onBusyChange(true);
    setError('');
    Keyboard.dismiss();

    try {
      await createApplication({ parcelaId: plotId, producto: product, dosis: dose, fecha: date });
      onSaved();
    } catch (problem) {
      if (problem instanceof FirebaseError) {
        setError(problem.code === 'permission-denied'
          ? 'Firestore no permitió guardar la aplicación con esta cuenta o parcela.'
          : 'No se pudo guardar la aplicación. Revisa tu conexión y reintenta.');
      } else {
        setError(problem instanceof Error ? problem.message : 'No se pudo guardar la aplicación.');
      }
    } finally {
      onBusyChange(false);
      pending.current = false;
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Parcela</Text>
      {plots.length === 0 && <Text style={styles.body}>Primero registra una parcela en el padrón.</Text>}
      {plots.map((plot) => (
        <Pressable
          key={plot.id}
          accessibilityRole="radio"
          accessibilityState={{ checked: plot.id === plotId, disabled: busy }}
          disabled={busy}
          onPress={() => setPlotId(plot.id)}
          style={[styles.option, plot.id === plotId && styles.selected]}
        >
          <Text style={styles.crop}>{plot.cultivo}</Text>
          <Text style={styles.body}>{plot.ubicacion}</Text>
        </Pressable>
      ))}
      <GlassInput label="Producto o insumo" value={product} onChangeText={setProduct} maxLength={150} editable={!busy} />
      <GlassInput label="Dosis aplicada" value={dose} onChangeText={setDose} maxLength={100} editable={!busy} />
      <GlassInput label="Fecha (AAAA-MM-DD)" value={date} onChangeText={setDate} maxLength={10} editable={!busy} />
      {error !== '' && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <GlassButton label={busy ? 'Guardando…' : 'Guardar aplicación'} onPress={save} disabled={busy || !plotId} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12, padding: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#d3dfd1', borderRadius: 10 },
  option: { padding: 10, gap: 3, borderWidth: 1, borderColor: '#d3dfd1', borderRadius: 6 },
  selected: { backgroundColor: '#e7f1e5', borderColor: '#4a7956' },
  label: { color: '#253128', fontSize: 14, fontWeight: '700' },
  crop: { color: '#253128', fontSize: 14, fontWeight: '700', textTransform: 'capitalize' },
  body: { color: '#425447', fontSize: 14, lineHeight: 20 },
  error: { color: '#87292a', fontSize: 14 },
});
