// src/screens/TestsListScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useTheme } from '@react-navigation/native';
import { testsData, TestItem, testMap } from '../data';
import { imageMap }                   from '../data/images';

export default function TestsListScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: colors.background }]}>
      <FlatList
        data={testsData}
        keyExtractor={(item: TestItem) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const thumbKey = testMap[item.id]?.thumbnail; // "img/tema1.jpg"
          const thumbSrc = thumbKey ? imageMap[thumbKey] : undefined;
          const titulo   = testMap[item.id]?.titulo    ?? item.id;

          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.card }]}
              onPress={() => navigation.navigate('Test', { testId: item.id })}
              activeOpacity={0.8}
            >
              {thumbSrc && <Image source={thumbSrc} style={styles.thumb} />}
              <LinearGradient
                colors={['transparent','rgba(0,50,0,0.8)']}
                locations={[0.3,1]}
                style={styles.overlay}
              />
              <Text style={[styles.title, { color:'#fff' }]}>
                {titulo}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list:  { padding:12, justifyContent:'center' },
  card:  { flex:1, margin:6, height:160, borderRadius:8, overflow:'hidden' },
  thumb: { width:'100%', height:'100%', resizeMode:'cover' },
  overlay: { position:'absolute', bottom:0, left:0, right:0, height:'60%' },
  title: {
    position:'absolute', bottom:8, left:4, right:4,
    textAlign:'center', fontWeight:'600', fontSize:14
  },
});
