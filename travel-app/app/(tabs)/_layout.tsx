import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={25} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          headerShown: false,
          title: 'Explore',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <TabBarIcon name='search' color={color} />,
        }}
      />
      <Tabs.Screen
        name='favourites'
        options={{
          title: 'Favourites',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <TabBarIcon name='heart' color={color} />,
        }}
      />
      <Tabs.Screen
        name='newJournal'
        options={{
          title: 'New Journal',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <TabBarIcon name='plus' color={color} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Your Profile',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <TabBarIcon name='user' color={color} />,
        }}
      />
    </Tabs>
  );
}
