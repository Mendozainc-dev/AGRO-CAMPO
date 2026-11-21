import { useEffect, useState } from 'react';
import LiquidGlass from 'liquid-glass-react';

export function GlassBackdrop({ radius }: { radius: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // The package reads browser globals during render.
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
