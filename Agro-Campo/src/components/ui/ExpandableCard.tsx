import { SymbolView } from 'expo-symbols';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ExpandableCardProps = {
  title: string;
  summary?: string;
  children: ReactNode;
};

export function ExpandableCard({ title, summary, children }: ExpandableCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((current) => !current)}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
      >
        <View style={styles.heading}>
          <Text style={styles.title}>{title}</Text>
          {summary && <Text numberOfLines={2} style={styles.summary}>{summary}</Text>}
        </View>
        <SymbolView
          name={expanded
            ? { ios: 'chevron.up', android: 'expand_less', web: 'expand_less' }
            : { ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
          tintColor="#34553a"
          size={20}
          style={styles.icon}
        />
      </Pressable>
      {expanded && <View style={styles.details}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d3dfd1', borderRadius: 10 },
  header: { minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  heading: { flex: 1, gap: 3 },
  title: { color: '#172b1b', fontSize: 16, fontWeight: '700' },
  summary: { color: '#425447', fontSize: 13, lineHeight: 18 },
  icon: { width: 20, height: 20 },
  pressed: { opacity: 0.7 },
  details: { borderTopWidth: 1, borderColor: '#e0e8df', gap: 6, padding: 12 },
});
