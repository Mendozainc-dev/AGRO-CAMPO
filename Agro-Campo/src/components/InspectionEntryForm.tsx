import { FirebaseError } from 'firebase/app';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import { useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { createInspection, type InspectionDraft } from '@/services/inspections';
import type { Plot } from '@/services/producers-and-plots';

import { todayFieldDate } from '@/utils/field-date';

type InspectionEntryFormProps = {
  plots: Plot[];
  onSaved: () => void;
  onBusyChange: (busy: boolean) => void;
};

export function InspectionEntryForm({ plots, onSaved, onBusyChange }: InspectionEntryFormProps) {
  const [plotId, setPlotId] = useState('');
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [draft, setDraft] = useState<InspectionDraft>(() => ({
    fecha: todayFieldDate(), plagas: '', estadoRiego: '', etapaFenologica: '', observaciones: '',
    brix: '', humidity: '', irrigationSystem: '', soilPh: '',
  }));
  const [error, setError] = useState('');
  const [action, setAction] = useState<'locate' | 'save' | null>(null);
  const pending = useRef(false);
  const plot = plots.find(({ id }) => id === plotId);

  function change(field: keyof InspectionDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function run(kind: 'locate' | 'save', operation: () => Promise<void>) {
    if (pending.current) return;
    pending.current = true;
    setAction(kind);
    onBusyChange(true);
    setError('');
    Keyboard.dismiss();
    try {
      await operation();
    } catch (problem) {
      if (problem instanceof FirebaseError) {
        setError(problem.code === 'permission-denied'
          ? 'Firestore no permitió registrar la inspección con esta cuenta.'
          : 'No se pudo guardar la inspección. Revisa tu conexión y reintenta.');
      } else {
        setError(problem instanceof Error ? problem.message : 'No se pudo completar la operación.');
      }
    } finally {
      pending.current = false;
      setAction(null);
      onBusyChange(false);
    }
  }

  function locate() {
    return run('locate', async () => {
      const permission = await requestForegroundPermissionsAsync();
      if (!permission.granted) {
        throw new Error('Permite el acceso a la ubicación para capturar el GPS.');
      }
      const { coords } = await getCurrentPositionAsync();
      setCoordinates({ latitude: coords.latitude, longitude: coords.longitude });
    });
  }

  function save() {
    return run('save', async () => {
      if (!plot || !coordinates) throw new Error('Selecciona una parcela y captura su ubicación GPS.');
      await createInspection(plot, coordinates, draft);
      onSaved();
    });
  }

  const disabled = action !== null;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Parcela</Text>
      {plots.length === 0 && <Text style={styles.body}>Necesitas una parcela registrada para capturar una inspección.</Text>}
      {plots.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="radio"
          accessibilityState={{ checked: item.id === plotId, disabled }}
          disabled={disabled}
          onPress={() => {
            if (item.id !== plotId) setCoordinates(null);
            setPlotId(item.id);
          }}
          style={[styles.option, item.id === plotId && styles.selected]}
        >
          <Text style={styles.crop}>{item.cultivo}</Text>
          <Text style={styles.body}>{item.ubicacion}</Text>
        </Pressable>
      ))}
      <GlassInput label="Fecha (AAAA-MM-DD)" value={draft.fecha} onChangeText={(value) => change('fecha', value)} maxLength={10} editable={!disabled} />
      <GlassButton label={action === 'locate' ? 'Buscando ubicación…' : 'Capturar GPS'} variant="secondary" onPress={locate} disabled={disabled || !plot} />
      {coordinates && <Text style={styles.body}>GPS: {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}</Text>}
      <GlassInput label="Plagas o hallazgos" value={draft.plagas} onChangeText={(value) => change('plagas', value)} maxLength={300} editable={!disabled} />
      <GlassInput label="Estado del riego" value={draft.estadoRiego} onChangeText={(value) => change('estadoRiego', value)} maxLength={100} editable={!disabled} />
      <GlassInput label="Etapa del cultivo" value={draft.etapaFenologica} onChangeText={(value) => change('etapaFenologica', value)} maxLength={100} editable={!disabled} />
      {plot?.cultivo === 'fresa' && <GlassInput label="Grados Brix" keyboardType="decimal-pad" value={draft.brix} onChangeText={(value) => change('brix', value)} editable={!disabled} />}
      {plot?.cultivo === 'sorgo' && <GlassInput label="Humedad del grano (%)" keyboardType="decimal-pad" value={draft.humidity} onChangeText={(value) => change('humidity', value)} editable={!disabled} />}
      {plot?.cultivo === 'hortalizas' && (
        <>
          <GlassInput label="Sistema de riego" value={draft.irrigationSystem} onChangeText={(value) => change('irrigationSystem', value)} maxLength={100} editable={!disabled} />
          <GlassInput label="pH del suelo" keyboardType="decimal-pad" value={draft.soilPh} onChangeText={(value) => change('soilPh', value)} editable={!disabled} />
        </>
      )}
      <GlassInput label="Observaciones" value={draft.observaciones} onChangeText={(value) => change('observaciones', value)} maxLength={1000} multiline editable={!disabled} />

      {error !== '' && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <GlassButton label={action === 'save' ? 'Guardando…' : 'Guardar inspección'} onPress={save} disabled={disabled || !plot || !coordinates} />
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
