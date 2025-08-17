// src/screens/ExamScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { testMap } from '../data';

type Question = {
  enunciado: string;
  opciones: string[];
  respuesta: number;
  imagen?: string;
};

function shuffleArray<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ExamScreen() {
  const nav = useNavigation<any>();
  const { colors, dark } = useTheme();

  // Genera 20 preguntas aleatorias a partir de todos los tests
  function buildExamQuestions(): Question[] {
    const pool: Question[] = [];
    for (const key in testMap) {
      const t: any = (testMap as any)[key];
      if (t && Array.isArray(t.preguntas)) {
        t.preguntas.forEach((q: Question) => pool.push({ ...q }));
      }
    }
    const shuffled = shuffleArray(pool);
    const count = Math.min(20, shuffled.length);
    return shuffled.slice(0, count);
  }

  const handleStartExam = () => {
    const preguntas = buildExamQuestions();
    nav.navigate('Tests', {
      screen: 'Test',
      params: {
        overridePreguntas: preguntas,
        overrideTitulo: 'Examen — 20 preguntas',
      },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Botón Volver */}
      <TouchableOpacity
        style={[styles.backBtn, { backgroundColor: colors.primary }]}
        onPress={() => nav.navigate('Tests')}
      >
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      {/* Contenido ahora justo debajo del botón */}
      <View style={[styles.content, { marginTop: 4 }]}>
        <Text style={[styles.title, { color: colors.text }]}>Ponte a prueba</Text>

        <Text style={[styles.info, { color: dark ? 'rgba(255,255,255,0.78)' : 'rgba(0,0,0,0.65)' }]}>
          ¿Crees que eres capaz de aprobar el examen teórico de armas tipo D y E en España?
        </Text>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={handleStartExam}
        >
          <Text style={styles.primaryText}>Hacer test de examen</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // ahora el contenido no está centrado verticalmente
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // empieza justo debajo del botón
    paddingHorizontal: 12,
  },

  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  info: { fontSize: 14, textAlign: 'center', marginBottom: 18 },

  primaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 170,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '600' },
});
