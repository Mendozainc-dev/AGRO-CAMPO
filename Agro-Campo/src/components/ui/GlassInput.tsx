import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { GlassBackdrop } from './GlassBackdrop';

type GlassInputProps = TextInputProps & { label: string };

export function GlassInput({ label, style, ...props }: GlassInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.surface}>
        <GlassBackdrop radius={styles.surface.borderRadius} />
        <TextInput
          {...props}
          accessibilityLabel={label}
          placeholderTextColor="#545d55"
          style={[styles.input, style]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 5 },
  label: { color: '#253128', fontSize: 13, fontWeight: '600' },
  surface: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#9ca39d',
    backgroundColor: 'rgba(255,255,255,0.62)',
  },
  input: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: '#17251a',
    fontSize: 16,
  },
});
