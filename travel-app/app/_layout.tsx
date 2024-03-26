import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../provider/AuthProvider';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/components/useColorScheme';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Makes sure the user is authenticated before accessing protected pages
const InitialLayout = () => {
  const { session, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;
    if (session) {
      // Redirect authenticated users to the list page
      //console.log("logged")
      router.replace('/(tabs)');
    } else if (!session) {
      // Redirect unauthenticated users to the login page
      //console.log("not logged")
      router.replace('/(auth)/auth');
    }
  }, [session, initialized]);

  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='(auth)' options={{ headerShown: false }} />
    </Stack>
  );
};

// Wrap the app with the AuthProvider
const RootLayout = () => {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <InitialLayout />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
