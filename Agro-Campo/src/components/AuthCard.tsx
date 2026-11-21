import { Image } from 'expo-image';
import { useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';

import { GlassBackdrop } from '@/components/ui/GlassBackdrop';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';

type AuthMode = 'login' | 'signup';

export function AuthCard() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showNotice, setShowNotice] = useState(false);
  const isSignup = mode === 'signup';
  const actionLabel = isSignup ? 'Crear cuenta' : 'Iniciar sesión';
  const googleLabel = isSignup ? 'Registrarse con Google' : 'Iniciar sesión con Google';

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
      <GlassBackdrop key={`${mode}-${showNotice}`} radius={styles.card.borderRadius} />
      <View pointerEvents="none" style={styles.innerHighlight} />
      <View style={styles.tabs}>
        <GlassButton label="Iniciar sesión" variant="toggle" selected={!isSignup} onPress={() => changeMode('login')} />
        <GlassButton label="Crear cuenta" variant="toggle" selected={isSignup} onPress={() => changeMode('signup')} />
      </View>
      <View style={styles.intro}>
        <Text accessibilityRole="header" style={styles.heading}>
          {isSignup ? 'Regístrate en AgroCampo' : 'Te damos la bienvenida'}
        </Text>
        <Text style={styles.description}>Usa tu correo institucional para acceder.</Text>
      </View>
      <View key={mode} style={styles.fields}>
        {isSignup && (
          <GlassInput label="Nombre completo" placeholder="Tu nombre" autoComplete="name" autoCapitalize="words" />
        )}
        <GlassInput
          label="Correo institucional"
          placeholder="nombre@institucion.edu.mx"
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
      <View style={styles.actions}>
        <GlassButton label={actionLabel} onPress={showPreviewMessage} />
        <GlassButton
          label={googleLabel}
          variant="secondary"
          leadingIcon={<Image source={require('@/assets/images/google-g.png')} style={styles.googleIcon} contentFit="contain" accessible={false} />}
          onPress={showPreviewMessage}
        />
      </View>
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
    gap: 25,
    padding: 18,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 140,
    overflow: 'hidden',
    borderColor: 'rgba(204,213,208,0.85)',
    borderTopColor: 'rgba(255,255,255,0.96)',
    borderLeftColor: 'rgba(250,255,252,0.88)',
    backgroundColor: 'rgba(249,252,249,0.63)',
  },
  innerHighlight: {
    ...StyleSheet.absoluteFill,
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.19)',
    borderTopColor: 'rgba(255,255,255,0.68)',
    borderLeftColor: 'rgba(255,255,255,0.42)',
  },
  tabs: { flexDirection: 'row', gap: 6 },
  heading: { color: '#192c20', fontSize: 23, fontWeight: '700', letterSpacing: -0.5 },
  intro: { gap: 6 },
  fields: { gap: 11 },
  actions: { gap: 8 },
  googleIcon: { width: 20, height: 20 },
  description: { color: '#253128', fontSize: 14 },
  notice: { color: '#253128', fontSize: 13 },
});
