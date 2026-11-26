import { useState, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ExpandableCard } from '@/components/ui/ExpandableCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { crops, type Crop } from '@/services/producers-and-plots';

type FieldRecord = {
  id: string;
  crops: readonly string[];
  searchText: (crop: Crop | null) => string;
  render: (crop: Crop | null) => ReactNode;
};

type FieldRecordListProps = {
  records: FieldRecord[];
  searchLabel: string;
  emptyMessage: string;
};

function normalizeSearch(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function FieldRecordList({ records, searchLabel, emptyMessage }: FieldRecordListProps) {
  const [search, setSearch] = useState('');
  const [crop, setCrop] = useState<Crop | null>(null);
  const terms = normalizeSearch(search).trim().split(/\s+/).filter(Boolean);
  const options = crops.filter((value) => records.some((record) => record.crops.includes(value)));
  const filtered = records.filter((record) => {
    if (crop && !record.crops.includes(crop)) return false;
    if (terms.length === 0) return true;

    const text = normalizeSearch(record.searchText(crop));
    return terms.every((term) => text.includes(term));
  });

  if (records.length === 0) return <Text style={styles.body}>{emptyMessage}</Text>;

  return (
    <View style={styles.list}>
      <GlassInput label={searchLabel} value={search} onChangeText={setSearch} autoCorrect={false} returnKeyType="search" />
      {(options.length > 0 || crop !== null) && (
        <ExpandableCard title="Filtrar por cultivo" summary={crop ? crop[0].toUpperCase() + crop.slice(1) : 'Todos los cultivos'}>
          <View style={styles.options}>
            <GlassButton label="Todos" variant="choice" selected={!crop} onPress={() => setCrop(null)} />
            {options.map((value) => (
              <GlassButton
                key={value}
                label={value[0].toUpperCase() + value.slice(1)}
                variant="choice"
                selected={crop === value}
                onPress={() => setCrop(value)}
              />
            ))}
          </View>
        </ExpandableCard>
      )}
      {filtered.length === 0 ? (
        <Text accessibilityLiveRegion="polite" style={styles.body}>No hay resultados con estos filtros.</Text>
      ) : (
        filtered.map((record) => <View key={record.id}>{record.render(crop)}</View>)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  body: { color: '#425447', fontSize: 14, lineHeight: 20 },
});
