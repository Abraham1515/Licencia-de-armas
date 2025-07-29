// src/screens/ProfileScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  StyleSheet
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useScores } from '../context/ScoresContext';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { scores, clearScores } = useScores();

  // Volver al listado de tests
  const goBack = () => navigation.navigate('Tests');

  // Cálculo de estadísticas
  const totalTests = scores.length;
  const avgPct = totalTests === 0
    ? 0
    : Math.round(
        (scores.reduce((sum, s) => sum + (s.aciertos / s.total), 0) / totalTests) * 100
      );

  // Mejor y peor tema
  const temasArray = Object.entries(
    scores.reduce<Record<string, { sum: number; cnt: number }>>((acc, s) => {
      const pct = s.aciertos / s.total;
      if (!acc[s.titulo]) acc[s.titulo] = { sum: 0, cnt: 0 };
      acc[s.titulo].sum += pct;
      acc[s.titulo].cnt += 1;
      return acc;
    }, {})
  )
    .map(([titulo, { sum, cnt }]) => ({ titulo, val: sum / cnt }))
    .sort((a, b) => b.val - a.val);

  const bestText = temasArray.length
    ? `${temasArray[0].titulo} (${Math.round(temasArray[0].val * 100)} %)`
    : '–';
  const worstText = temasArray.length
    ? `${temasArray[temasArray.length - 1].titulo} (${Math.round(temasArray[temasArray.length - 1].val * 100)} %)`
    : '–';

  // Limpiar historial
  const handleClear = () => {
    Alert.alert(
      'Borrar historial',
      '¿Seguro que quieres borrar todo tu historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar', style: 'destructive', onPress: clearScores }
      ]
    );
  };

  // Abre la URL de Política de Privacidad
  const openPrivacy = () => {
    const url = 'https://abraham1515.github.io/Licencia-de-armas/privacidad.html';
    Linking.openURL(url).catch(err => {
      console.error('Error al abrir Política de Privacidad', err);
      Alert.alert('Error', 'No se pudo abrir la Política de Privacidad');
    });
  };

  // Abre ficha de Play Store, si falla usa web
  const openStore = () => {
    const pkg = 'com.abrahamperez.licencia.premium';
    const marketUrl = `market://details?id=${pkg}`;
    const webUrl    = `https://play.google.com/store/apps/details?id=${pkg}`;
    Linking.openURL(marketUrl)
      .catch(() => Linking.openURL(webUrl))
      .catch(err => {
        console.error('No se pudo abrir Play Store', err);
        Alert.alert('Error', 'No se pudo abrir Google Play');
      });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Botón Volver */}
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.primary }]}
          onPress={goBack}
        >
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        {/* Progreso */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Progreso</Text>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Tests realizados:</Text>
            <Text style={[styles.value, { color: colors.text }]}>{totalTests}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Puntuación media:</Text>
            <Text style={[styles.value, { color: colors.text }]}>{avgPct} %</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>✅ Mejor tema:</Text>
            <Text style={[styles.value, styles.bestValue]}>{bestText}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>❌ Tema a mejorar:</Text>
            <Text style={[styles.value, styles.worstValue]}>{worstText}</Text>
          </View>
        </View>

        {/* Enlaces y acciones */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Enlaces</Text>

          <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={handleClear}>
            <Text style={styles.btnText}>🗑 Borrar historial</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={openStore}>
            <Text style={styles.btnText}>⭐ Valorar en Google Play</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={openPrivacy}>
            <Text style={styles.btnText}>🔒 Política de Privacidad</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll:    { padding: 16, paddingBottom: 32 },

  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },

  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center'
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 4,
    flexWrap: 'wrap'
  },
  label: {
    fontWeight: '600',
    flex: 1,
    flexWrap: 'wrap'
  },
  value: {
    fontWeight: '600',
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'right'
  },
  bestValue: {
    color: '#2d6a4f'
  },
  worstValue: {
    color: '#842029'
  },

  btn: {
    backgroundColor: '#2d6a4f',
    borderRadius: 6,
    paddingVertical: 10,
    marginTop: 10
  },
  btnDanger: {
    backgroundColor: '#dc3545'
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center'
  }
});
