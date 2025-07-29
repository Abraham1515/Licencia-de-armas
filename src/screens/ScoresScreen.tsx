// src/screens/ScoresScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import { useScores } from '../context/ScoresContext';

export default function ScoresScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { scores } = useScores();

  function goBack() {
    navigation.navigate('Tests');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backBtn}              // botón fijo en verde
          onPress={goBack}
        >
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        {scores.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No hay puntuaciones aún.
            </Text>
          </View>
        ) : (
          <FlatList
            data={scores}
            keyExtractor={(_, i) => i.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={[styles.item, { backgroundColor: colors.card }]}>
                <Text style={[styles.itemDate, { color: colors.text }]}>
                  {item.fecha}
                </Text>
                <Text style={[styles.itemText, { color: colors.text }]}>
                  {item.titulo}: {item.errores} fallos ({item.aciertos}/{item.total})
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },

  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#2d6a4f',  // verde fijo
    borderRadius: 6
  },
  backText: {
    color: '#fff',                // texto blanco fijo
    fontWeight: '600'
  },

  list: {
    paddingBottom: 16
  },
  item: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 6,
    // sombra iOS
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    // elevación Android
    elevation: 2
  },
  itemDate: {
    fontWeight: '600',
    marginBottom: 4
  },
  itemText: {
    fontSize: 14
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16
  }
});
