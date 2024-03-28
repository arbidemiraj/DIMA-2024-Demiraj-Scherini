import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import React from 'react';

export default function Favourites() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
