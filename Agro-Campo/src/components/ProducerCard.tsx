import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

import type { ProducerWithPlots } from '@/services/producers-and-plots';

const area = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });

export function ProducerCard({ producer }: { producer: ProducerWithPlots }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconTile}>
          <SymbolView name={{ ios: 'person.crop.circle', android: 'person', web: 'person' }} size={23} tintColor="#2b593b" />
        </View>
        <View style={styles.identity}>
          <Text accessibilityRole="header" style={styles.name}>{producer.nombre}</Text>
          <Text style={styles.community}>{producer.comunidad}</Text>
          {producer.telefono !== '' && <Text style={styles.community}>Tel. {producer.telefono}</Text>}
        </View>
      </View>

      {producer.plots.length === 0 ? (
        <Text style={styles.community}>Sin parcelas registradas.</Text>
      ) : (
        producer.plots.map((plot) => (
          <View key={plot.id} style={styles.plot}>
            <View style={styles.plotSummary}>
              <Text style={styles.crop}>{plot.cultivo}</Text>
              <Text style={styles.area}>{area.format(plot.superficie)} ha</Text>
            </View>
            <Text style={styles.community}>{plot.ubicacion}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d3dfd1',
    backgroundColor: '#fff',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconTile: {
    width: 39,
    height: 39,
    borderRadius: 8,
    backgroundColor: '#e7f1e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  identity: { flex: 1, gap: 3 },
  name: { color: '#172b1b', fontSize: 16, fontWeight: '700' },
  community: { color: '#425447', fontSize: 13, lineHeight: 19 },
  plot: { gap: 4, padding: 10, borderRadius: 6, backgroundColor: '#f1f5ec' },
  plotSummary: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  crop: { color: '#224c31', fontSize: 14, fontWeight: '700', textTransform: 'capitalize', flexShrink: 1 },
  area: { color: '#2c4a33', fontSize: 14, fontWeight: '600' },
});
