import { Image } from 'expo-image';
import type { ComponentType } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProducersAndPlotsScreen } from './ProducersAndPlotsScreen';
import { InspectionsScreen } from './InspectionsScreen';
import { ApplicationsScreen } from './ApplicationsScreen';
import { HarvestsScreen } from './HarvestsScreen';
import { FieldLogHomeScreen } from './FieldLogHomeScreen';

const homeModule = {
  id: 'inicio',
  label: 'Inicio',
  Screen: FieldLogHomeScreen,
  icon: { ios: 'house.fill', android: 'home', web: 'home' },
} as const;

const modules = [
  {
    id: 'parcelas',
    label: 'Parcelas',
    Screen: ProducersAndPlotsScreen,
    accessibilityLabel: 'Productores y parcelas',
    icon: { ios: 'map', android: 'map', web: 'map' },
  },
  {
    id: 'inspecciones',
    label: 'Inspecciones',
    Screen: InspectionsScreen,
    icon: { ios: 'clipboard', android: 'assignment', web: 'assignment' },
  },
  homeModule,
  {
    id: 'aplicaciones',
    label: 'Aplicaciones',
    Screen: ApplicationsScreen,
    icon: { ios: 'drop', android: 'water_drop', web: 'water_drop' },
  },
  {
    id: 'cosechas',
    label: 'Cosechas',
    Screen: HarvestsScreen,
    icon: { ios: 'basket', android: 'shopping_basket', web: 'shopping_basket' },
  },
] as const satisfies readonly {
  id: string;
  label: string;
  Screen: ComponentType;
  accessibilityLabel?: string;
  icon: SymbolViewProps['name'];
}[];

type FieldLogScreenProps = {
  name: string;
};

export function FieldLogScreen({ name }: FieldLogScreenProps) {
  const router = useRouter();
  const { section } = useLocalSearchParams<{ section?: string }>();
  const activeModule = modules.find((module) => module.id === section) ?? homeModule;
  const ActiveScreen = activeModule.Screen;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView style={styles.main} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.brandRow}>
              <Image
                source={require('@/assets/images/LogoAgroCampo.png')}
                style={styles.logo}
                contentFit="contain"
                accessible={false}
              />
              <Text style={styles.brand}>AgroCampo Pénjamo</Text>
            </View>
            <Text accessibilityRole="header" style={styles.title}>Bitácora de campo</Text>
            <Text style={styles.body}>Hola, {name}</Text>
          </View>

          <ActiveScreen />
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.bar}>
        <View accessibilityRole="tablist" style={styles.tabs}>
          {modules.map((module) => {
            const selected = module.id === activeModule.id;
            const isHome = module.id === homeModule.id;
            return (
              <Pressable
                key={module.id}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={'accessibilityLabel' in module ? module.accessibilityLabel : module.label}
                onPress={() => router.setParams({ section: module.id })}
                style={({ pressed }) => [styles.tab, selected && styles.selected, pressed && styles.pressed]}
              >
                <View style={[styles.iconFrame, isHome && styles.homeIconFrame]}>
                  <SymbolView
                    name={module.icon}
                    tintColor={isHome || selected ? '#24613a' : '#536459'}
                    size={23}
                    style={styles.icon}
                  />
                </View>
                <Text style={[styles.label, (isHome || selected) && styles.selectedLabel]}>{module.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f5ec' },
  main: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingVertical: 28 },
  content: { width: '100%', maxWidth: 560, alignSelf: 'center', gap: 24 },
  section: { gap: 10 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 40, height: 40 },
  brand: { color: '#34553a', fontSize: 14, fontWeight: '700', flexShrink: 1 },
  title: { color: '#172b1b', fontSize: 34, fontWeight: '700' },
  body: { color: '#37493b', fontSize: 15 },
  bar: { backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#cbd5c8' },
  tabs: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  tab: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingVertical: 5,
    gap: 3,
    borderRadius: 8,
  },
  selected: { backgroundColor: '#e7f0e6' },
  pressed: { opacity: 0.7 },
  iconFrame: { width: 36, height: 30, alignItems: 'center', justifyContent: 'center' },
  homeIconFrame: { backgroundColor: '#d8edda', borderRadius: 8 },
  icon: { width: 23, height: 23 },
  label: { color: '#536459', fontSize: 11, textAlign: 'center' },
  selectedLabel: { color: '#224c31', fontWeight: '700' },
});
