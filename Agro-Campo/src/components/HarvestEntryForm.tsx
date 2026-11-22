import { FirebaseError } from 'firebase/app';
import { useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';

import { FieldPlotSelector } from '@/components/FieldPlotSelector';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { createHarvest } from '@/services/harvests';
import type { Plot } from '@/services/producers-and-plots';
import { todayFieldDate } from '@/utils/field-date';

type HarvestEntryFormProps = {
  plots: Plot[];
  busy: boolean;
  onBusyChange: (busy: boolean) => void;
  onSaved: () => void;
};

export function HarvestEntryForm({ plots, busy, onBusyChange, onSaved }: HarvestEntryFormProps) {
  const [plotId, setPlotId] = useState('');
  const [buyer, setBuyer] = useState('');
  const [volume, setVolume] = useState('');
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
      await createHarvest({ parcelaId: plotId, comprador: buyer, volumen: volume, fecha: date });
      onSaved();
    } catch (problem) {
      if (problem instanceof FirebaseError) {
        setError(problem.code === 'permission-denied'
          ? 'Firestore no permitió guardar la cosecha con esta cuenta o parcela.'
          : 'No se pudo guardar la cosecha. Revisa tu conexión y reintenta.');
      } else {
        setError(problem instanceof Error ? problem.message : 'No se pudo guardar la cosecha.');
      }
    } finally {
      onBusyChange(false);
      pending.current = false;
    }
  }

  return (
    <View style={styles.card}>
      <FieldPlotSelector plots={plots} plotId={plotId} busy={busy} onSelect={setPlotId} />
      <GlassInput label="Comprador" value={buyer} onChangeText={setBuyer} maxLength={150} editable={!busy} />
      <GlassInput label="Volumen (toneladas)" value={volume} onChangeText={setVolume} keyboardType="decimal-pad" editable={!busy} />
      <GlassInput label="Fecha (AAAA-MM-DD)" value={date} onChangeText={setDate} maxLength={10} editable={!busy} />
      {error !== '' && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <GlassButton label={busy ? 'Guardando…' : 'Guardar cosecha'} onPress={save} disabled={busy || !plotId} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12, padding: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#d3dfd1', borderRadius: 10 },
  error: { color: '#87292a', fontSize: 14 },
});
