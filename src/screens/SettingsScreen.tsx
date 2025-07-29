// src/screens/SettingsScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../context/SettingsContext';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { themeName, setTheme } = useSettings(); // ya no usamos lang ni setLang
  const isDark = themeName === 'dark';

  const containerBg = isDark ? '#222' : '#f4f4f4';
  const cardBg      = isDark ? '#333' : '#fff';
  const textColor   = isDark ? '#eee' : '#111';
  const activeBtnBg = '#2d6a4f';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: containerBg }]}>
      {/* Botón Volver */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate('Tests')}
      >
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <View style={[styles.card, { backgroundColor: cardBg }]}>
        {/* Tema */}
        <Text style={[styles.fieldLabel, { color: textColor }]}>Tema</Text>
        <View style={styles.switchRow}>
          <Text style={{ color: textColor }}>Claro</Text>
          <Switch
            value={isDark}
            onValueChange={v => setTheme(v ? 'dark' : 'light')}
            thumbColor={isDark ? '#f4f4f4' : '#fff'}
            trackColor={{ false: '#999', true: activeBtnBg }}
          />
          <Text style={{ color: textColor }}>Oscuro</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#2d6a4f',
    borderRadius: 6,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
});
