import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { GlassBackdrop } from './GlassBackdrop';

type GlassButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'toggle';
  selected?: boolean;
  disabled?: boolean;
  leadingIcon?: ReactNode;
};

export function GlassButton({ label, onPress, variant = 'primary', selected = false, disabled = false, leadingIcon }: GlassButtonProps) {
  const isToggle = variant === 'toggle';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: isToggle ? selected : undefined }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondary,
        isToggle && styles.toggle,
        isToggle && selected && styles.selected,
        (pressed || disabled) && styles.pressed,
      ]}
    >
      <GlassBackdrop radius={styles.button.borderRadius} />
      {leadingIcon}
      <Text style={[styles.label, variant !== 'primary' && styles.darkLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#727d74',
    backgroundColor: 'rgba(16,48,29,0.92)',
  },
  secondary: { backgroundColor: '#fff', borderColor: '#747775' },
  toggle: { flex: 1, backgroundColor: 'rgba(255,255,255,0.28)', borderColor: '#a2aaa3' },
  selected: { borderColor: '#68756b', backgroundColor: 'rgba(255,255,255,0.86)' },
  pressed: { opacity: 0.75 },
  label: { color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center', flexShrink: 1 },
  darkLabel: { color: '#1f1f1f' },
});
