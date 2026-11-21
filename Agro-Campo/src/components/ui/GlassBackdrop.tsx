import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { StyleSheet, View } from 'react-native';

export function GlassBackdrop({ radius }: { radius: number }) {
  if (!isGlassEffectAPIAvailable() || !isLiquidGlassAvailable()) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <GlassView
        glassEffectStyle="clear"
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />
    </View>
  );
}
