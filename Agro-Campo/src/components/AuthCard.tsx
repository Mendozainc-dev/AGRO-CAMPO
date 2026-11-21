import { useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';

import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';

type AuthMode = 'login' | 'signup';

export function AuthCard() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showNotice, setShowNotice] = useState(false);
  const isSignup = mode === 'signup';
  const title = isSignup ? 'Crear cuenta' : 'Iniciar sesión';

  const changeMode = (nextMode: AuthMode) => {
    if (mode === nextMode) return;
    Keyboard.dismiss();
    setShowNotice(false);
    setMode(nextMode);
  };

  const showPreviewMessage = () => {
    Keyboard.dismiss();
    setShowNotice(true);
  };

  return (
    <View style={styles.card}>
      <View style={styles.tabs}>
        <GlassButton label="Iniciar sesión" variant="toggle" selected={!isSignup} onPress={() => changeMode('login')} />
        <GlassButton label="Crear cuenta" variant="toggle" selected={isSignup} onPress={() => changeMode('signup')} />
      </View>
      <Text accessibilityRole="header" style={styles.heading}>{isSignup ? 'Regístrate en AgroCampo' : 'Te damos la bienvenida'}</Text>
      <View key={mode} style={styles.fields}>
        {isSignup && <GlassInput label="Nombre completo" placeholder="Tu nombre" autoComplete="name" autoCapitalize="words" />}
        <GlassInput
          label="Correo electrónico"
          placeholder="nombre@ejemplo.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
        />
        <GlassInput
          label="Contraseña"
          placeholder="Tu contraseña"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          secureTextEntry
        />
      </View>
      <GlassButton label={title} onPress={showPreviewMessage} />
      {showNotice && (
        <Text accessibilityRole="alert" style={styles.notice}>
          La autenticación aún no está habilitada en esta demo.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 420,
    gap: 15,
    padding: 18,
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#a5ada6',
    backgroundColor: 'rgba(249,252,249,0.88)',
  },
  tabs: { flexDirection: 'row', gap: 6 },
  heading: { color: '#192c20', fontSize: 23, fontWeight: '700', letterSpacing: -0.5 },
  fields: { gap: 11 },
  notice: { color: '#253128', fontSize: 13 },
});
