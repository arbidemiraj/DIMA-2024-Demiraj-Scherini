import { Alert, StyleSheet } from 'react-native'
import React from 'react'
import { Text, View } from '@/components/Themed';
import { Pressable } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function Profile() {

  const doLogOut = async () => {
    console.log("logging out")
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert(error.message);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Pressable onPress={doLogOut}>
        <Text>Log Out</Text>
      </Pressable>
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
