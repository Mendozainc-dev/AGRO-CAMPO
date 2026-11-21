import { Pressable, StyleSheet, Text } from 'react-native';

type GlassButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'toggle';
  selected?: boolean;
};

export function GlassButton({ label, onPress, variant = 'primary', selected = false }: GlassButtonProps) {
  const isToggle = variant === 'toggle';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isToggle ? { selected } : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isToggle && styles.toggle,
        isToggle && selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, isToggle && styles.toggleLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#727d74',
    backgroundColor: '#224832',
  },
  toggle: { flex: 1, backgroundColor: 'rgba(255,255,255,0.28)', borderColor: '#a2aaa3' },
  selected: { borderColor: '#68756b', backgroundColor: 'rgba(255,255,255,0.86)' },
  pressed: { opacity: 0.75 },
  label: { color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  toggleLabel: { color: '#20392a' },
});
