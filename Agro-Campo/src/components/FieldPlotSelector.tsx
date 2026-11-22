import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Plot } from '@/services/producers-and-plots';

type FieldPlotSelectorProps = {
  plots: Plot[];
  plotId: string;
  busy: boolean;
  onSelect: (id: string) => void;
};

export function FieldPlotSelector({ plots, plotId, busy, onSelect }: FieldPlotSelectorProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>Parcela</Text>
      {plots.length === 0 && <Text style={styles.body}>Primero registra una parcela en el padrón.</Text>}
      {plots.map((plot) => (
        <Pressable
          key={plot.id}
          accessibilityRole="radio"
          accessibilityState={{ checked: plot.id === plotId, disabled: busy }}
          disabled={busy}
          onPress={() => onSelect(plot.id)}
          style={[styles.option, plot.id === plotId && styles.selected]}
        >
          <Text style={styles.crop}>{plot.cultivo}</Text>
          <Text style={styles.body}>{plot.ubicacion}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 8 },
  option: { padding: 10, gap: 3, borderWidth: 1, borderColor: '#d3dfd1', borderRadius: 6 },
  selected: { backgroundColor: '#e7f1e5', borderColor: '#4a7956' },
  label: { color: '#253128', fontSize: 14, fontWeight: '700' },
  crop: { color: '#253128', fontSize: 14, fontWeight: '700', textTransform: 'capitalize' },
  body: { color: '#425447', fontSize: 14, lineHeight: 20 },
});
