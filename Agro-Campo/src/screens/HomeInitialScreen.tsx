import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthCard } from '@/components/AuthCard';

export function HomeInitialScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <Image source={require('@/assets/images/background.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" />
      <SafeAreaView style={styles.fill}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.fill}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.brand}>
              <Image source={require('@/assets/images/LogoAgroCampo.png')} style={styles.logo} contentFit="contain" />
              <Text accessibilityRole="header" style={styles.title}>AgroCampo</Text>
              <Text style={styles.subtitle}>Bitácora digital de Pénjamo</Text>
            </View>
            <AuthCard />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#292052' },
  fill: { flex: 1 },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  brand: { alignItems: 'center' },
  logo: { width: 112, height: 112 },
  title: { color: '#fff', fontSize: 40, fontWeight: '700', letterSpacing: -1.5 },
  subtitle: { color: '#f1eafc', fontSize: 15, marginTop: 4 },
});
