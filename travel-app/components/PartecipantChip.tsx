import { Text, View } from '@/components/Themed';
import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { Link } from 'expo-router';

/**
 * Partecipant Chip component, used to display a
 * user with a name and a icon related to the role,
 * the chip can be clicked to access the user profile
 */

// TODO: change to go to the correct user profile

interface Props {
  username: string;
  role: string;
}

export default function CustomButton({ username, role }: Props) {
  const colorScheme = useColorScheme();

  function RoleIcon(): ReactNode {
    const iconColor = colorScheme === 'light' ? Colors.light.text : Colors.dark.text;
    if (role === 'author') return <Iconify icon='iconoir:user-star' size={28} color={iconColor} />;
    else return <Iconify icon='iconoir:user' size={28} color={iconColor} />;
  }

  return (
    <Link href={{ pathname: '/(tabs)/profile' }}>
      <View style={[styles.container, { borderColor: colorScheme === 'light' ? Colors.light.text : Colors.dark.text, borderTopColor: colorScheme === 'light' ? Colors.light.text : Colors.dark.text, borderBottomColor: colorScheme === 'light' ? Colors.light.text : Colors.dark.text }]}>
        <RoleIcon />
        <Text style={styles.text}>{username}</Text>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
