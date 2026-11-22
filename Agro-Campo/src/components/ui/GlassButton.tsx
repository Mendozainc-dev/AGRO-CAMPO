import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { GlassBackdrop } from './GlassBackdrop';

type GlassButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'toggle' | 'choice';
  selected?: boolean;
  disabled?: boolean;
  leadingIcon?: ReactNode;
};

export function GlassButton({ label, onPress, variant = 'primary', selected = false, disabled = false, leadingIcon }: GlassButtonProps) {
  const isToggle = variant === 'toggle';
  const isChoice = variant === 'choice';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: isToggle || isChoice ? selected : undefined }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondary,
        isToggle && styles.toggle,
        isToggle && selected && styles.selected,
        isChoice && styles.choice,
        isChoice && selected && styles.selectedChoice,
        (pressed || disabled) && styles.pressed,
      ]}
    >
      {!isChoice && <GlassBackdrop radius={styles.button.borderRadius} />}
      {leadingIcon}
      <Text style={[styles.label, variant !== 'primary' && !(isChoice && selected) && styles.darkLabel]}>{label}</Text>
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
  choice: { flex: 1, backgroundColor: '#e7f0e6', borderColor: '#a1b8a3' },
  selectedChoice: { backgroundColor: '#285a3a', borderColor: '#285a3a' },
  pressed: { opacity: 0.75 },
  label: { color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center', flexShrink: 1 },
  darkLabel: { color: '#1f1f1f' },
});
