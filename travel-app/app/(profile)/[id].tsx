import { StyleSheet } from 'react-native';
import React from 'react';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/provider/AuthProvider';
import { Redirect } from 'expo-router';

export default function UserProfilePage() {
  const { id } = useLocalSearchParams();
  if (id === useAuth().user?.id) {
    return <Redirect href='/(tabs)/profile' />;
  } else
    return (
      <View style={styles.container}>
        <Text>Other user</Text>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
