// src/screens/TestScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageSourcePropType
} from 'react-native';
import { useRoute, useNavigation, useTheme } from '@react-navigation/native';
import { testMap }                         from '../data';
import { imageMap }                        from '../data/images';

type Question = {
  enunciado: string;
  opciones: string[];
  respuesta: number;   // índice 1‑based
  imagen?: string;
};

type RouteParams = {
  testId?: string;
  overridePreguntas?: Question[];
  overrideTitulo?: string;
};

export default function TestScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors, dark } = useTheme();

  // 1️⃣ Leer params
  const { testId, overridePreguntas, overrideTitulo } = route.params as RouteParams;

  // 2️⃣ Determinar titulo y preguntas
  let titulo: string;
  let preguntas: Question[];

  if (overridePreguntas && overridePreguntas.length > 0) {
    titulo    = overrideTitulo ?? 'Test (Errores)';
    preguntas = overridePreguntas;
  } else if (testId && testMap[testId]) {
    const testData = testMap[testId];
    titulo    = testData.titulo;
    preguntas = testData.preguntas;
  } else {
    // Fallback si algo va mal
    titulo    = 'Test desconocido';
    preguntas = [];
  }

  // 3️⃣ Estado interno
  const [index, setIndex]     = useState(0);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState<Question[]>([]);

  const total        = preguntas.length;
  const current      = preguntas[index];
  const correctIndex = current ? current.respuesta - 1 : -1;

  // 4️⃣ Imagen
  const imgSource: ImageSourcePropType | undefined =
    current?.imagen ? (imageMap[current.imagen] as ImageSourcePropType) : undefined;

  let aspectRatio: number | undefined;
  if (imgSource) {
    const { width, height } = Image.resolveAssetSource(imgSource);
    aspectRatio = width / height;
  }
  const maxImageHeight = Dimensions.get('window').height * 0.4;

  const accentGreen = '#2d6a4f';

  // 5️⃣ Al seleccionar opción
  function selectOption(i: number) {
    const isRight = i === correctIndex;
    if (isRight) setCorrect(c => c + 1);
    else setMistakes(m => [...m, current]);

    const next = index + 1;
    if (next >= total) {
      navigation.navigate('Resultado', {
        titulo,
        correct: isRight ? correct + 1 : correct,
        total,
        mistakes: isRight ? mistakes : [...mistakes, current]
      });
    } else {
      setIndex(next);
    }
  }

  function restartTest() {
    setIndex(0);
    setCorrect(0);
    setMistakes([]);
  }

  function goBack() {
    navigation.popToTop();
  }

  // 6️⃣ Colores para stats
  const goodBg   = dark ? '#1a3024' : '#e6f4ea';
  const goodText = accentGreen;
  const badBg    = dark ? '#331a1a' : '#fdecea';
  const badText  = dark ? '#f8d7da' : '#842029';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top buttons */}
        <View style={styles.topButtons}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: accentGreen }]}
            onPress={goBack}
          >
            <Text style={[styles.btnText, { color: '#fff' }]}>Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: accentGreen }]}
            onPress={restartTest}
          >
            <Text style={[styles.btnText, { color: '#fff' }]}>Reiniciar</Text>
          </TouchableOpacity>
        </View>

        {/* Counter */}
        <Text style={[styles.counter, { color: colors.text }]}>
          Pregunta {String(index + 1).padStart(2, '0')} / {total}
        </Text>

        {/* Stats */}
        <View style={styles.stats}>
          <Text style={[styles.good, { backgroundColor: goodBg, color: goodText }]}>
            Aciertos: {correct}
          </Text>
          <Text style={[styles.bad, { backgroundColor: badBg, color: badText }]}>
            Errores: {mistakes.length}
          </Text>
        </View>

        {/* Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* Enunciado */}
          <Text style={[styles.question, { color: colors.text }]}>
            {current?.enunciado}
          </Text>

          {/* Imagen */}
          {imgSource && aspectRatio && (
            <View
              style={[
                styles.imageContainer,
                { maxHeight: maxImageHeight, backgroundColor: colors.card }
              ]}
            >
              <Image
                source={imgSource}
                style={[styles.image, { aspectRatio }]}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Opciones */}
          {current?.opciones.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.option, { backgroundColor: accentGreen }]}
              onPress={() => selectOption(i)}
            >
              <Text style={[styles.optText, { color: '#fff' }]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16 },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6
  },
  btnText: { fontWeight: '600' },
  counter: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12
  },
  good: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    marginRight: 8
  },
  bad: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18
  },
  card: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    marginBottom: 20
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  },
  imageContainer: {
    width: '100%',
    borderRadius: 6,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 12
  },
  image: {
    width: '100%',
    height: undefined
  },
  option: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8
  },
  optText: { fontWeight: '500' }
});
