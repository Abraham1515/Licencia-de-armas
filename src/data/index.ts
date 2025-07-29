// src/data/index.ts
import test1 from './test1.json';
import test2 from './test2.json';
import test3 from './test3.json';
import test4 from './test4.json';
import test5 from './test5.json';
import test6 from './test6.json';
import test7 from './test7.json';

export interface TestItem {
  id: string;         // 'test1' … 'test7'
  thumbnail: string;  // la misma clave en tu imageMap
}

// Lista de metadatos para la FlatList
export const testsData: TestItem[] = [
  { id: 'test1', thumbnail: 'test1' },
  { id: 'test2', thumbnail: 'test2' },
  { id: 'test3', thumbnail: 'test3' },
  { id: 'test4', thumbnail: 'test4' },
  { id: 'test5', thumbnail: 'test5' },
  { id: 'test6', thumbnail: 'test6' },
  { id: 'test7', thumbnail: 'test7' },
];

// Mapa para acceder a cada test completo por su id
// (asegúrate de que `typeof test1` encaje con la forma de tus JSON)
export const testMap: Record<string, typeof test1> = {
  test1,
  test2,
  test3,
  test4,
  test5,
  test6,
  test7,
};
