import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassButton } from '@/components/ui/GlassButton';

const modules = [
  { name: 'Productores y parcelas', detail: 'Padrón de productores, cultivos y ubicación de parcelas.' },
  { name: 'Inspecciones', detail: 'Visitas de campo, hallazgos, ubicación y evidencia fotográfica.' },
  { name: 'Aplicaciones', detail: 'Insumos aplicados por parcela, dosis y fecha.' },
  { name: 'Cosechas', detail: 'Volumen cosechado y comprador por parcela.' },
];

type FieldLogScreenProps = {
  name: string;
  notice: string;
  signingOut: boolean;
  onSignOut: () => void;
};

export function FieldLogScreen({ name, notice, signingOut, onSignOut }: FieldLogScreenProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.brand}>AgroCampo Pénjamo</Text>
            <Text accessibilityRole="header" style={styles.title}>Bitácora de campo</Text>
            <Text style={styles.body}>Hola, {name}</Text>
          </View>

          <View style={styles.section}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>Módulos en preparación</Text>
            {modules.map(({ name: moduleName, detail }) => (
              <View key={moduleName} style={styles.module}>
                <Text style={styles.moduleTitle}>{moduleName}</Text>
                <Text style={styles.body}>{detail}</Text>
              </View>
            ))}
          </View>

          <GlassButton
            label={signingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
            onPress={onSignOut}
            disabled={signingOut}
          />
          {notice !== '' && <Text accessibilityRole="alert" style={styles.body}>{notice}</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f5ec' },
  scroll: { paddingHorizontal: 24, paddingVertical: 28 },
  content: { width: '100%', maxWidth: 560, alignSelf: 'center', gap: 24 },
  section: { gap: 10 },
  brand: { color: '#34553a', fontSize: 14, fontWeight: '700' },
  title: { color: '#172b1b', fontSize: 34, fontWeight: '700' },
  sectionTitle: { color: '#172b1b', fontSize: 18, fontWeight: '700' },
  module: {
    gap: 4,
    padding: 15,
    backgroundColor: '#fff',
    borderColor: '#cbd5c8',
    borderWidth: 1,
    borderRadius: 10,
  },
  moduleTitle: { color: '#20392a', fontSize: 16, fontWeight: '700' },
  body: { color: '#37493b', fontSize: 15 },
});
