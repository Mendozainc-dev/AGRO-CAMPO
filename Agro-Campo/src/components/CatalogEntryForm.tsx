import { FirebaseError } from 'firebase/app';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import {
  canCreateCatalogRecords, createPlot, createProducer, crops, type Crop, type ProducerWithPlots,
} from '@/services/producers-and-plots';

type CatalogEntryFormProps = {
  producers: ProducerWithPlots[];
  onSaved: (message: string) => void;
};

export function CatalogEntryForm({ producers, onSaved }: CatalogEntryFormProps) {
  const [permission, setPermission] = useState<'loading' | 'allowed' | 'denied' | 'error'>('loading');
  const [kind, setKind] = useState<'producer' | 'plot'>('producer');
  const [name, setName] = useState('');
  const [community, setCommunity] = useState('');
  const [phone, setPhone] = useState('');
  const [producerId, setProducerId] = useState('');
  const [crop, setCrop] = useState<Crop>('fresa');
  const [area, setArea] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);

  useEffect(() => {
    let active = true;
    canCreateCatalogRecords().then(
      (allowed) => { if (active) setPermission(allowed ? 'allowed' : 'denied'); },
      () => { if (active) setPermission('error'); },
    );
    return () => { active = false; };
  }, []);

  async function save() {
    if (pending.current || permission !== 'allowed') return;
    pending.current = true;
    setSaving(true);
    setMessage('');
    Keyboard.dismiss();

    try {
      if (kind === 'producer') {
        await createProducer({ nombre: name, comunidad: community, telefono: phone });
        setName('');
        setCommunity('');
        setPhone('');
        onSaved('Productor guardado.');
      } else {
        await createPlot({ productorId: producerId, cultivo: crop, superficie: area, ubicacion: location });
        setArea('');
        setLocation('');
        onSaved('Parcela guardada.');
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        setMessage(error.code === 'permission-denied'
          ? 'Firestore rechazó el alta. Comprueba los permisos de administrador.'
          : 'No se pudo guardar el registro. Revisa la conexión e inténtalo de nuevo.');
      } else {
        setMessage(error instanceof Error ? error.message : 'No se pudo guardar el registro.');
      }
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }

  if (permission !== 'allowed') {
    const feedback = {
      loading: 'Comprobando permisos…',
      denied: 'Solo las cuentas de administrador pueden dar de alta productores y parcelas.',
      error: 'No se pudo comprobar el permiso. Vuelve a abrir la sección Integrar para reintentar.',
    };
    return <Text accessibilityLiveRegion="polite" style={styles.description}>{feedback[permission]}</Text>;
  }

  return (
    <View style={styles.card}>
      <View style={styles.tabs}>
        <GlassButton label="Productor" variant="toggle" selected={kind === 'producer'} disabled={saving} onPress={() => { setKind('producer'); setMessage(''); }} />
        <GlassButton label="Parcela" variant="toggle" selected={kind === 'plot'} disabled={saving} onPress={() => { setKind('plot'); setMessage(''); }} />
      </View>

      {kind === 'producer' ? (
        <>
          <GlassInput label="Nombre del productor" value={name} onChangeText={setName} maxLength={150} editable={!saving} />
          <GlassInput label="Comunidad" value={community} onChangeText={setCommunity} maxLength={100} editable={!saving} />
          <GlassInput label="Teléfono (opcional)" value={phone} onChangeText={setPhone} maxLength={30} keyboardType="phone-pad" editable={!saving} />
        </>
      ) : (
        <>
          <Text style={styles.label}>Selecciona un productor</Text>
          {producers.length === 0 && <Text style={styles.description}>Primero registra un productor o recarga el padrón.</Text>}
          {producers.map((producer) => (
            <Pressable
              key={producer.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: producerId === producer.id, disabled: saving }}
              disabled={saving}
              onPress={() => setProducerId(producer.id)}
              style={[styles.option, producerId === producer.id && styles.selected]}
            >
              <Text style={styles.label}>{producer.nombre}</Text>
              <Text style={styles.description}>{producer.comunidad}</Text>
            </Pressable>
          ))}
          <Text style={styles.label}>Cultivo</Text>
          <View style={styles.tabs}>
            {crops.map((value) => (
              <GlassButton key={value} label={value[0].toUpperCase() + value.slice(1)} variant="choice" selected={crop === value} disabled={saving} onPress={() => setCrop(value)} />
            ))}
          </View>
          <GlassInput label="Superficie (ha)" value={area} onChangeText={setArea} keyboardType="decimal-pad" editable={!saving} />
          <GlassInput label="Ubicación" value={location} onChangeText={setLocation} maxLength={200} editable={!saving} />
        </>
      )}

      <GlassButton label={saving ? 'Guardando…' : kind === 'producer' ? 'Guardar productor' : 'Guardar parcela'} disabled={saving || (kind === 'plot' && producers.length === 0)} onPress={save} />
      {message !== '' && <Text accessibilityRole="alert" style={styles.description}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12, padding: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#d3dfd1', borderRadius: 10 },
  tabs: { flexDirection: 'row', gap: 6 },
  label: { color: '#253128', fontSize: 14, fontWeight: '600' },
  description: { color: '#425447', fontSize: 14, lineHeight: 20 },
  option: { padding: 10, gap: 3, borderWidth: 1, borderColor: '#d3dfd1', borderRadius: 6 },
  selected: { backgroundColor: '#e7f1e5', borderColor: '#4a7956' },
});
