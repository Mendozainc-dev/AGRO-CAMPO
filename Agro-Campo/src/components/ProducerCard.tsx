import { StyleSheet, Text, View } from 'react-native';

import { ExpandableCard } from '@/components/ui/ExpandableCard';
import type { ProducerWithPlots } from '@/services/producers-and-plots';

const area = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });

export function ProducerCard({ producer }: { producer: ProducerWithPlots }) {
  return (
    <ExpandableCard
      title={producer.nombre}
      summary={`${producer.comunidad} · ${producer.plots.length} ${producer.plots.length === 1 ? 'parcela' : 'parcelas'}`}
    >
      {producer.telefono !== '' && <Text style={styles.community}>Tel. {producer.telefono}</Text>}
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
    </ExpandableCard>
  );
}

const styles = StyleSheet.create({
  community: { color: '#425447', fontSize: 13, lineHeight: 19 },
  plot: { gap: 4, padding: 10, borderRadius: 6, backgroundColor: '#f1f5ec' },
  plotSummary: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  crop: { color: '#224c31', fontSize: 14, fontWeight: '700', textTransform: 'capitalize', flexShrink: 1 },
  area: { color: '#2c4a33', fontSize: 14, fontWeight: '600' },
});
