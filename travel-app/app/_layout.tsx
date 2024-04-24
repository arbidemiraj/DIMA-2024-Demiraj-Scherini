import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../provider/AuthProvider';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/components/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Iconify } from 'react-native-iconify';
import { Pressable } from 'react-native';
import Colors from '@/constants/Colors';

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
    <Stack
      screenOptions={{
        headerLeft: () => (
          <Pressable onPress={() => router.back()}>
            <Iconify icon='ion:chevron-back-outline' size={28} color={useColorScheme() === 'light' ? Colors.light.text : Colors.dark.text} />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='(auth)' options={{ headerShown: false }} />
      <Stack.Screen name='(trip)/[id]' options={{ headerTransparent: true, headerTitle: '' }} />
      <Stack.Screen name='(visit)/[id]' options={{ headerTitle: 'Visit', headerTitleAlign: 'center' }} />
    </Stack>
  );
};

// Wrap the app with the AuthProvider
const RootLayout = () => {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <AuthProvider>
              <InitialLayout />
            </AuthProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
