import { Image } from 'expo-image';
import { useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';

import { GlassBackdrop } from '@/components/ui/GlassBackdrop';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';

import type { useAccount } from '@/hooks/use-account';
import { loginWithEmail, registerWithEmail } from '@/services/account';
import { loginWithGoogle } from '@/services/google-account';

type AuthMode = 'login' | 'signup';

type AuthCardProps = { account: Pick<ReturnType<typeof useAccount>, 'busy' | 'notice' | 'run' | 'setNotice'> };

export function AuthCard({ account }: AuthCardProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isSignup = mode === 'signup';
  const actionLabel = isSignup ? 'Crear cuenta' : 'Iniciar sesión';
  const googleLabel = isSignup ? 'Registrarse con Google' : 'Iniciar sesión con Google';

  const changeMode = (nextMode: AuthMode) => {
    if (account.busy || mode === nextMode) return;
    Keyboard.dismiss();
    account.setNotice('');
    setPassword('');
    setMode(nextMode);
  };

  const submitEmail = () => account.run(async () => {
    Keyboard.dismiss();
    const address = email.trim();
    const name = fullName.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) || !password || (isSignup && !name)) {
      throw new Error('Completa los campos con un correo válido.');
    }

    if (isSignup) {
      await registerWithEmail(name, address, password);
      setMode('login');
      setPassword('');
      return { notice: 'Revisa tu correo para verificar tu cuenta y después inicia sesión.' };
    }

    const profileName = await loginWithEmail(address, password);
    setPassword('');
    return { name: profileName };
  });

  return (
    <View style={styles.card}>
      <GlassBackdrop key={`${mode}-${!!account.notice}`} radius={styles.card.borderRadius} />
      <View pointerEvents="none" style={styles.innerHighlight} />
      <View style={styles.tabs}>
        <GlassButton label="Iniciar sesión" variant="toggle" selected={!isSignup} disabled={account.busy} onPress={() => changeMode('login')} />
        <GlassButton label="Crear cuenta" variant="toggle" selected={isSignup} disabled={account.busy} onPress={() => changeMode('signup')} />
      </View>
      <View style={styles.intro}>
        <Text accessibilityRole="header" style={styles.heading}>
          {isSignup ? 'Regístrate en AgroCampo' : 'Te damos la bienvenida'}
        </Text>
        <Text style={styles.description}>Usa tu correo institucional para acceder.</Text>
      </View>
      <View key={mode} style={styles.fields}>
        {isSignup && (
          <GlassInput label="Nombre completo" placeholder="Tu nombre" autoComplete="name" autoCapitalize="words" value={fullName} onChangeText={setFullName} editable={!account.busy} />
        )}
        <GlassInput
          label="Correo institucional"
          placeholder="nombre@institucion.edu.mx"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          editable={!account.busy}
        />
        <GlassInput
          label="Contraseña"
          placeholder="Tu contraseña"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          value={password}
          onChangeText={setPassword}
          editable={!account.busy}
          secureTextEntry
        />
      </View>
      <View style={styles.actions}>
        <GlassButton label={actionLabel} onPress={submitEmail} disabled={account.busy} />
        <GlassButton
          label={googleLabel}
          variant="secondary"
          leadingIcon={<Image source={require('@/assets/images/google-g.png')} style={styles.googleIcon} contentFit="contain" accessible={false} />}
          disabled={account.busy}
          onPress={() => account.run(async () => {
            const profileName = await loginWithGoogle();
            setPassword('');
            return { name: profileName };
          })}
        />
      </View>
      {account.notice !== '' && (
        <Text accessibilityRole="alert" style={styles.notice}>
          {account.notice}
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
