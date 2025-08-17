// src/screens/ResultScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { useScores } from '../context/ScoresContext';

export default function ResultScreen() {
  const { colors, dark } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addScore } = useScores();
  const { titulo, correct, total, mistakes } = route.params;
  const perfect = mistakes.length === 0;

  // Guardamos la puntuación
  useEffect(() => {
    addScore({ titulo, aciertos: correct, errores: mistakes.length, total });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // sólo al montar

// Si hay errores, reempezar sólo con esas preguntas
const redoErrors = () => {
  if (!mistakes || mistakes.length === 0) return;
  navigation.replace('Test', {
    overridePreguntas: mistakes.slice(), // copia por seguridad
    overrideTitulo: `${titulo} (Errores)`
  });
};

const restart = () => {
  // Prioridad 1: si TestScreen pasó las preguntas (overridePreguntas / preguntas)
  const preguntasOriginales = route.params?.preguntas ?? route.params?.overridePreguntas;
  const testIdOriginal = route.params?.testId;

  if (preguntasOriginales && Array.isArray(preguntasOriginales) && preguntasOriginales.length > 0) {
    navigation.replace('Test', {
      overridePreguntas: preguntasOriginales.slice(),
      overrideTitulo: route.params?.titulo ?? titulo
    });
    return;
  }

  // Si veníamos con testId (test normal), reiniciamos con el mismo testId
  if (testIdOriginal) {
    navigation.replace('Test', {
      testId: testIdOriginal
    });
    return;
  }

  // Fallback: volver al listado
  navigation.popToTop();
};

const goBackTests = () => {
  navigation.popToTop();
};

  // Colores para botones
  const accentGreen      = '#2d6a4f';
  const btnPrimaryBg     = accentGreen;
  const btnPrimaryText   = '#fff';
  const btnSecondaryBg   = dark ? '#666' : '#ccc';
  const btnSecondaryText = dark ? '#eee' : '#333';
  const textColor        = colors.text;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background }
      ]}
    >
      {perfect && (
        <ConfettiCannon
          count={150}
          origin={{ x: 200, y: 0 }}
          fadeOut
          fallSpeed={3000}
        />
      )}

      <Text style={[styles.text, { color: textColor }]}>
        Has acertado {correct} de {total}
      </Text>
      <Text style={[styles.text, { color: textColor }]}>
        Has fallado {mistakes.length}
      </Text>

      {/* Volver a TestsList */}
      <TouchableOpacity
        style={[styles.btnSecondary, { backgroundColor: btnSecondaryBg }]}
        onPress={goBackTests}
      >
        <Text style={[styles.btnText, { color: btnSecondaryText }]}>
          Volver
        </Text>
      </TouchableOpacity>

      {/* Rehacer únicamente las preguntas falladas */}
      {mistakes.length > 0 && (
        <TouchableOpacity
          style={[styles.btnSecondary, { backgroundColor: btnSecondaryBg }]}
          onPress={redoErrors}
        >
          <Text style={[styles.btnText, { color: btnSecondaryText }]}>
            Rehacer fallos
          </Text>
        </TouchableOpacity>
      )}

      {/* Reiniciar test completo */}
      <TouchableOpacity
        style={[styles.btnPrimary, { backgroundColor: btnPrimaryBg }]}
        onPress={restart}
      >
        <Text style={[styles.btnText, { color: btnPrimaryText }]}>
          Reiniciar test
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
  },
  btnPrimary: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  btnSecondary: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  btnText: {
    fontWeight: '600',
  },
});
