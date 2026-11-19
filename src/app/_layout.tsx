import '@/global.css';
import { DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppAuthProvider } from '@/context/auth-context';

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

const RecurlyTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: '#FEFBF6',
    card: '#FEFBF6',
    text: '#0F172A',
  },
};

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1, minHeight: '100%', backgroundColor: '#FEFBF6' }}>
      <AppAuthProvider>
        <ThemeProvider value={RecurlyTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#FEFBF6' },
            }}>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#F1654C' },
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#FEFBF6' },
              }}
            />
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#FEFBF6' },
              }}
            />
          </Stack>
        </ThemeProvider>
      </AppAuthProvider>
    </SafeAreaProvider>
  );
}
