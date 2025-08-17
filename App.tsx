// App.tsx
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import React from 'react';
import { testMap } from './src/data';


import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  DrawerActions,
  useNavigation,
  useTheme
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import { ScoresProvider }                from './src/context/ScoresContext';

import TestsListScreen from './src/screens/TestsListScreen';
import TestScreen      from './src/screens/TestScreen';
import ResultScreen    from './src/screens/ResultScreen';
import ScoresScreen    from './src/screens/ScoresScreen';
import SettingsScreen  from './src/screens/SettingsScreen';
import ProfileScreen   from './src/screens/ProfileScreen';
import ExamScreen from './src/screens/ExamScreen';

const Drawer = createDrawerNavigator();
const Stack  = createNativeStackNavigator();

// ——— 1) DEFINICIÓN DE TEMAS GLOBALES ———
const customGreen = '#2d6a4f';
const accentBeige = '#F5F5DC';

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: customGreen,
    background: '#f4f4f4',
    card: '#fff',
    text: '#111',
  },
};

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: customGreen,  // seguimos usando verde para los elementos interactivos
    background: '#222',
    card: '#333',
    text: '#eee',
  },
};
// ————————————————————————————————————

function CustomDrawerContent(props: any) {
  const insets = useSafeAreaInsets();
  const { navigation } = props;
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[
        styles.drawerScroll,
        { paddingTop: insets.top + 16 }
      ]}
    >
      <View style={styles.drawerHeader}>
        <View style={styles.logoContainer}>
          <Image
            source={require('./assets/logo.png')}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
        >
          <Text style={styles.closeDrawer}>☰</Text>
        </TouchableOpacity>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function withHamburger(ScreenComponent: React.ComponentType<any>, name: string, title: string) {
  return () => {
    const navigation = useNavigation<any>();
    const { dark } = useTheme();
    const iconColor  = dark ? accentBeige    : customGreen;  // hamburguesa
    const titleColor = dark ? accentBeige    : '#000';        // título en claro negro

    return (
      <Stack.Navigator
        screenOptions={{
          headerLeft: () => (
            <TouchableOpacity
              style={styles.hamburger}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            >
              <Text style={{ fontSize: 24, color: iconColor }}>☰</Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: titleColor,
          },
          headerTintColor: iconColor, // para botones de back automáticos
        }}
      >
        <Stack.Screen name={name} component={ScreenComponent} options={{ title }} />
        {name === 'TestsList' && (
          <>
              <Stack.Screen
                    name="Test"
                    component={TestScreen}
                    options={({ route }: { route: any }) => {
                      const params = route.params ?? {};
                      const headerTitle =
                        params.overrideTitulo ??
                        (params.testId && testMap[params.testId]?.titulo) ??
                        'Test';
                      return { title: headerTitle };
                    }}
                  />
            <Stack.Screen name="Resultado" component={ResultScreen} options={{ title: 'Resultado' }} />
          </>
        )}
      </Stack.Navigator>
    );
  };
}

const TestsStack    = withHamburger(TestsListScreen, 'TestsList', 'Preparación Licencia D y E');
const ExamStack     = withHamburger(ExamScreen,      'ExamRoot', 'Examen');
const ScoresStack   = withHamburger(ScoresScreen,     'ScoresList', 'Historial de Puntuaciones');
const ProfileStack  = withHamburger(ProfileScreen,    'ProfileRoot', 'Perfil');
const SettingsStack = withHamburger(SettingsScreen,   'SettingsRoot', 'Configuración');

function Root() {
  const { themeName } = useSettings();
  
  const isLight = themeName === 'light';

  return (
    <NavigationContainer theme={isLight ? MyLightTheme : MyDarkTheme}>
      <Drawer.Navigator
        // Mantén tu drawer personalizado
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          // Opción activa en modo oscuro: fondo verde + texto blanco
          drawerActiveBackgroundColor: !isLight ? customGreen : undefined,
          drawerActiveTintColor:       !isLight ? '#fff'       : undefined,
          // Opciones inactivas en modo oscuro: texto gris claro
          drawerInactiveTintColor:     !isLight ? '#ccc'       : undefined,
        }}
      >
        <Drawer.Screen
          name="Tests"
          component={TestsStack}
          options={{ drawerLabel: 'Preparación Armas D y E' }}
        />
        <Drawer.Screen
          name="Exam"
          component={ExamStack}
          options={{ drawerLabel: 'Examen'}}
        />
        <Drawer.Screen
          name="Scores"
          component={ScoresStack}
          options={{ drawerLabel: 'Puntuaciones' }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfileStack}
          options={{ drawerLabel: 'Perfil' }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsStack}
          options={{ drawerLabel: 'Configuración' }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


export default function App() {
  return (
    
    <SafeAreaProvider>
      <SettingsProvider>
        <ScoresProvider>
          <Root />
        </ScoresProvider>
      </SettingsProvider>
    </SafeAreaProvider>
    
  );
}

const styles = StyleSheet.create({
  // Drawer personalizado
  drawerScroll: {
    paddingHorizontal: 0,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  closeDrawer: {
    fontSize: 24,
    // color fijo si quieres, o usa accent del tema dentro de CustomDrawerContent
  },

  // Botón “☰” en header
  hamburger: {
    paddingLeft: 16,
  },

  // Los estilos de color para hamburgerText y headerTitle
  // ahora los aplicamos inline en withHamburger, así que podemos eliminarlos:
  // hamburgerText: { … }, headerTitle: { … }
});
