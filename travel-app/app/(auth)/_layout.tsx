import React from 'react';
import { Slot, Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name='login' options={{ headerTitleAlign: 'center', title: 'Login', headerShown: false }} />
      <Stack.Screen name='signup' options={{ headerTitleAlign: 'center', title: 'SignUp', headerShown: false }} />
    </Stack>
  );
}
