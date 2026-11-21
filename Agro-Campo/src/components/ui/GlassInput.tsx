import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

type GlassInputProps = TextInputProps & { label: string };

export function GlassInput({ label, style, ...props }: GlassInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor="#545d55"
        style={[styles.input, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 5 },
  label: { color: '#253128', fontSize: 13, fontWeight: '600' },
  input: {
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#9ca39d',
    backgroundColor: 'rgba(255,255,255,0.62)',
    color: '#17251a',
    fontSize: 16,
  },
});
