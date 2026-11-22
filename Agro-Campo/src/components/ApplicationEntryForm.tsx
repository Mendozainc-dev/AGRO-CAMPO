import { FirebaseError } from 'firebase/app';
import { useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';

import { FieldPlotSelector } from '@/components/FieldPlotSelector';
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
      <FieldPlotSelector plots={plots} plotId={plotId} busy={busy} onSelect={setPlotId} />
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
  error: { color: '#87292a', fontSize: 14 },
});
