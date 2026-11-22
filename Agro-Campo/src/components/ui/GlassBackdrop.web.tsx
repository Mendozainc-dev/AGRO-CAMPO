import LiquidGlass from 'liquid-glass-react';

import { useHydrated } from '@/hooks/use-hydrated';

export function GlassBackdrop({ radius }: { radius: number }) {
  // The package reads browser globals during render.
  if (!useHydrated()) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: radius,
        containerType: 'size',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <LiquidGlass
        cornerRadius={radius}
        padding="0"
        displacementScale={25}
        blurAmount={0.12}
        aberrationIntensity={0.5}
        elasticity={0}
        style={{ position: 'absolute', top: '50%', left: '50%' }}
      >
        <div style={{ width: '100cqw', height: '100cqh' }} />
      </LiquidGlass>
    </div>
  );
}
