import { StyleSheet } from 'react-native'
import React from 'react'
import { Text, View } from '@/components/Themed';

export default function Favourites() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favouirtes</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
