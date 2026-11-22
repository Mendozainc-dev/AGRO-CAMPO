import { StyleSheet, Text, View } from 'react-native';

type FieldLogSectionPlaceholderProps = {
  title: string;
  description: string;
};

export function FieldLogSectionPlaceholder({ title, description }: FieldLogSectionPlaceholderProps) {
  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.status}>En preparación</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderColor: '#cbd5c8',
    borderWidth: 1,
    borderRadius: 10,
  },
  title: { color: '#20392a', fontSize: 19, fontWeight: '700' },
  description: { color: '#37493b', fontSize: 15 },
  status: { color: '#536459', fontSize: 13 },
});
